const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./bot-config.json');

disconnect = () => {
    client.voiceConnections.forEach(connection => {
        connection.disconnect();
    })
}

playSound = (message, soundName) => {
    message.member.voiceChannel.join().then(connection => {
        const broadcast = client.createVoiceBroadcast();
        broadcast.playFile(soundName + '.mp3');
        connection.playBroadcast(broadcast);
        broadcast.on('end', () => {
            connection.disconnect();
        })
    })
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
    const split = message.content.split(' ');
    if (split[0][0] === '%' && !message.member.voiceChannel) {
        message.channel.send('Hmm... It seems that you are not in a voice channel. You must be in a voice channel to use this command!');
    } else {
        if (split[0] === '%connect') {
            message.member.voiceChannel.join();
        }

        if (split[0] === '%disconnect') {
            client.voiceConnections.forEach(connection => {
                connection.disconnect();
            })
        }

        if (split[0] === '%quack') {
            playSound(message, 'quack')
        }
        
        if (split[0] === '%relax') {
            playSound(message, 'relax')
        }

        if (split[0] === '%nervous') {
            playSound(message, 'nervous')
        }

        if (split[0] === '%horn') {
            playSound(message, 'horn')
        }

        if (split[0] === '%go') {
            playSound(message, 'go')
        }

        if (split[0] === '%ready') {
            playSound(message, 'ready')
        }

        if (split[0] === '%turn') {
            playSound(message, 'turn')
        }

        if (split[0] === '%why') {
            playSound(message, 'why')
        }

        if (split[0] === '%slut') {
            playSound(message, 'slut')
        }
    }
})

client.login(config.botKey);