const { GuildScheduledEventManager, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "guildScheduledEventUpdate",
    /**
     * @param {GuildScheduledEventManager} oldEvent
     * @param {GuildScheduledEventManager} newEvent
     * @param {Client} client
     */
    async execute(oldEvent, newEvent, client) {
        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_EVENT_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
        
        if(oldEvent.name !== newEvent.name) {
            const Embed = new EmbedBuilder().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Имя ивента было обновлено`)
            .addFields(
                { name: "Старое имя", value: `\`${oldEvent.name}\``, inline: true },
                { name: "Новое имя", value: `\`${newEvent.name}\``, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] });
        }

        if(oldEvent.channel !== newEvent.channel) {
            const Embed = new EmbedBuilder().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Канал ивента был обновлён`)
            .addFields(
                { name: "Старый канал", value: `${oldEvent.channel ? oldEvent.channel : "None"}`, inline: true },
                { name: "Новый канал", value: `${newEvent.channel ? newEvent.channel : "None"}`, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] });
        }

        if(oldEvent.scheduledStartAt !== newEvent.scheduledStartAt) {
            const Embed = new EmbedBuilder().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Дата начала ивента была обновлена`)
            .addFields(
                { name: "Старая дата", value: `${oldEvent.scheduledStartAt ? ("<t:" + parseInt(oldEvent.scheduledStartAt / 1000) + ":R>") : "None"}`, inline: true },
                { name: "Новая дата", value: `${newEvent.scheduledStartAt ? ("<t:" + parseInt(newEvent.scheduledStartAt / 1000) + ":R>") : "None"}`, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] });
        }

        if(oldEvent.scheduledEndAt !== newEvent.scheduledEndAt) {
            const Embed = new EmbedBuilder().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Дата окончания ивента была обновлена`)
            .addFields(
                { name: "Старая дата", value: `${oldEvent.scheduledEndAt ? ("<t:" + parseInt(oldEvent.scheduledEndAt / 1000) + ":R>") : "None"}`, inline: true },
                { name: "Новая дата", value: `${newEvent.scheduledEndAt ? ("<t:" + parseInt(newEvent.scheduledEndAt / 1000) + ":R>") : "None"}`, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] });
        }

        if(oldEvent.description !== newEvent.description) {
            const Embed = new EmbedBuilder().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Описание ивента было обновлено`)
            .addFields(
                { name: "Старое описание", value: `${oldEvent.description ? oldEvent.description : "None"}`, inline: true },
                { name: "Новое описание", value: `${newEvent.description ? newEvent.description : "None"}`, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] });
        }

        if(oldEvent.status !== newEvent.status) {
            const Embed = new EmbedBuilder().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Статус ивента был обновлён`)
            .addFields(
                { name: "Старый статус", value: `${oldEvent.status}`, inline: true },
                { name: "Новый статус", value: `${newEvent.status}`, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] });
        }

        if(oldEvent.entityType !== newEvent.entityType) {
            const Embed = new EmbedBuilder().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Тип ивента был обновлён`)
            .addFields(
                { name: "Старый тип", value: `\`${oldEvent.entityType}\``, inline: true },
                { name: "Новый тип", value: `\`${newEvent.entityType}\``, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] });
        }

        if(oldEvent.entityMetadata !== newEvent.entityMetadata) {
            const Embed = new EmbedBuilder().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Место провидения ивента было обновлено`)
            .addFields(
                { name: "Старое место", value: `${oldEvent.entityMetadata?.location ? oldEvent.entityMetadata.location : "None"}`, inline: true },
                { name: "Новое место", value: `${newEvent.entityMetadata?.location ? newEvent.entityMetadata.location : "None"}`, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] });
        }

        if(oldEvent.privacyLevel !== newEvent.privacyLevel) {
            const Embed = new EmbedBuilder().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Уровень приватности ивента был обновлён`)
            .addFields(
                { name: "Старый уровень", value: `${oldEvent.privacyLevel}`, inline: true },
                { name: "Новый уровень", value: `${newEvent.privacyLevel}`, inline: true }
            )
            .setTimestamp()

            webhook.send({ embeds: [Embed] });
        }
    }
}