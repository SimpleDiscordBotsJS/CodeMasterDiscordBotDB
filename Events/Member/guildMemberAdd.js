const { EmbedBuilder, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member
     */
    async execute(member) {
        const { user, guild } = member;

        //member.roles.add("");

        if(!process.env.WEBHOOK_JOIN) return;

        const webhook = new WebhookClient({ url: process.env.WEBHOOK_JOIN });

        const Welcome = new EmbedBuilder().setColor("Aqua")
        .setAuthor({ name: user.tag, iconURL: user.avatarURL({ size: 512 }) })
        .setThumbnail(user.avatarURL({ size: 512 }))
        .setDescription([
            `Рады приветствовать ${member} на **${guild.name}**!`,
            ``,
            `Аккаунт создан: <t:${parseInt(user.createdTimestamp / 1000)}:R>`,
            `Всего на сервере: **${guild.memberCount}** человек`
        ].join("\n"))
        .addFields(
            { name: `**Новости:**`, value: `<#962053378584752178>`, inline: true },
            { name: `**Правила:**`, value: `<#962054528834863194>`, inline: true },
            { name: `**Чат:**`, value: `<#962052402259837029>`, inline: true }
        )
        .setFooter({ text: `ID: ${user.id}` }).setTimestamp();

        await webhook.send({ embeds: [Welcome] });
    }
}