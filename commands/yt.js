const ytdl = require('ytdl-core');
const config = require('../config.json');

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

    const volume = Number(config.volume) / 100;
    const dispatcher = connection.play(ytStream, { volume: volume, seek: timeParam });
    message.delete();

    message.channel.send('', {
      embed: {
        title: `Now playing: "${info.videoDetails.title}"`,
        description: `Requested by <@${message.author.id}>. \nLink: ${url}\nDuration: ${info.videoDetails.lengthSeconds}s`
      }
    });

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