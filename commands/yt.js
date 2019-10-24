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

module.exports = yt;