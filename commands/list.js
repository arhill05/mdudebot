const soundsUtils = require('../utils/soundsUtils');

async function getFormattedSoundsList() {
  let list = "```Here is a list of all of the available commands:\n";
  list += (await soundsUtils.getAvailableSounds())
    .sort((a, b) => a.localeCompare(b))
    .reduce(soundsUtils.formatFileNames, []);
  list += "```";
  return list;
}

/**
 * Send a formatted list of sounds and commands to the user that sent the command
 * @param {*} message The Discord message instance
 */
async function sendFormattedSoundsListMessage(message) {
  const formattedMessage = await getFormattedSoundsList();
  message.member.send(formattedMessage);
}

module.exports = sendFormattedSoundsListMessage;