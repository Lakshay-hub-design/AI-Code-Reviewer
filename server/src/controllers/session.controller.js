import Session from '../models/Session.js';

export const getSessions = async (req, res) => {
    try{
      const {
        page = 1,
        limit = 10,
        search = "",
        visibility,
        sort = "recent",
      } = req.query;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const query = {
        $or: [
          { owner: req.user._id },
          { members: req.user._id}
        ]
      }

      if(search){
        query.title = { $regex: search, $options: "i"}
      }

      if (visibility === "public") {
        query.isPublic = true;
      }

      if (visibility === "private") {
        query.isPublic = false;
      }

      const sortOptions = {};

      if (sort === "recent") {
        sortOptions.updatedAt = -1;
      }

      const [ sessions, total ] = await Promise.all([
        Session.find(query)
          .populate("owner", "username avatar displayName")
          .populate("members", "username avatar displayName")
          .sort(sortOptions)
          .skip((pageNumber - 1) * limitNumber)
          .limit(Number(limitNumber)),

        Session.countDocuments(query)
      ])

      res.status(200).json({ 
            message: 'sessions fetched',
            sessions,
            total,
            page: Number(page),
            totalPages: Math.ceil(total/limitNumber)
        });
    }catch(err){
        res.status(500).json({ message: 'Error fetching sessions', error: err.message });
    }
}

export const createSession = async (req, res) => {
    try {
        const { title, language, isPublic } = req.body

        if (!title?.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const session = await Session.create({
            title,
            language: language || 'javascript',
            isPublic: isPublic || false,
            owner: req.user._id,
            members: [req.user._id]
        })

        await session.populate('owner', 'username avatar displayname')

        res.status(201).json({
            message: 'session created succesfully',
            session
        })
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create session', 
            error: err.message
        })
    }
}

export const getSession = async (req, res) => {
    try{
        const session = await Session.findById(req.params.id)
        .populate('owner', 'username avatar displayname')
        .populate('members', 'username avatar displayName');

         if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }


        const isMember = session.members.some(
            (m) => m._id.toString() === req.user._id.toString()
        );
        if (!session.isPublic && !isMember) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json({
            message: 'Session fetched',
            session
        })
    }catch(err){
        res.status(500).json({
            message: 'Failed to fetch session', 
            error: err.message
        })
    }
}

export const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
 
    if (!session) return res.status(404).json({ message: 'Session not found' });
 
    // Only owner can update metadata
    if (session.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can update this session' });
    }
 
    const { title, language, isPublic, code } = req.body;
 
    if (title)              session.title    = title.trim();
    if (language)           session.language = language;
    if (isPublic !== undefined) session.isPublic = isPublic;
    if (code !== undefined) session.code     = code;
 
    await session.save();
    res.status(200).json({ session });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update session', error: err.message });
  }
};
 
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
 
    if (!session) return res.status(404).json({ message: 'Session not found' });
 
    if (session.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can delete this session' });
    }
 
    await session.deleteOne();
    res.status(200).json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete session', error: err.message });
  }
};

export const joinSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
 
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (!session.isPublic) return res.status(403).json({ message: 'Session is private' });
 
    const alreadyMember = session.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
 
    if (!alreadyMember) {
      session.members.push(req.user._id);
      await session.save();
    }
 
    res.status(200).json({ message: 'Joined session' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to join session', error: err.message });
  }
};