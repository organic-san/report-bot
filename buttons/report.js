import * as Discord from 'discord.js';
import 'dotenv/config.js';
import { Database } from '../module/database.js';

export const flag = 'r';

/**
 * 
 * @param {Discord.ButtonInteraction} interaction 
 */
export async function execute(interaction) {
    const db = Database.getInstance();
    const [, reportState, reportId] = interaction.customId.split('-');

    const [data] = await db.select(process.env.REPORT_DATABASE_NAME, ['*'], `id='${reportId}'`);
    const {userId, reportContent, reportMessageId, reportReason, reporterId, guildId, channelId} = data;
    
    const user = await interaction.client.users.fetch(userId);
    const messageDetail = 
        `訊息傳送者: <@${userId}>
        發送頻道: <#${channelId}>
        [訊息連結](https://discord.com/channels/${guildId}${channelId}${reportMessageId})`;

    const embed = new Discord.EmbedBuilder()
        .setAuthor({name: user?.tag, iconURL: user?.displayAvatarURL()})
        .setColor('Yellow')
        .setTitle('檢舉的訊息')
        .setDescription(reportContent)
        .addFields({name: '檢舉理由', value: reportReason})
        .addFields({name: '訊息資訊', value: messageDetail});

    if(reportState === 'none') {
        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('end')
                .setLabel('此檢舉已回應：不做回應')
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(true),
        );
        interaction.message.edit({components: [row]});

    } else if(reportState === 'fail') {
        user?.send({
            content: `此檢舉由管理員審視之後認為並沒有違規，感謝您提供的檢舉。`,
            embeds: [embed]
        });

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('end')
                .setLabel('此檢舉已回應: 駁回檢舉')
                .setStyle(Discord.ButtonStyle.Primary)
                .setDisabled(true),
        );
        interaction.message.edit({components: [row]});

    } else if(reportState === 'success') {
        user?.send({
            content: `此檢舉由管理員審視之後確認確實是有問題的訊息，後續將由管理員處理，感謝您提供的檢舉。`,
            embeds: [embed]
        });

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('end')
                .setLabel('此檢舉已回應：檢舉成案')
                .setStyle(Discord.ButtonStyle.Success)
                .setDisabled(true),
        );
        interaction.message.edit({components: [row]});

    } else if(reportState === 'warn') {
        user?.send({
            content: `管理員認為此檢舉屬於濫訴，因此不做處置。`,
            embeds: [embed]
        });
        
        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('end')
                .setLabel('此檢舉已回應：濫訴')
                .setStyle(Discord.ButtonStyle.Danger)
                .setDisabled(true),
        );
        interaction.message.edit({components: [row]});
    }
}
