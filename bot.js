const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const axios = require('axios');

let availableSounds = [
  'go',
  'go2',
  'dingus',
  'fucked',
  'grin',
  'gtahorn',
  'nervous',
  'quack',
  'ready',
  'relax',
  'slut',
  'tequila',
  'turn',
  'why',
  'wow',
  'horn',
  'alert',
  'snakelong',
  'snaake',
  'realestate',
  'uganda',
  'rip',
  'doubtit',
  'notfine',
  'numb',
  'levelup',
  'wtfboom',
  'rasputin',
  'wtf',
  'wtfreverb',
  'nimbus',
  'nope',
  'awfuck',
  'stopthatsgay',
  'heya'
];

disconnect = () => {
  client.voiceConnections.forEach(connection => {
    connection.disconnect();
  });
};

exports.sendCodeshipBuildNotification = async buildPayload => {
  const build = buildPayload.build;
  const status = build.status;
  const url = config.discordWebhookUrl;

  const data = {
    embeds: [
      {
        title: `${build.project_full_name} build ${status}`,
        author: {
          name: 'Codeship',
          icon_url:
            'https://pbs.twimg.com/profile_images/884879047062323200/6PI7jOx0_400x400.jpg'
        },
        color:
          status === 'error' ? parseInt('ff2100', 16) : parseInt('00ba31', 16),
        description: `Codeship build id ${build.build_id} has a status of ${
          build.status
        }.\n\n\[${build.short_commit_id}](<${build.commit_url}>)\ ${
          build.message
        } by ${build.committer}`,
        url: `${build.build_url}`
      }
    ]
  };

  console.log(data);

  try {
    const response = await axios.post(url, data);
  } catch (err) {
    //console.log(err);
  }
  return data;
};

playSound = (message, soundName, voiceChannel) => {
  if (availableSounds.indexOf(soundName) < 0) return;
  let channel = voiceChannel ? voiceChannel : message.member.voiceChannel;

  if (channel && channel !== null) {
    channel.join().then(connection => {
      const stream = connection.playFile(soundName + '.mp3');
      stream.on('end', () => {
        connection.disconnect();
      });
    });
  }
};

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setGame('with my penis');
});

client.on('message', async message => {
  if (message.author.username !== client.user.username) {
    if (
      (Number(message.author.id) == 103591900732231680 ||
        Number(message.author.id) == 71386725435310080) &&
      message.content.indexOf('partyparrot') > -1
    ) {
      console.log(message.content);
      message.channel.send('<a:aussieparrot:432866431659540482>');
    }
    const prefix = message.content.charAt(0);
    if (prefix !== config.prefix) return;
    const args = message.content
      .slice(1)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    const firstParam = args.shift();
    let voiceChannel = null;
    if (firstParam === '-c' && isParonityOrMdude(message.author.id))
      voiceChannel = message.guild.channels.find('name', args.join(' '));

    if (command === 'ping') {
      const m = await message.channel.send('Ping?');
      m.edit(
        `Pong! Latency is ${m.createdTimestamp -
          message.createdTimestamp}ms. API Latency is ${Math.round(
          client.ping
        )}ms`
      );
    }

    if (command === 'disconnect' || command === 'stop') {
      client.voiceConnections.forEach(connection => {
        connection.disconnect();
      });
    }

    if (command === 'list') {
      let list = '```Here is a list of all of the available commands:';
      availableSounds = availableSounds.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      availableSounds.forEach((sound, index, array) => {
        list += index != array.length - 1 ? `\n%${sound}` : `\n%${sound}`;
      });
      list += '```';
      message.member.sendMessage(list);
    }

    playSound(message, command, voiceChannel);
  }
});

isParonityOrMdude = id => {
  return Number(id) == 103591900732231680 || Number(id) == 71386725435310080;
};

client.login(config.botKey);
