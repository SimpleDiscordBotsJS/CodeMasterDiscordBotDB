const { RoleManager, EmbedBuilder, WebhookClient, Client } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "roleCreate",
    /**
     * @param {RoleManager} role
     * @param {Client} client
     */
    async execute(role, client) {
        const webHookData = await client.webHooks.get(role.guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_ROLE_WEBHOOK;
        if(!WebHookID || !WebHookToken) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
        
        const Embed = new EmbedBuilder()
        .setColor("#70ec46").setTitle("🚬 __**Роль создана**__ 🚬")
        .setDescription(`\`•\` ${role} была успешно создана`)
        .addFields({ name: "Роль", value: `${role}`, inline: true })
        .setTimestamp();

        webhook.send({ embeds: [Embed] }).catch(e => {
            return Error(`[Audit/roleCreate] Произошла ошибка при отправке:\n${e}`);
        });
    }
}