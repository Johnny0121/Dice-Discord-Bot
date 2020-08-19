require('dotenv').config();
const CommandsModule = require('./commands');
const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const prefix = '/';

const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
for (let file of commandFiles) {
    const command = require(`./Commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log("This Discord Bot is ready to roll!");
});

client.on('message', message => {
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (CommandsModule.commands.roll.includes(command)) {
        client.commands.get('roll').execute(message, args);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);