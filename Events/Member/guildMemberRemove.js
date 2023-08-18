const { EmbedBuilder, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
     */
    async execute(member) {
        const { user, guild } = member;

        //Проверка на наличие вебхука
        if(!process.env.WEBHOOK_EXIT) return;

        const Logger = new WebhookClient({ url: process.env.WEBHOOK_EXIT });

        const Welcome = new EmbedBuilder().setColor("Aqua")
        .setAuthor({ name: user.tag, iconURL: user.avatarURL({ size: 512 }) })
        .setThumbnail(user.avatarURL({ size: 512 }))
        .setDescription([
            `${member} покинул нас, аминь.`,
            ``,
            `Присоединился к нам: <t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
            `Всего на сервере: **${guild.memberCount}** человек`
        ].join("\n"))
        .setFooter({ text: `ID: ${user.id}` }).setTimestamp();

        await Logger.send({ embeds: [Welcome] });
    }
}