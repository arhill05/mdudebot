const ytdl = require('ytdl-core');

async function yt(voiceChannel, url) {
  if (voiceChannel && voiceChannel !== null) {
    const connection = await voiceChannel.join();
    const ytStream = ytdl(url);

    const dispatcher = connection.play(ytStream);

    dispatcher.on('error', e => { throw new Error(e); })
    dispatcher.on('end', (reason) => {
      connection.disconnect()
    });
  }
}

function addCommandsToList() {
  let commandDescription =
    `**Play audio from YouTube**
\`%yt https://www.youtube.com/watch?v=AmUCLnN56f0\`
Play the audio from a YouTube video\n\n`;

  global.commandsList.push(commandDescription);
}

addCommandsToList();

module.exports = yt;