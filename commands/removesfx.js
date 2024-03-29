const fs = require('fs');
const sfx = require('./sfx');
const soundsUtils = require('../utils/soundsUtils');

async function removeSfx(message, commandName) {

  const existingSounds = await soundsUtils.getAvailableSounds();
  if (!existingSounds.map(sound => sound.toLowerCase()).includes(commandName)) {
    message.channel.send(`A command with the name '${commandName}' does not exist.`)
    return;
  }

  try {
    const soundsPath = soundsUtils.soundsPath;
    const filePath = `${soundsPath}/${commandName}.mp3`;
    fs.unlinkSync(filePath);
    await sfx.updateSoundsListInGlobalCommands();
    message.channel.send(`Successfully removed command '${commandName}'!`);
  }
  catch (err) {
    throw err;
  }
}

function addCommandsToList() {
  let commandDescription =
    `**Remove sound effects**
\`%removesfx meep\`
Remove a sound effect with the given name\n\n`;

  global.commandsList.push({ id: 'removeSfx', commandDescription });
}

addCommandsToList();

module.exports = removeSfx;