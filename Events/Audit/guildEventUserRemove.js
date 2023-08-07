const { GuildScheduledEventManager, GuildMember, EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildScheduledEventUserRemove",
    /**
     * @param {GuildScheduledEventManager} guildScheduledEvent 
     * @param {GuildMember} user 
     */
    async execute(guildScheduledEvent, user) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_EVENT });
        if(!logChannel) return;

        const Embed = new EmbedBuilder().setColor("#ea4e4e").setTitle("🎊 __**Пользователь удалён из ивента**__ 🎊")
        .setDescription(`**${guildScheduledEvent.name}** Пользователь успешно удалён из ивента`)
        .addFields(
            { name: "Ивент", value: `\`${guildScheduledEvent.name}\``, inline: true },
            { name: "Пользователь", value: `${user}`, inline: true }
        )
        .setTimestamp();

        logChannel.send({ embeds: [Embed] });
    }
}