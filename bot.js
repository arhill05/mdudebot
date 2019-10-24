const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const axios = require("axios");
const path = require('path');
global.discordClient = client;
const yt = require('./commands/yt');
const sfx = require('./commands/sfx');
const disconnect = require('./commands/disconnect');
const list = require('./commands/list');

sendErrorMessage = (message) => {
  message.channel.send('Something went wrong... sorry :(');
}

isMessageSentByClient = (message) => message.author.username === client.user.username;

getCommandAndArgs = (message) => {
  const args = message.content
    .slice(1)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  return { command, args };
}

isMessageABotCommand = (message) => message.content.charAt(0) === config.prefix;

processCommand = async (message) => {
  const { command, args } = getCommandAndArgs(message);
  const firstParam = args.shift();

  let voiceChannel = null;
  if (firstParam === "-c")
    voiceChannel = message.guild.channels.find("name", args.join(" "));

  voiceChannel = voiceChannel ? voiceChannel : message.member.voice.channel;

  switch (command) {
    case 'disconnect':
    case 'stop':
      disconnect();
      break;
    case 'list':
      await list(message);
      break;
    case 'yt':
      await yt(voiceChannel, firstParam)
      break;
    default:
      try {
        await sfx(message, command, voiceChannel);
      } catch (err) {
        if (err.message.toLowerCase() === 'sound not found')
          message.channel.send(`I didn't recognize command '${command}'. Sorry!`);
        else { throw err; }
      }
      break;
  }
}

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setActivity("with my penis", { type: 'PLAYING' });
});

client.on("message", async message => {
  try {
    if (!isMessageSentByClient(message) && isMessageABotCommand(message)) {
      await processCommand(message);
    }
  }
  catch (err) {
    sendErrorMessage(message);
    console.error(err);
  }
});

client.login(config.botKey);
