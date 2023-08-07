const { GuildMember, EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member 
     */
    async execute(member) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_MEMBER });
        if(!logChannel) return;
        
        const Embed = new EmbedBuilder().setColor("#70ec46")
        .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
        .setTitle("🙂 __**Новый пользователь**__ 🙂")
        .setDescription(`${member} присоединился к серверу`)
        .addFields(
            { name: "Пользователь", value: `${member}`, inline: true },
            { name: "Создан", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true }
        )
        .setTimestamp();

        logChannel.send({ embeds: [Embed] });
    }
}