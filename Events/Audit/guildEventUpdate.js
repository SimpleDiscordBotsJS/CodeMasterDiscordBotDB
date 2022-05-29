const { GuildScheduledEventManager, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildScheduledEventUpdate",
    /**
     * @param {GuildScheduledEventManager} oldEvent 
     * @param {GuildScheduledEventManager} newEvent 
     */
    async execute(oldEvent, newEvent) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_EVENT });
        if(!logChannel) return;
        
        if(oldEvent.name !== newEvent.name) {
            const Embed = new MessageEmbed().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Имя ивента было обновлено`)
            .addField("Старое имя", oldEvent.name, true)
            .addField("Новое имя", newEvent.name, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]});
        }

        if(oldEvent.channel !== newEvent.channel) {
            const Embed = new MessageEmbed().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Канал ивента был обновлён`)
            .addField("Старый канал", `${oldEvent.channel ? oldEvent.channel : "None"}`, true)
            .addField("Новый канал",`${newEvent.channel ? newEvent.channel : "None"}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]});
        }

        if(oldEvent.scheduledStartAt !== newEvent.scheduledStartAt) {
            const Embed = new MessageEmbed().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Дата начала ивента была обновлена`)
            .addField("Старая дата",`${oldEvent.scheduledStartAt ? oldEvent.scheduledStartAt : "None"}`, true)
            .addField("Новая дата", `${newEvent.scheduledStartAt ? newEvent.scheduledStartAt : "None"}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]});
        }

        if(oldEvent.scheduledEndAt !== newEvent.scheduledEndAt) {
            const Embed = new MessageEmbed().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Дата окончания ивента была обновлена`)
            .addField("Старая дата", `${oldEvent.scheduledEndAt ? oldEvent.scheduledEndAt : "None"}`, true)
            .addField("Новая дата", `${newEvent.scheduledEndAt ? newEvent.scheduledEndAt : "None"}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]});
        }

        if(oldEvent.description !== newEvent.description) {
            const Embed = new MessageEmbed().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Описание ивента было обновлено`)
            .addField("Старое описание", `${oldEvent.description ? oldEvent.description : "None"}`, true)
            .addField("Новое описание", `${newEvent.description ? newEvent.description : "None"}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]});
        }

        if(oldEvent.status !== newEvent.status) {
            const Embed = new MessageEmbed().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Статус ивента был обновлён`)
            .addField("Старый статус", `${oldEvent.status}`, true)
            .addField("Новый статус", `${newEvent.status}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]});
        }

        if(oldEvent.entityType !== newEvent.entityType) {
            const Embed = new MessageEmbed().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Тип ивента был обновлён`)
            .addField("Старый тип", `${oldEvent.entityType}`, true)
            .addField("Новый тип", `${newEvent.entityType}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]});
        }

        if(oldEvent.entityMetadata !== newEvent.entityMetadata) {
            const Embed = new MessageEmbed().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Место провидения ивента было обновлено`)
            .addField("Старое место", `${oldEvent.entityMetadata?.location ? oldEvent.entityMetadata.location : "None"}`, true)
            .addField("Новое место", `${newEvent.entityMetadata?.location ? newEvent.entityMetadata.location : "None"}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]});
        }

        if(oldEvent.privacyLevel !== newEvent.privacyLevel) {
            const Embed = new MessageEmbed().setColor("#3ccffa").setTitle("🎊 __**Ивент обновлён**__ 🎊")
            .setDescription(`[${newEvent.name}](${newEvent}) | Уровень приватности ивента был обновлён`)
            .addField("Старый уровень", `${oldEvent.privacyLevel}`, true)
            .addField("Новый уровень", `${newEvent.privacyLevel}`, true)
            .setTimestamp()

            logChannel.send({embeds: [Embed]});
        }
    }
}