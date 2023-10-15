const { RoleManager, EmbedBuilder, WebhookClient, Client } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "roleUpdate",
    /**
     * @param {RoleManager} oldRole
     * @param {RoleManager} newRole
     * @param {Client} client
     */
    async execute(oldRole, newRole, client) {
        const webHookData = await client.webHooks.get(oldRole.guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_ROLE_WEBHOOK;
        if(!WebHookID || !WebHookToken) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
        
        if(oldRole.name !== newRole.name) {
            const Embed = new EmbedBuilder()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`\`•\` ${newRole} | Имя роли было обновлено`)
            .addFields(
                { name: "Старое имя", value: `\`${oldRole.name}\`` },
                { name: "Новое имя", value: `\`${newRole.name}\`` }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/roleUpdate/nameUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }
        if(oldRole.hexColor !== newRole.hexColor) {
            const Embed = new EmbedBuilder()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`\`•\` ${newRole} | Цвет роли был обновлён`)
            .addFields(
                { name: "Старый цвет", value: `\`${oldRole.hexColor}\`` },
                { name: "Новый цвет", value: `\`${newRole.hexColor}\`` }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/roleUpdate/colorUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }
        if(oldRole.hoist !== newRole.hoist) {
            const Embed = new EmbedBuilder()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`\`•\` ${newRole} | hoist has been updated`)
            .addFields(
                { name: "Старый hoist", value: `${oldRole.hoist}` },
                { name: "Новый hoist", value: `${newRole.hoist}` }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/roleUpdate/hoistUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }
        if(oldRole.icon !== newRole.icon) {
            const Embed = new EmbedBuilder()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`\`•\` ${newRole} | Иконка роли была обновлена`)
            .addFields(
                { name: "Старая иконка", value: `${oldRole.icon ? oldRole.iconURL : "None"}` },
                { name: "Новая иконка", value: `${newRole.icon ? newRole.iconURL : "None"}` }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/roleUpdate/iconUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }
        if(oldRole.mentionable !== newRole.mentionable) {
            const Embed = new EmbedBuilder()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`\`•\` ${newRole} | Параметр упоминания был обновлён`)
            .addFields(
                { name: "Старый параметр", value: `\`${oldRole.mentionable}\`` },
                { name: "Новый параметр", value: `\`${newRole.mentionable}\`` }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/roleUpdate/mentionableUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }
        if(oldRole.position !== newRole.position) {
            const Embed = new EmbedBuilder()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`\`•\` ${newRole} | Позиция роли была обновлена`)
            .addFields(
                { name: "Старая позиция", value: `\`${oldRole.position}\`` },
                { name: "Новая позиция", value: `\`${newRole.position}\`` }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/roleUpdate/positionUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }
    }
}