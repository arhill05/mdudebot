async function getFormattedSoundsList() {
  let list = "Here is a list of all of the available commands:\n";
  list += global.commandsList.map(c => c.commandDescription).join('');
  return list;
}

/**
 * Send a formatted list of sounds and commands to the user that sent the command
 * @param {*} message The Discord message instance
 */
async function sendFormattedCommandsListMessage(message) {
  const formattedMessage = await getFormattedSoundsList();
  message.member.send(formattedMessage);
}

module.exports = sendFormattedCommandsListMessage;