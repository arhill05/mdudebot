const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./bot-config.json');

const availableSounds = [
    'go',
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
    'rip'
]
const prefix = '%';

disconnect = () => {
    client
        .voiceConnections
        .forEach(connection => {
            connection.disconnect();
        })
}

playSound = (message, soundName) => {
    if (availableSounds.indexOf(soundName) < 0)
        return;
    message
        .member
        .voiceChannel
        .join()
        .then(connection => {
            const stream = connection.playFile(soundName + '.mp3');
            stream.on('end', () => {
                connection.disconnect()
            });
        })
}

client.on('ready', () => {
    console.log('I am ready!');
    client
        .user
        .setGame('with my penis');
})

client.on('message', async message => {
    if (message.author.username !== client.user.username) {
        const prefix = message.content.charAt(0);
        if (prefix !== config.prefix) return;
        const args = message
            .content
            .slice(1)
            .trim()
            .split(/ +/g);
        const command = args
            .shift()
            .toLowerCase();

        if (command === "ping") {
            const m = await message
                .channel
                .send("Ping?");
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
        }

        if (command === "disconnect" || command === "stop") {
            client
                .voiceConnections
                .forEach(connection => {
                    connection.disconnect();
                })
        }

        if (command === "list") {
            let list = '```Here is a list of all of the available commands:';
            availableSounds.forEach((sound, index, array) => {
                list += index != array.length - 1 ?
                    `\n%${sound}` :
                    `\n%${sound}`
            });
            list += '```';
            message
                .member
                .sendMessage(list);
        }

        playSound(message, command);
    }
})

client.login(config.botKey);