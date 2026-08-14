const jwt = require('jsonwebtoken');

let io = null;

const setIO = (socketIO) => {
  io = socketIO;
};

const initializeNotificationSocket = () => {

  if (!io) {
    throw new Error(
      'Socket.IO is not initialized'
    );
  }

  io.use((socket, next) => {

    try {

      const token =
        socket.handshake.auth?.token;

      if (!token) {
        return next(
          new Error('Authentication required')
        );
      }

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      socket.user = decoded;

      next();

    } catch (error) {

      next(
        new Error('Invalid or expired token')
      );

    }

  });


  io.on('connection', (socket) => {

    const userId =
      socket.user.id;


    socket.join(
      `user:${userId}`
    );


    console.log(
      `User ${userId} connected to notifications`
    );


    socket.on('disconnect', () => {

      console.log(
        `User ${userId} disconnected`
      );

    });

  });

};


const emitToUser = (
  userId,
  notification
) => {

  if (!io) {

    console.warn(
      'Socket.IO is not initialized'
    );

    return;

  }


  io.to(`user:${userId}`).emit(
    'notification:new',
    notification
  );

};


module.exports = {
  setIO,
  initializeNotificationSocket,
  emitToUser,
};