const client = global.discordClient;

disconnect = () => {
  client.voice.connections.forEach(connection => {
    connection.disconnect();
  });
};

module.exports = disconnect;