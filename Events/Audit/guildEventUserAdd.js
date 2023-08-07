const { GuildScheduledEventManager, GuildMember, EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildScheduledEventUserAdd",
    /**
     * @param {GuildScheduledEventManager} guildScheduledEvent 
     * @param {GuildMember} user 
     */
    async execute(guildScheduledEvent, user) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_EVENT });
        if(!logChannel) return;

        const Embed = new EmbedBuilder().setColor("#70ec46").setTitle("🎊 __**Пользователь добавлен в ивент**__ 🎊")
        .setDescription(`**${guildScheduledEvent.name}** Пользователь успешно добавлен в ивент`)
        .addFields(
            { name: "Ивент", value: `\`${guildScheduledEvent.name}\``, inline: true },
            { name: "Пользователь", value: `${user}`, inline: true }
        )
        .setTimestamp();

        logChannel.send({ embeds: [Embed] });
    }
}