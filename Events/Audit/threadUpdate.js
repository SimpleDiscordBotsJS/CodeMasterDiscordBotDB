const { ThreadChannel, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "threadUpdate",
    /**
     * @param {ThreadChannel} oldThread 
     * @param {ThreadChannel} newThread 
     */
    async execute(oldThread, newThread) {
        if(oldThread.type !== "GUILD_NEWS_THREAD" && oldThread.type !== "GUILD_PUBLIC_THREAD" && oldThread.type !== "GUILD_PRIVATE_THREAD") return;

        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_THREAD });
        if(!logChannel) return;
        
        if (oldThread.name !== newThread.name) {
            const Embed = new MessageEmbed()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`${oldThread} | Имя было обновлено`)
            .addField("Старое имя", `${oldThread.name}`, true)
            .addField("Новое имя", `${newThread.name}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]})
        }

        if(oldThread.type !== newThread.type) {
            const Embed = new MessageEmbed()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`${oldThread} | Тип был обновлён`)
            .addField("Старый тип", `${oldThread.type}`, true)
            .addField("Новый тип", `${newThread.type}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]})
        }

        if(oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
            const Embed = new MessageEmbed()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`${oldThread} | Ограничение скорости было обновлено`)
            .addField("Старая скорость", `${oldThread.rateLimitPerUser}`, true)
            .addField("Новая скорость", `${newThread.rateLimitPerUser}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]})
        }

        if(oldThread.parent !== newThread.parent) {
            const Embed = new MessageEmbed()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`${oldThread} | Родитель был обновлен`)
            .addField("Старый родитель", `${oldThread.parent}`, true)
            .addField("Новый родитель", `${newThread.parent}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]})
        }

        if(oldThread.archived !== newThread.archived) {
            const Embed = new MessageEmbed()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`${oldThread} | Значение архивации было обновлено`)
            .addField("Старое значение", `${oldThread.archived}`, true)
            .addField("Новое значение", `${newThread.archived}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]})
        }
    }
}