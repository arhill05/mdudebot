const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./bot-config.json');

const availableSounds = ['go', 'grin', 'gtahorn', 'nervous',
    'quack', 'ready', 'relax', 'slut',
    'tequila', 'turn', 'why', 'wow'
]

disconnect = () => {
    client.voiceConnections.forEach(connection => {
        connection.disconnect();
    })
}

playSound = (message, soundName) => {
    if (availableSounds.indexOf(soundName) > -1) {
        console.log('playing sound ' + soundName)
        message.member.voiceChannel.join().then(connection => {
            const broadcast = client.createVoiceBroadcast();
            broadcast.playFile(soundName + '.mp3');
            connection.playBroadcast(broadcast);
            broadcast.on('end', () => {
                connection.disconnect();
            })
        })
    }
}

client.on('ready', () => {
    console.log('I am ready!');
})

client.on('message', message => {
    if (message.content === 'ping') {
        message.reply('pong');
    }
});

client.on('message', message => {
    const splitMessage = message.content.split(' ');
    if (splitMessage[0][0] === '%' && !message.member.voiceChannel) {
        message.channel.send('Hmm... It seems that you are not in a voice channel. You must be in a voice channel to use this command!');
    } else {
        if (splitMessage[0] === '%connect') {
            message.member.voiceChannel.join();
        }

        else if (splitMessage[0] === '%list') {
            let list = '```Here is a list of all of the available commands:';
            availableSounds.forEach((sound, index, array) => {
                list += index != array.length - 1 ? ` ${sound},` : `${sound}.`
            });
            list += '```'
            message.member.sendMessage('```Here is a list of all of the available commands:\n\n%quack\n%tequila\n%relax\n%nervous\n%horn\n%go\n%ready\n%turn\n%why\n%slut\n%gtahorn\n%wow\n%grin```')
        }

        else if (splitMessage[0] === '%disconnect' || splitMessage[0] === '%stop') {
            client.voiceConnections.forEach(connection => {
                connection.disconnect();
            })
        }

        else {
            console.log(splitMessage);
            let soundName = splitMessage[0].split('%');
            console.log(soundName);
            playSound(message, soundName[1])
        }
    }
})

client.login(config.botKey);