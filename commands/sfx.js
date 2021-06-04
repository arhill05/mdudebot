const path = require('path');
const fs = require('fs');
const client = global.discordClient;
const soundsPath = (path.resolve(__dirname, '../sounds'));
const soundsUtils = require('../utils/soundsUtils');

const vibeSoundsList = [
  'yoshi',
  'tequila',
  'shanty',
  'powerhouse',
  'jam',
  'cancan',
  'ed'
]

const vibeImageList = [
  'https://giphy.com/gifs/Entropiqteam-entropiq-eiq-thisisourworld-wwjOcbKOfbDrChB2Ll',
  'https://giphy.com/gifs/Verohallinto-verohallinto-epi-tax-guy-GY8VcK776YXPTqW9bA',
  'https://giphy.com/gifs/reaction-laughing-lotr-TcdpZwYDPlWXC',
  'https://giphy.com/gifs/tolivealie-head-nod-headbob-scottmcinturf-WS2f4jy5pwHA6oX1Im',
  'https://giphy.com/gifs/snl-saturday-night-live-2000s-3oz8xGza5bsnvxZOBW',
  'https://giphy.com/gifs/hyperrpg-headbang-hyper-rpg-3ohzdKAUplR8k1Q4De',
  'https://giphy.com/gifs/emote-catjam-jpbnoe3UIa8TU8LM13',
  'https://giphy.com/gifs/wayne-waynes-world-mike-myers-PqwqtOLfG19Ti',
];

function pickRandomFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

function toLower(string) {
  return string.toLowerCase();
}

async function playSound(message, soundName, voiceChannel) {
  const availableSounds = (await soundsUtils.getAvailableSounds()).map(toLower);
  if (availableSounds.indexOf(soundName.toLowerCase()) < 0) throw new Error('Sound not found');
  let channel = voiceChannel ? voiceChannel : message.member.voice.channel;

  if (channel && channel !== null) {
    channel.join().then(connection => {
      const volume = soundsUtils.getVolume();
      const dispatcher = connection.play(`${soundsPath}/${soundName}.mp3`, { volume: volume });
      dispatcher.on('error', e => { throw new Error(e); })
      dispatcher.on('finish', (reason) => {
        connection.disconnect()
      });

      if (vibeSoundsList.includes(soundName)) {
        const imageLink = pickRandomFromArray(vibeImageList);
        message.channel.send(imageLink);
      }
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