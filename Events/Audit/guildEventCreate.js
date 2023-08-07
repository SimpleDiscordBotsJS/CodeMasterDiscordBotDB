const { GuildScheduledEventManager, EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildScheduledEventCreate",
    /**
     * @param {GuildScheduledEventManager} guildScheduledEvent
     */
    async execute(guildScheduledEvent) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_EVENT });
        if(!logChannel) return;
        
        const Embed = new EmbedBuilder().setColor("#70ec46").setTitle("🎊 __**Ивент создан**__ 🎊")
        .setDescription(`**${guildScheduledEvent.name}** был успешно создан: ${guildScheduledEvent.description}`)
        .addFields(
            { name: "Тип ивента", value: `\`${guildScheduledEvent.type}\``, inline: true },
            { name: "Создатель", value: `${guildScheduledEvent.creator}`, inline: true },
            { name: "Начало", value: `<t:${parseInt(guildScheduledEvent.scheduledStartAt / 1000)}:R>`, inline: true },
            { name: "Окончание", value: `${guildScheduledEvent.scheduledEndAt ? ("<t:" + parseInt(guildScheduledEvent.scheduledEndAt / 1000) + ":R>") : "\`None\`"}`, inline: true }
        )
        .setTimestamp();

        if(guildScheduledEvent.channel) {
            Embed.addFields({ name: "Канал", value: `${guildScheduledEvent.channel}`, inline: true });
        }

        logChannel.send({ embeds: [Embed] });
    }
}