const { ThreadChannel, EmbedBuilder, WebhookClient } = require("discord.js");

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
            const Embed = new EmbedBuilder()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`${oldThread} | Имя было обновлено`)
            .addFields(
                { name: "Старое имя", value: `\`${oldThread.name}\``, inline: true },
                { name: "Новое имя", value: `\`${newThread.name}\``, inline: true }
            )
            .setTimestamp()

            logChannel.send({ embeds: [Embed] })
        }

        if(oldThread.type !== newThread.type) {
            const Embed = new EmbedBuilder()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`${oldThread} | Тип был обновлён`)
            .addFields(
                { name: "Старый тип", value: `\`${oldThread.type}\``, inline: true },
                { name: "Новый тип", value: `\`${newThread.type}\``, inline: true }
            )
            .setTimestamp()

            logChannel.send({ embeds: [Embed] })
        }

        if(oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
            const Embed = new EmbedBuilder()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`${oldThread} | Ограничение скорости было обновлено`)
            .addFields(
                { name: "Старая скорость", value: `\`${oldThread.rateLimitPerUser}\``, inline: true },
                { name: "Новая скорость", value: `\`${newThread.rateLimitPerUser}\``, inline: true }
            )
            .setTimestamp()

            logChannel.send({ embeds: [Embed] })
        }

        if(oldThread.parent !== newThread.parent) {
            const Embed = new EmbedBuilder()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`${oldThread} | Родитель был обновлен`)
            .addFields(
                { name: "Старый родитель", value: `\`${oldThread.parent}\``, inline: true },
                { name: "Новый родитель", value: `\`${newThread.parent}\``, inline: true }
            )
            .setTimestamp()

            logChannel.send({ embeds: [Embed] })
        }

        if(oldThread.archived !== newThread.archived) {
            const Embed = new EmbedBuilder()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`${oldThread} | Значение архивации было обновлено`)
            .addFields(
                { name: "Старое значение", value: `\`${oldThread.archived}\``, inline: true },
                { name: "Новое значение", value: `\`${newThread.archived}\``, inline: true }
            )
            .setTimestamp()

            logChannel.send({ embeds: [Embed] })
        }
    }
}