const { GuildScheduledEventManager, GuildMember, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildScheduledEventUserRemove",
    /**
     * @param {GuildScheduledEventManager} guildScheduledEvent 
     * @param {GuildMember} user 
     */
    async execute(guildScheduledEvent, user) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_EVENT });
        if(!logChannel) return;

        const Embed = new MessageEmbed().setColor("#ea4e4e").setTitle("🎊 __**Пользователь удалён из ивента**__ 🎊")
        .setDescription(`**${guildScheduledEvent.name}** Пользователь успешно удалён из ивента`)
        .addField("Ивент", `${guildScheduledEvent.name}`, true)
        .addField("Пользователь", `${user}`, true)
        .setTimestamp();

        logChannel.send({embeds: [Embed]});
    }
}