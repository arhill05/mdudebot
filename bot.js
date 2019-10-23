const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const axios = require("axios");
const path = require('path');

let availableSounds = [
  "go",
  "go2",
  "dingus",
  "fucked",
  "grin",
  "gtahorn",
  "nervous",
  "quack",
  "ready",
  "relax",
  "slut",
  "tequila",
  "turn",
  "why",
  "wow",
  "horn",
  "alert",
  "snakelong",
  "snaake",
  "realestate",
  "uganda",
  "rip",
  "doubtit",
  "spotted",
  "coldone",
  "curb",
  "dud",
  "wrekt",
  "roommate",
  "yeet",
  "bruh"
];

disconnect = () => {
  client.voiceConnections.forEach(connection => {
    connection.disconnect();
  });
};

sendErrorMessage = (message) => {
  console.log('err');
  message.channel.sendMessage('Something went wrong... sorry :(');
}

playSound = (message, soundName, voiceChannel) => {
  if (availableSounds.indexOf(soundName) < 0) return;
  let channel = voiceChannel ? voiceChannel : message.member.voiceChannel;

  if (channel && channel !== null) {
    channel.join().then(connection => {
      const stream = connection.playFile(soundName + ".mp3", (err, intent) => {
        if (err) console.log(err);
        console.log(intent);
        sendErrorMessage(message);
        disconnect();
      });
      stream.on("end", (reason) => {
        console.log('end');
        console.log(reason);
        connection.disconnect();
      });

      // const stream = fs.createReadStream(`./${soundName}.mp3`)

      // const dispatcher = connection.playStream(stream);
      // const dispatcher = connection.playFile(`./${soundName}.mp3`);
      // dispatcher.on('error', e => { console.log(e); sendErrorMessage(message) })
      // dispatcher.on('end', (reason) => {
      //   console.log('Stream ended because: ' + reason);
      //   connection.disconnect()
      // });
      // dispatcher.on('debug', (info) => {
      //   console.log('DEBUG: ' + info);
      // });
      // dispatcher.on('speaking', (speaking) => {
      //   console.log('DEBUG: speaking ' + speaking);
      // });
      // dispatcher.on('start', () => {
      //   console.log('DEBUG: started');
      // });
    })
    .catch(err => console.log(err));
  }
};

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setActivity("with my penis", { type: 'PLAYING' });
});

client.on("message", async message => {
  if (message.author.username !== client.user.username) {
    const prefix = message.content.charAt(0);
    if (prefix !== config.prefix) return;
    const args = message.content
      .slice(1)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    const firstParam = args.shift();
    let voiceChannel = null;
    if (firstParam === "-c" && isParonityOrMdude(message.author.id))
      voiceChannel = message.guild.channels.find("name", args.join(" "));

    if (command === "disconnect" || command === "stop") {
      client.voiceConnections.forEach(connection => {
        connection.disconnect();
      });
    }

    if (command === "list") {
      let list = "```Here is a list of all of the available commands:";
      availableSounds = availableSounds.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      availableSounds.forEach((sound, index, array) => {
        list += index != array.length - 1 ? `\n%${sound}` : `\n%${sound}`;
      });
      list += "```";
      message.member.sendMessage(list);
    }

    playSound(message, command, voiceChannel);
  }
});

client.login(config.botKey);
