require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const app = require('./src/app');
const sequelize = require('./src/config/database');

const notificationSocket =
  require('./src/services/notification.socket');

const PORT = process.env.PORT || 3008;

const server = http.createServer(app);




const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

notificationSocket.setIO(io);

notificationSocket.initializeNotificationSocket();


const startServer = async () => {

  try {

    await sequelize.authenticate();

    console.log('Database connected');


    server.listen(PORT, () => {

      console.log(
        `Server running on port ${PORT}`
      );

    });

  } catch (error) {

    console.error(
      'Unable to connect to database:',
      error
    );

  }

};


startServer();