import * as Discord from 'discord.js';
import 'dotenv/config.js';
import { Database } from '../module/database.js';

export const data = new Discord.ContextMenuCommandBuilder()
    .setName('Report this message')
    .setNameLocalizations({ 'zh-TW': '檢舉這則訊息' })
    .setType(Discord.ApplicationCommandType.Message);

export const tag = 'interaction';

/**
 * 
 * @param {Discord.MessageContextMenuCommandInteraction} interaction 
 */
export async function execute(interaction) {
    const msg = interaction.targetMessage;

    if(msg.author.bot) return interaction.reply({content: '無法檢舉由機器人所發送的訊息!', ephemeral: true});
    const modal = new Discord.ModalBuilder()
        .setCustomId('report')
        .setTitle('檢舉這則訊息');

    const reportInput = new Discord.TextInputBuilder()
        .setCustomId('reasonInput')
        .setLabel("請描述這則訊息有什麼問題。")
        .setPlaceholder('請確保您的提交出自於善意且符合事實，並請不要提交虛偽或重複的內容。')
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Paragraph);
    const inpurRow = new Discord.ActionRowBuilder().addComponents(reportInput);

    modal.addComponents(inpurRow);
    interaction.showModal(modal);

    const filter = (interaction) => interaction.customId === 'report';
    const submitted = await interaction.awaitModalSubmit({ filter, time: 600_000 });
    if(!submitted) return;

    const reasonContent = submitted.fields.getTextInputValue('reasonInput');
    const userNickname = msg.member?.nickname ? `${msg.member.nickname} (${msg.author.tag})` : msg.author.tag;
    const repoterNickname = interaction.member?.nickname ? `${interaction.member.nickname} (${interaction.user.tag})` : interaction.user.tag;
    const messageDetail = `訊息傳送者: ${msg.author}
        檢舉者: ${interaction.user}
        傳送頻道: ${msg.channel}
        發送於: <t:${Math.floor(msg.createdTimestamp / 1000)}>
        [訊息連結](${msg.url})`;
    const messageEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: userNickname, iconURL: msg.author.displayAvatarURL() })
        .setColor('Yellow')
        .setTitle('訊息內容被檢舉')
        .setDescription(msg.content)
        .addFields({ name: '檢舉理由', value: reasonContent })
        .addFields({ name: '訊息資訊', value: messageDetail })
        .setFooter({ text: `由 ${repoterNickname} 提出檢舉`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp(Math.floor(interaction.createdTimestamp))

    await submitted.reply({ content: "感謝您提交檢舉！伺服器管理員將接手處理這項檢舉。", ephemeral: true, embeds: [messageEmbed] });

    if(!interaction.guild.systemChannel) return;

    const db = Database.getInstance();
    const reportId = await db.insert(process.env.REPORT_DATABASE_NAME, {
        userId: msg.author.id, 
        reportContent: msg.content, 
        reportMessageId: msg.id, 
        reportReason: reasonContent,
        reporterId: interaction.user.id,
        guildId: interaction.guild.id,
        channelId: msg.channel.id,
    });

    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('r-success-' + reportId)
                .setLabel('向檢舉人回應檢舉成功')
                .setStyle(Discord.ButtonStyle.Success),
            new Discord.ButtonBuilder()
                .setCustomId('r-fail-' + reportId) 
                .setLabel('向檢舉人回應駁回檢舉')
                .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
                .setCustomId('r-none-' + reportId) 
                .setLabel('不做回應而結束檢舉流程')
                .setStyle(Discord.ButtonStyle.Secondary),
            /*
            new Discord.ButtonBuilder()
                .setCustomId('r-warn-' + reportId) 
                .setLabel('向檢舉人警告濫發檢舉')
                .setStyle(Discord.ButtonStyle.Danger),
            */
        );

    // TODO: 頻道待修改
    interaction.channel.send({ embeds: [messageEmbed], components: [row] });
}