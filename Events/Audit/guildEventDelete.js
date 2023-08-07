const { GuildScheduledEventManager, EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildScheduledEventDelete",
    /**
     * @param {GuildScheduledEventManager} guildScheduledEvent
     */
    async execute(guildScheduledEvent) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_EVENT });
        if(!logChannel) return;
        
        const Embed = new EmbedBuilder().setColor("#ea4e4e").setTitle("🎊 __**Ивент удалён**__ 🎊")
        .setDescription(`**${guildScheduledEvent.name}** был успешно удалён: ${guildScheduledEvent.description}`)
        .addFields(
            { name: "Тип ивента", value: `\`${guildScheduledEvent.type}\``, inline: true },
            { name: "Создатель", value: `${guildScheduledEvent.creator}`, inline: true },
            { name: "Начало", value: `<t:${parseInt(guildScheduledEvent.scheduledStartAt / 1000)}:R>`, inline: true },
            { name: "Окончание", value: `<t:${parseInt(guildScheduledEvent.scheduledEndAt / 1000)}:R>`, inline: true }
        )
        .setTimestamp();

        if(guildScheduledEvent.channel) {
            Embed.addFields({ name: "Канал", value: `${guildScheduledEvent.channel}`, inline: true });
        }

        logChannel.send({ embeds: [Embed] });
    }
}