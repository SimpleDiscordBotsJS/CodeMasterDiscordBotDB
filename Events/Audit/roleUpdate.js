const { RoleManager, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "roleUpdate",
    /**
     * @param {RoleManager} oldRole 
     * @param {RoleManager} newRole 
     */
    async execute(oldRole, newRole) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_ROLE });
        if(!logChannel) return;
        
        if(oldRole.name !== newRole.name) {
            const Embed = new MessageEmbed()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`${newRole} | Имя роли было обновлено`)
            .addField("Старое имя", `\`${oldRole.name}\``)
            .addField("Новое имя", `\`${newRole.name}\``)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }
        if(oldRole.hexColor !== newRole.hexColor) {
            const Embed = new MessageEmbed()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`${newRole} | Цвет роли был обновлён`)
            .addField("Старый цвет", `\`${oldRole.hexColor}\``)
            .addField("Новый цвет", `\`${newRole.hexColor}\``)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }
        if(oldRole.hoist !== newRole.hoist) {
            const Embed = new MessageEmbed()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`${newRole} | hoist has been updated`)
            .addField("Старый hoist", `${oldRole.hoist}`)
            .addField("Новый hoist", `${newRole.hoist}`)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }
        if(oldRole.icon !== newRole.icon) {
            const Embed = new MessageEmbed()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`${newRole} | Иконка роли была обновлена`)
            .addField("Старая иконка", `${oldRole.icon ? oldRole.iconURL : "None"}`)
            .addField("Новая иконка", `${newRole.icon ? newRole.iconURL : "None"}`)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }
        if(oldRole.mentionable !== newRole.mentionable) {
            const Embed = new MessageEmbed()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`${newRole} | Параметр упоминания был обновлён`)
            .addField("Старый параметр", `\`${oldRole.mentionable}\``)
            .addField("Новый параметр", `\`${newRole.mentionable}\``)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }
        if(oldRole.position !== newRole.position) {
            const Embed = new MessageEmbed()
            .setColor("#3ccffa").setTitle("🚬 __**Роль изменена**__ 🚬")
            .setDescription(`${newRole} | Позиция роли была обновлена`)
            .addField("Старая позиция", `\`${oldRole.position}\``)
            .addField("Новая позиция", `\`${newRole.position}\``)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }
    }
}