const { RoleManager, EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
    name: "roleDelete",
    /**
     * @param {RoleManager} role 
     */
    async execute(role) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_ROLE });
        if(!logChannel) return;
        
        const Embed = new EmbedBuilder()
        .setColor("#ea4e4e").setTitle("🚬 __**Роль удалена**__ 🚬")
        .setDescription(`**${role.name}** была успешно удалена`)
        .addFields(
            { name: "Роль", value: `${role.name}`, inline: true },
            { name: "Создана", value: `<t:${parseInt(role.createdAt / 1000)}:R>`, inline: true }
        )
        .setTimestamp();

        logChannel.send({ embeds: [Embed] });
    }
}