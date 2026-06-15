import AccessRequest from "../models/AccessRequest.js"
import Notification from "../models/Notification.js"
import Session from "../models/Session.js"
import { getIo } from "../sockets/index.js"

export const requestAccess = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
        .populate('owner', 'username avatar displayname')

        if(!session){
            return res.status(404).json({
                message: "Session not found"
            })
        }

        if(session.isPublic){
            return res.status(400).json({ message: 'Session is already public'})
        }

        const isMember = session.members.some(
            m => m.toString() === req.user._id.toString()
        )

        if(isMember){
            return res.status(400).json({
                message: 'You are already a member'
            })
        }

        if (session.owner._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You own this session' });
        }

        let accessRequest

        try {
            accessRequest = await AccessRequest.create({
                session: session._id,
                requester: req.user._id,
                owner: session.owner._id,
                status: 'pending'
            })
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({ message: 'You already requested access to this session' });
            }
            throw err;
        }

        const notification = await Notification.create({
            recipient: session.owner._id,
            type: 'access_request',
            data: {
                sessionId:       session._id,
                sessionTitle:    session.title,
                requesterId:     req.user._id,
                requesterName:   req.user.displayName || req.user.username,
                requesterAvatar: req.user.avatar,
                accessRequestId: accessRequest._id,
            }
        })

        const io = getIo()
        io.to(`user:${session.owner._id}`).emit('notification:new', {
            notification: {
                _id:       notification._id,
                type:      notification.type,
                read:      false,
                data:      notification.data,
                createdAt: notification.createdAt,
            }
        })

        res.status(201).json({ message: 'Access request sent successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Failed to send request', error: err.message })
    }
}

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

        await Session.findByIdAndUpdate(accessRequest.session._id, {
            $addToSet: {members: accessRequest.requester._id}
        })

        accessRequest.status = 'approved'
        await accessRequest.save()

        const notification = await Notification.create({
            recipient: accessRequest.requester._id,
            type: 'access_approved',
            data: {
                sessionId: accessRequest.session._id,
                sessionTitle: accessRequest.session.title,
                requesterId: accessRequest.requester._id,
            }
        })

        const io = getIo()
        io.to(`user:${accessRequest.requester._id}`).emit('access:approved', {
            sessionId:    accessRequest.session._id,
            sessionTitle: accessRequest.session.title,
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
 
    // Notify requester
    const notification = await Notification.create({
      recipient: accessRequest.requester._id,
      type:      'access_declined',
      data: {
        sessionId:    accessRequest.session._id,
        sessionTitle: accessRequest.session.title,
        requesterId:  accessRequest.requester._id,
      },
    });
 
    const io = getIO();
    io.to(`user:${accessRequest.requester._id}`).emit('access:declined', {
      sessionId:    accessRequest.session._id,
      sessionTitle: accessRequest.session.title,
    });
 
    res.status(200).json({ message: 'Request declined' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to decline request', error: err.message });
  }
};