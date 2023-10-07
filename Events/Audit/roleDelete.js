const { RoleManager, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "roleDelete",
    /**
     * @param {RoleManager} role
     * @param {Client} client
     */
    async execute(role, client) {
        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_ROLE_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
        
        const Embed = new EmbedBuilder()
        .setColor("#ea4e4e").setTitle("🚬 __**Роль удалена**__ 🚬")
        .setDescription(`\`•\` **${role.name}** была успешно удалена`)
        .addFields(
            { name: "Роль", value: `${role.name}`, inline: true },
            { name: "Создана", value: `<t:${parseInt(role.createdAt / 1000)}:R>`, inline: true }
        )
        .setTimestamp();

        webhook.send({ embeds: [Embed] });
    }
}