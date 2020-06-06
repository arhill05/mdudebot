const ytdl = require('ytdl-core');

async function yt(voiceChannel, url, message) {
  if (voiceChannel && voiceChannel !== null) {
    const connection = await voiceChannel.join();

    const splitUrl = url.split('?');

    const params = new URLSearchParams(splitUrl[1]);
    const timeParam = params.get('t') === null
      ? null
      : Number(params.get('t'));


    const info = await ytdl.getBasicInfo(url);
    const ytStream = ytdl(url);

    const dispatcher = connection.play(ytStream, { volume: 0.5, seek: timeParam });
    message.delete();
    message.channel.send(`Now playing: "${info.videoDetails.title}" requested by <@${message.author.id}>`);

    dispatcher.on('debug', i => console.log(i));
    dispatcher.on('error', e => {
      message.channel.send('Sorry, something went wrong when trying to play this video :(');
      connection.disconnect();
      throw new Error(e);
    })
    dispatcher.on('finish', (reason) => {
      connection.disconnect()
    });
  } else {
    message.channel.send('You must be in a voice channel to play sound from a YouTube video!')
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