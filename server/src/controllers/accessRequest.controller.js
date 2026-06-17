import AccessRequest from "../models/AccessRequest.js"
import Notification from "../models/Notification.js"
import Session from "../models/Session.js"
import { getIo } from "../sockets/index.js"

export const requestAccess = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("owner", "username avatar displayName");

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Public sessions don't need requests
    if (session.isPublic) {
      return res.status(400).json({
        message: "Session is already public",
      });
    }

    // Owner can't request own session
    if (
      session.owner._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        message: "You own this session",
      });
    }

    // Already a member
    const isMember = session.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "You are already a member",
      });
    }

    let accessRequest = await AccessRequest.findOne({
      session: session._id,
      requester: req.user._id,
    });

    // Existing request checks
    if (accessRequest) {
      if (accessRequest.status === "pending") {
        return res.status(409).json({
          message: "Access request already pending",
        });
      }

      if (accessRequest.status === "approved") {
        return res.status(409).json({
          message: "You already have access",
        });
      }

      // Re-submit declined request
      if (accessRequest.status === "declined") {
        accessRequest.status = "pending";
        await accessRequest.save();
      }
    } else {
      // First request
      accessRequest = await AccessRequest.create({
        session: session._id,
        requester: req.user._id,
        owner: session.owner._id,
        status: "pending",
      });
    }

    // Always create a fresh notification
    const notification = await Notification.create({
      recipient: session.owner._id,
      type: "access_request",
      status: "pending",
      data: {
        sessionId: session._id,
        sessionTitle: session.title,

        requesterId: req.user._id,
        requesterName:
          req.user.displayName ||
          req.user.username,

        requesterAvatar: req.user.avatar,

        accessRequestId: accessRequest._id,
      },
    });

    // Realtime notification
    const io = getIo();

    io.to(`user:${session.owner._id}`).emit(
      "notification:new",
      {
        notification,
      }
    );

    return res.status(201).json({
      message: "Access request sent successfully",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to send request",
      error: err.message,
    });
  }
};

export const acceptRequest = async (req, res) => {
    try {
        const accessRequest = await AccessRequest.findById(req.params.id)
            .populate('requester', 'username avatar displayName')
            .populate('session',   'title owner');

        if (!accessRequest) return res.status(404).json({ message: 'Request not found' });

        if (accessRequest.session.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the session owner can accept requests' });
        }

        if (accessRequest.status !== 'pending') {
            return res.status(400).json({ message: `Request already ${accessRequest.status}` });
        }

        const updatedSession = await Session.findByIdAndUpdate(
        accessRequest.session._id,
        {
            $addToSet: {
            members: accessRequest.requester._id,
            },
        },
        { new: true }
        )
        .populate(
        "owner",
        "username avatar displayName"
        )
        .populate(
        "members",
        "username avatar displayName"
        );

        accessRequest.status = 'approved'
        await accessRequest.save()

        await Notification.findOneAndUpdate(
            {   
                recipient: req.user._id,
                type: "access_request",
                "data.accessRequestId": accessRequest._id,
            },
            {
                status: "approved",
                read: true,
            }
        );

        const notification = await Notification.create({
            recipient: accessRequest.requester._id,
            type: 'access_approved',
            status: 'approved',
            data: {
                sessionId: accessRequest.session._id,
                sessionTitle: accessRequest.session.title,
            }
        })

        const io = getIo()
        io.to(`user:${accessRequest.requester._id}`).emit('access:approved', {
            session: updatedSession
        });

        io.to(`user:${accessRequest.requester._id}`)
            .emit("notification:new", {
                notification,
            });

        res.status(200).json({ message: 'Request accepted' })
    } catch (err) {
        res.status(500).json({ message: 'Failed to accept request', error: err.message })
    }
}

export const declineRequest = async (req, res) => {
  try {
    const accessRequest = await AccessRequest.findById(req.params.id)
      .populate('requester', 'username')
      .populate('session', 'title owner');
 
    if (!accessRequest) return res.status(404).json({ message: 'Request not found' });
 
    if (accessRequest.session.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the session owner can decline requests' });
    }
 
    if (accessRequest.status !== 'pending') {
      return res.status(400).json({ message: `Request already ${accessRequest.status}` });
    }
 
    accessRequest.status = 'declined';
    await accessRequest.save();

    await Notification.findOneAndUpdate(
        {   
            recipient: req.user._id,
            type: "access_request",
            "data.accessRequestId": accessRequest._id,
        },
        {
            status: "declined",
            read: true,
        }
    );
 
    // Notify requester
    const notification = await Notification.create({
      recipient: accessRequest.requester._id,
      type:      'access_declined',
      status: 'declined',
      data: {
        sessionId:    accessRequest.session._id,
        sessionTitle: accessRequest.session.title,
        requesterId:  accessRequest.requester._id,
      },
    });
 
    const io = getIo();
    io.to(`user:${accessRequest.requester._id}`).emit('access:declined', {
      sessionId:    accessRequest.session._id,
      sessionTitle: accessRequest.session.title,
    });

    io.to(`user:${accessRequest.requester._id}`)
        .emit("notification:new", {
            notification,
        });
 
    res.status(200).json({ message: 'Request declined' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to decline request', error: err.message });
  }
};