const { RoleManager, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "roleCreate",
    /**
     * @param {RoleManager} role 
     */
    async execute(role) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_ROLE });
        if(!logChannel) return;
        
        const Embed = new MessageEmbed()
        .setColor("#70ec46").setTitle("🚬 __**Роль создана**__ 🚬")
        .setDescription(`${role} была успешно создана`)
        .addField("Роль", `${role}`, true)
        .setTimestamp();

        logChannel.send({embeds: [Embed]});
    }
}