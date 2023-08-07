const { GuildMember, EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member 
     */
    async execute(member) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_MEMBER });
        if(!logChannel) return;
        
        const Embed = new EmbedBuilder().setColor("#ea4e4e")
        .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
        .setTitle("🙁 __**Пользователь покинул нас**__ 🙁")
        .setDescription(`${member} покинул сервер`)
        .addFields(
            { name: "Пользователь", value: `${member}`, inline: true },
            { name: "Создан", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true }
        )
        .setTimestamp();

        logChannel.send({embeds: [Embed]});
    }
}