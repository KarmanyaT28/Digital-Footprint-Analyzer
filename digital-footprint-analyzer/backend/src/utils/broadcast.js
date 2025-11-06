let io;

function initSocket(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: { origin: '*' } // or process.env.FRONTEND_ORIGIN
  });

  io.of('/realtime').on('connection', (socket) => {
    console.log('Realtime client connected', socket.id);
    socket.on('subscribeOrg', (orgId) => {
      socket.join(`org:${orgId}`);
    });
    socket.on('disconnect', () => {});
  });
}

function broadcastAssetUpdate(orgId, payload) {
  if (!io) throw new Error('Socket.IO not initialized yet');
  io.of('/realtime').to(`org:${orgId}`).emit('asset:update', payload);
}

module.exports = { initSocket, broadcastAssetUpdate };
