const fs = require('fs');
const ytdl = require('ytdl-core');
const sfx = require('./sfx');
const soundsUtils = require('../utils/soundsUtils');
const kheruneId = '73233639424401408';

async function addSfx(message, url, commandName) {
  const isKherune = message.author.id === kheruneId;
  if (isKherune) {
    message.channel.send(`Kherune has abused his powers and lost the ability to add new sounds`);
    return;
  }
  const isValid = ytdl.validateURL(url);
  if (!isValid) {
    message.channel.send(`Hmm... looks like that url isn't a valid video.`);
    return;
  }

  const existingSounds = await soundsUtils.getAvailableSounds();
  if (existingSounds.map(sound => sound.toLowerCase()).includes(commandName)) {
    message.channel.send(`A command with the name '${commandName}' already exists.`)
    return;
  }

  try {
    const soundsPath = soundsUtils.soundsPath;
    ytdl(url, {
      quality: "highestaudio",
      highWaterMark: 1 << 25,
      filter: "audioonly",
    })
      .pipe(
        fs.createWriteStream(`${soundsPath}/${commandName}.mp3`)
      );

      await sfx.updateSoundsListInGlobalCommands()
    message.channel.send(`Successfully added command '${commandName}'!`);
  }
  catch (err) {
    throw err;
  }
}

function addCommandsToList() {
  let commandDescription =
    `**Add sound effects**
\`%addsfx https://www.youtube.com/watch?v=AmUCLnN56f0 meep\`
Lets you add a command by simply giving a Youtube URL and a name\n\n`;

  global.commandsList.push({ id: 'addsfx', commandDescription });
}

addCommandsToList();

module.exports = addSfx;