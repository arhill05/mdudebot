const client = global.discordClient;

disconnect = () => {
  client.voice.connections.forEach(connection => {
    connection.disconnect();
  });
};

function addCommandsToList() {
  let commandDescription =
    `**Force a disconnect**
\`%stop\`
Force the bot to stop playing and disconnect from the channel\n\n`;

  global.commandsList.push({ id: 'disconnect', commandDescription });
}

addCommandsToList();

module.exports = disconnect;