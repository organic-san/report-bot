import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import text from '../localization/command.json' assert {type: 'json'};
import { getLocale } from '../module/common.js';

export const data = new SlashCommandBuilder()
    .setName('account')
    .setNameLocalizations({'zh-TW': '帳號查詢'})
    .setDescription('Retrieve user\'s relevant information.')
    .setDescriptionLocalizations({'zh-TW': '查詢用戶的相關資訊'})
    .addSubcommand(opt => opt
        .setName('birthday')
        .setNameLocalizations({'zh-TW': '建立日期'})
        .setDescription('Retrieve the date when the user created their account.')
        .setDescriptionLocalizations({'zh-TW': '查詢用戶創建帳號的日期'})
        .addUserOption(opt => opt
            .setName('user')
            .setDescriptionLocalizations({'zh-TW': '對象'})
            .setDescription('Select the target user to be queried.')
            .setDescriptionLocalizations({'zh-TW': '選擇要查詢的對象'})
        )
    ).addSubcommand(opt => opt
        .setName('avatar')
        .setNameLocalizations({'zh-TW': '用戶頭像'})
        .setDescription('查詢用戶的頭像網址')
        .setDescriptionLocalizations({'zh-TW': 'Retrieve the user\'s avatar URL.'})
        .addUserOption(opt => opt
            .setName('user')
            .setDescriptionLocalizations({'zh-TW': '對象'})
            .setDescription('Select the target user to be queried.')
            .setDescriptionLocalizations({'zh-TW': '選擇要查詢的對象'})
        )
        .addIntegerOption(opt => opt
            .setName('size')
            .setNameLocalizations({'zh-TW': '尺寸'})
            .setDescription('The required image size.')
            .setDescriptionLocalizations({'zh-TW': '所要的圖片大小'})
            .addChoices(
                {name: '16', value: 16},
                {name: '32', value: 32},
                {name: '64', value: 64},
                {name: '128', value: 128},
                {name: '256', value: 256},
                {name: '512', value: 512},
                {name: '1024', value: 1024},
                {name: '2048', value: 2048},
            )
        )
    );

export const tag = "interaction";

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
    const locale = interaction.locale;

    if (interaction.options.getSubcommand() === 'birthday') {
        const user = interaction.options.getUser('user') ?? interaction.user;
        interaction.reply(time(user.createdAt, getLocale(text, locale, 'accountCreatedTime', user.tag), locale));
    } else if (interaction.options.getSubcommand() === 'avatar') {

        const embed = new EmbedBuilder().setColor('Yellow');

        const user = interaction.options.getUser('user') ?? interaction.user;
        const size = interaction.options.getInteger('size') ?? 256;
        embed.setDescription(`這是 ${user.tag} 的的頭像網址`)
            .addFields({name: `頭像網址(${size}×${size})`,
                value: `[png](${user.displayAvatarURL({ dynamic: true, format: "png", size: size })}) | ` +
                `[jpg](${user.displayAvatarURL({ dynamic: true, format: "jpg", size: size })}) | ` +
                `[webp](${user.displayAvatarURL({ dynamic: true, format: "webp", size: size })})`})
            .setThumbnail(user.displayAvatarURL({ dynamic: true, format: "png", size: size }));
        interaction.reply({ embeds: [embed] });
    }
}

function time(time, preset, locale) {
    //#region 現在時刻
    let char = "";
    switch (time.getDay()) {
        case 0: char = "WeekSunday"; break;
        case 1: char = "WeekMonday"; break;
        case 2: char = "WeekTuesday"; break;
        case 3: char = "WeekWednesday"; break;
        case 4: char = "WeekThursday"; break;
        case 5: char = "WeekFriday"; break;
        case 6: char = "WeekSaturday"; break;
    }
    return preset + 
        getLocale(text, locale, 'DateShowsString', time.getFullYear(), time.getMonth() + 1, time.getDate()) + " " +
        getLocale(text, locale, char) + " " +
        getLocale(text, locale, 'TimeShowString', time.getHours(), time.getMinutes(), time.getSeconds(), time.getTimezoneOffset() / 60 <= 0 ? "+" : "-", Math.abs(time.getTimezoneOffset() / 60))
}