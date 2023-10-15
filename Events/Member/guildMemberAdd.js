const { EmbedBuilder, WebhookClient, GuildMember, Client } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client) {
        const { user, guild } = member;

        //member.roles.add("");

        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.JOIN_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });

        const Welcome = new EmbedBuilder().setColor("Aqua")
        .setAuthor({ name: user.tag, iconURL: user.avatarURL({ size: 512 }) })
        .setThumbnail(user.avatarURL({ size: 512 }))
        .setDescription([
            `Рады приветствовать ${member} на **${guild.name}**!`,
            ``,
            `\` ➥ \` Аккаунт создан: <t:${parseInt(user.createdTimestamp / 1000)}:R>`,
            `\` ➥ \` Всего на сервере: **${guild.memberCount}** человек`
        ].join("\n"))
        .addFields(
            { name: `**Новости:**`, value: `<#962053378584752178>`, inline: true },
            { name: `**Правила:**`, value: `<#962054528834863194>`, inline: true },
            { name: `**Чат:**`, value: `<#962052402259837029>`, inline: true }
        )
        .setFooter({ text: `ID: ${user.id}` }).setTimestamp();

        await webhook.send({ embeds: [Welcome] }).catch(e => {
            return Error(`[Member/guildMemberAdd] Произошла ошибка при отправке:\n${e}`);
        });
    }
}