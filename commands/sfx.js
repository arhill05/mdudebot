const path = require('path');
const fs = require('fs');
const client = global.discordClient;
const soundsPath = (path.resolve(__dirname, '../sounds'));
const soundsUtils = require('../utils/soundsUtils');

function toLower(string) {
  return string.toLowerCase();
}

async function playSound(message, soundName, voiceChannel) {
  const availableSounds = (await soundsUtils.getAvailableSounds()).map(toLower);
  if (availableSounds.indexOf(soundName.toLowerCase()) < 0) throw new Error('Sound not found');
  let channel = voiceChannel ? voiceChannel : message.member.voice.channel;

  if (channel && channel !== null) {
    channel.join().then(connection => {
      const dispatcher = connection.play(`${soundsPath}/${soundName}.mp3`);
      dispatcher.on('error', e => { throw new Error(e); })
      dispatcher.on('finish', (reason) => {
        connection.disconnect()
      });
    })
      .catch(err => console.log(err));
  }
};

async function addCommandsToList() {
  let commandDescription =
    `**Sound Effects**
\`%soundName\` will play the given sound in the channel you are in
\`%soundName -c General\` will play the given sound in channel "General"

Sounds:
${(await soundsUtils.getAvailableSounds())
      .sort((a, b) => a.localeCompare(b))
      .reduce(soundsUtils.formatFileNames, [])}\n\n`
  global.commandsList.push(commandDescription);
}

addCommandsToList();

module.exports = playSound;