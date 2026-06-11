import Session from "../models/Session.js"

export const editorHandler = (io, socket) => {
    socket.on('join-session', async ({sessionId, userId}) => {
        try {
            socket.join(sessionId)

            socket.to(sessionId).emit('user-joined', {
                userId,
                socketId: socket.id
            })

            const session = await Session.findById(sessionId).select('code language')
            if(session){
                socket.emit('session-state', {
                    code: session.code,
                    language: session.language
                })
            }
        } catch (err) {
            socket.emit('error', { message: 'Failed to join session' })
        }
    })

    socket.on('code-change', ({sessionId, delta}) => {
        socket.to(sessionId).emit('code-change', {delta, socketId: socket.id})
    })

    socket.on('code-save', async({ sessionId, code }) => {
        try {
            await Session.findByIdAndUpdate(sessionId, {
                code,
                lastEditedAt: new Date()
            })
        } catch (err) {
            console.error('code-save error:', err.message);
        }
    })

    socket.on('language-change', ({ sessionId, language }) => {
        socket.to(sessionId).emit('language-change', { language });
    });

    socket.on('disconnecting', () => {
        socket.rooms.forEach((room) => {
            if (room !== socket.id) {
                socket.to(room).emit('user-left', { socketId: socket.id });
            }
        });
    });
}