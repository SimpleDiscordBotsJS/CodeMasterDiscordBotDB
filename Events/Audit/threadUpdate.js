const { ThreadChannel, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "threadUpdate",
    /**
     * @param {ThreadChannel} oldThread
     * @param {ThreadChannel} newThread
     * @param {Client} client
     */
    async execute(oldThread, newThread, client) {
        if(oldThread.type !== "GUILD_NEWS_THREAD" && oldThread.type !== "GUILD_PUBLIC_THREAD" && oldThread.type !== "GUILD_PRIVATE_THREAD") return;

        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_THREAD_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
        
        if (oldThread.name !== newThread.name) {
            const Embed = new EmbedBuilder()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`\`•\` ${oldThread} | Имя было обновлено`)
            .addFields(
                { name: "Старое имя", value: `\`${oldThread.name}\``, inline: true },
                { name: "Новое имя", value: `\`${newThread.name}\``, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] })
        }

        if(oldThread.type !== newThread.type) {
            const Embed = new EmbedBuilder()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`\`•\` ${oldThread} | Тип был обновлён`)
            .addFields(
                { name: "Старый тип", value: `\`${oldThread.type}\``, inline: true },
                { name: "Новый тип", value: `\`${newThread.type}\``, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] })
        }

        if(oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
            const Embed = new EmbedBuilder()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`\`•\` ${oldThread} | Ограничение скорости было обновлено`)
            .addFields(
                { name: "Старая скорость", value: `\`${oldThread.rateLimitPerUser}\``, inline: true },
                { name: "Новая скорость", value: `\`${newThread.rateLimitPerUser}\``, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] })
        }

        if(oldThread.parent !== newThread.parent) {
            const Embed = new EmbedBuilder()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`\`•\` ${oldThread} | Родитель был обновлен`)
            .addFields(
                { name: "Старый родитель", value: `\`${oldThread.parent}\``, inline: true },
                { name: "Новый родитель", value: `\`${newThread.parent}\``, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] })
        }

        if(oldThread.archived !== newThread.archived) {
            const Embed = new EmbedBuilder()
            .setTitle("🌳 __**Ветка изменена**__ 🌳").setColor("#3ccffa")
            .setDescription(`\`•\` ${oldThread} | Значение архивации было обновлено`)
            .addFields(
                { name: "Старое значение", value: `\`${oldThread.archived}\``, inline: true },
                { name: "Новое значение", value: `\`${newThread.archived}\``, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] })
        }
    }
}