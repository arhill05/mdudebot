const fs = require('fs');
const ytdl = require('ytdl-core');
const soundsUtils = require('../utils/soundsUtils');

async function addSfx(message, url, commandName) {
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
    ytdl(url)
      .pipe(
        fs.createWriteStream(`${soundsPath}/${commandName}.mp3`)
      );
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

  global.commandsList.push(commandDescription);
}

addCommandsToList();

module.exports = addSfx;