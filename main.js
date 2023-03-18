import fs from 'fs';
import * as Discord from 'discord.js';
import 'dotenv/config.js';
import { Database } from './module/database.js';
import { channel } from 'diagnostics_channel';

const options = {
    restTimeOffset: 100,
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.DirectMessages, 
        Discord.GatewayIntentBits.GuildMessageReactions
    ],
};

const client = new Discord.Client(options);

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = `./commands/${file}`;
    const command = await import(filePath);
    if ('data' in command && 'tag' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data", "tag" or "execute" property.`);
    }
}

client.buttonCommands = new Discord.Collection();
const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
    const filePath = `./buttons/${file}`;
    const command = await import(filePath);
    if ('flag' in command && 'execute' in command) {
        client.buttonCommands.set(command.flag, command);
    } else {
        console.log(`[WARNING] The button command at ${filePath} is missing a required "flag" or "execute" property.`);
    }
}

client.login(process.env.LOGIN_TOKEN);
const db = Database.getInstance('./data/data.db');

client.on(Discord.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // if (!interaction.channel.permissionsFor(client.user).has(Discord.Permissions.FLAGS.SEND_MESSAGES) ||
    //     !interaction.channel.permissionsFor(client.user).has(Discord.Permissions.FLAGS.ADD_REACTIONS) ||
    //     !interaction.channel.permissionsFor(client.user).has(Discord.Permissions.FLAGS.VIEW_CHANNEL))
    //     return interaction.reply({ content: "我不能在這裡說話!", ephemeral: true });

    //讀取指令ID，過濾無法執行(沒有檔案)的指令
    let commandName = "";
    commandName = interaction.commandName + (!!interaction.options.getSubcommand(false) ? "/" + interaction.options.getSubcommand(false) : "");

    console.log("ChatInputInteraction/CommandName: " + commandName + ", from guild: " + interaction.guild.name)
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        if (command.tag === "interaction") await command.execute(interaction);
    } catch (error) {
        errorReslove(error, interaction);
    }
});

client.on(Discord.Events.InteractionCreate, async interaction => {
	if (!interaction.isMessageContextMenuCommand()) return;

    let commandName = interaction.commandName;

    console.log("ContextMenuInteraction/CommandName: " + commandName + ", from guild: " + interaction.guild.name)
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        errorReslove(error, interaction);
    }
});

client.on(Discord.Events.InteractionCreate, async interaction => {
	if (!interaction.isButton()) return;
    await interaction.deferUpdate().catch(() => {});


    const [commandFlag] = interaction.customId.split('-');
    console.log("ButtonInteraction/CommandName: " + interaction.customId + ", from guild: " + interaction.guild.name)
    const command = client.buttonCommands.get(commandFlag);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        errorReslove(error, interaction);
    }
});

function errorReslove(error, interaction) {
    console.error(error);
    try {
        if (interaction.replied || interaction.deferred) {
            interaction.followUp({ content: '糟糕! 好像出了點錯誤!', embeds: [], components: [], ephemeral: true });
        } else {
            interaction.reply({ content: '糟糕! 好像出了點錯誤!', ephemeral: true })
        }
    } catch (err) {
        console.log(err);
    }
}

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    // let now = new Date(Date.now());
    // let filename = `./error/${now.getFullYear()}#${now.getMonth()+1}#${now.getDate()}-${now.getHours()}h${now.getMinutes()}m${now.getSeconds()}#${now.getMilliseconds()}s.txt`;
    // fs.writeFile(filename, JSON.stringify(error, null, '\t'), function (err){
    //     if (err)
    //         console.log(err);
    // });
    // client.channels.fetch(process.env.CHECK_CH_ID).then(channel => channel.send(`<@${process.env.OWNER1ID}>，ERROR`)).catch(() => {});
});

