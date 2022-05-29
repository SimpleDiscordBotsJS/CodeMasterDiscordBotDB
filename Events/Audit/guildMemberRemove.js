const { GuildMember, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member 
     */
    async execute(member) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_MEMBER });
        if(!logChannel) return;
        
        const Embed = new MessageEmbed().setColor("#ea4e4e")
        .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
        .setTitle("🙁 __**Пользователь покинул нас**__ 🙁")
        .setDescription(`${member} покинул сервер`)
        .addField("Пользователь", `${member}`, true)
        .addField("Создан", `${member.user.createdAt}`, true)
        .setTimestamp();

        logChannel.send({embeds: [Embed]});
    }
}