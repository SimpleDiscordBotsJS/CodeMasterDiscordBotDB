const { ChannelManager, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "channelUpdate",
    /**
     * @param {ChannelManager} oldChannel
     * @param {ChannelManager} newChannel
     */
    async execute(oldChannel, newChannel) {
        if(!oldChannel.guild) return;
        if(oldChannel.type === "GUILD_NEWS_THREAD") return;
        if(oldChannel.type === "GUILD_PUBLIC_THREAD") return;
        if(oldChannel.type === "GUILD_PRIVATE_THREAD ") return;

        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_CHANNEL });
        if(!logChannel) return;

        if(oldChannel.name !== newChannel.name) {
            const Embed = new MessageEmbed()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`${oldChannel} | Имя было изменено`)
            .addField("Старое имя", `${oldChannel.name}`, true)
            .addField("Новое имя", `${newChannel.name}`, true)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldChannel.topic !== newChannel.topic) {
            const Embed = new MessageEmbed()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`${oldChannel} | Тема была изменена`)
            .addField("Старая темя", `${oldChannel.topic ? oldChannel.topic : "None"}`, true)
            .addField("Новая тема", `${newChannel.topic ? newChannel.topic : "None"}`, true)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldChannel.position !== newChannel.position) {
            const Embed = new MessageEmbed()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`${oldChannel} | Позиция была изменена`)
            .addField("Старая позиция", `${oldChannel.position}`, true)
            .addField("Новая позиция", `${newChannel.position}`, true)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldChannel.type !== newChannel.type) {
            const Embed = new MessageEmbed()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`${oldChannel} | Тип был изменён`)
            .addField("Старый тип", `${oldChannel.type}`, true)
            .addField("Новый тип", `${newChannel.type}`, true)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldChannel.nsfw !== newChannel.nsfw) {
            const Embed = new MessageEmbed()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`${oldChannel} | nsfw тип был изменён`)
            .addField("Старый nsfw", `${oldChannel.nsfw}`, true)
            .addField("Новый nsfw", `${newChannel.nsfw}`, true)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldChannel.bitrate !== newChannel.bitrate) {
            const Embed = new MessageEmbed()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`${oldChannel} | Битрейт был изменён`)
            .addField("Старый битрейт", `${oldChannel.bitrate}`, true)
            .addField("Новый битрейт", `${newChannel.bitrate}`, true)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldChannel.userLimit !== newChannel.userLimit) {
            const Embed = new MessageEmbed()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`${oldChannel} | Лимит пользователей был изменён`)
            .addField("Старый лимит", `${oldChannel.userLimit}`, true)
            .addField("Новый лимит", `${newChannel.userLimit}`, true)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
            const Embed = new MessageEmbed()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`${oldChannel} | Ограничение скорости было изменено`)
            .addField("Старая скорость", `${oldChannel.rateLimitPerUser ? oldChannel.rateLimitPerUser : "None"}`, true)
            .addField("Новая скорость", `${newChannel.rateLimitPerUser ? newChannel.rateLimitPerUser : "None"}`, true)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldChannel.parent !== newChannel.parent) {
            const Embed = new MessageEmbed()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`${oldChannel} | Родитель был изменён`)
            .addField("Старый родитель", `${oldChannel.parent}`, true)
            .addField("Новый родитель", `${newChannel.parent}`, true)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }
    }
}