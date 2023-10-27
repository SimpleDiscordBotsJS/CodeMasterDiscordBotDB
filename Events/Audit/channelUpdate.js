const { Channel, EmbedBuilder, WebhookClient, Client, ChannelType } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "channelUpdate",
    /**
     * @param {Channel} oldChannel
     * @param {Channel} newChannel
     * @param {Client} client
     */
    async execute(oldChannel, newChannel, client) {
        if(!oldChannel.guild) return;
        if(oldChannel.type === (ChannelType.PrivateThread || ChannelType.PublicThread)) return;

        const webHookData = await client.webHooks.get(oldChannel.guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_CHANNEL_WEBHOOK;
        if(!WebHookID || !WebHookToken) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });

        if(oldChannel.name !== newChannel.name) {
            const Embed = new EmbedBuilder()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`\`•\` ${oldChannel} | Имя было изменено`)
            .addFields(
                { name: "Старое имя", value: `\`${oldChannel.name}\``, inline: true },
                { name: "Новое имя", value: `\`${newChannel.name}\``, inline: true }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/channelUpdate/nameUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }

        if(oldChannel.topic !== newChannel.topic) {
            const Embed = new EmbedBuilder()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`\`•\` ${oldChannel} | Тема была изменена`)
            .addFields(
                { name: "Старая темя", value: `\`${oldChannel.topic ? oldChannel.topic : "None"}\``, inline: true },
                { name: "Новая тема", value: `\`${newChannel.topic ? newChannel.topic : "None"}\``, inline: true }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/channelUpdate/topicUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }

        if(oldChannel.position !== newChannel.position) {
            const Embed = new EmbedBuilder()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`\`•\` ${oldChannel} | Позиция была изменена`)
            .addFields(
                { name: "Старая позиция", value: `\`${oldChannel.position}\``, inline: true },
                { name: "Новая позиция", value: `\`${newChannel.position}\``, inline: true }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/channelUpdate/positionUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }

        if(oldChannel.type !== newChannel.type) {
            const Embed = new EmbedBuilder()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`\`•\` ${oldChannel} | Тип был изменён`)
            .addFields(
                { name: "Старый тип", value: `\`${oldChannel.type}\``, inline: true },
                { name: "Новый тип", value: `\`${newChannel.type}\``, inline: true }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/channelUpdate/typeUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }

        if(oldChannel.nsfw !== newChannel.nsfw) {
            const Embed = new EmbedBuilder()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`\`•\` ${oldChannel} | nsfw тип был изменён`)
            .addFields(
                { name: "Старый nsfw", value: `\`${oldChannel.nsfw}\``, inline: true },
                { name: "Новый nsfw", value: `\`${newChannel.nsfw}\``, inline: true }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/channelUpdate/nsfwUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }

        if(oldChannel.bitrate !== newChannel.bitrate) {
            const Embed = new EmbedBuilder()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`\`•\` ${oldChannel} | Битрейт был изменён`)
            .addFields(
                { name: "Старый битрейт", value: `\`${oldChannel.bitrate}\``, inline: true },
                { name: "Новый битрейт", value: `\`${newChannel.bitrate}\``, inline: true }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/channelUpdate/bitrateUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }

        if(oldChannel.userLimit !== newChannel.userLimit) {
            const Embed = new EmbedBuilder()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`\`•\` ${oldChannel} | Лимит пользователей был изменён`)
            .addFields(
                { name: "Старый лимит", value: `\`${oldChannel.userLimit}\``, inline: true },
                { name: "Новый лимит", value: `\`${newChannel.userLimit}\``, inline: true }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/channelUpdate/userLimitUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }

        if(oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
            const Embed = new EmbedBuilder()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`\`•\` ${oldChannel} | Ограничение скорости было изменено`)
            .addFields(
                { name: "Старая скорость", value: `\`${oldChannel.rateLimitPerUser ? oldChannel.rateLimitPerUser : "None"}\``, inline: true },
                { name: "Новая скорость", value: `\`${newChannel.rateLimitPerUser ? newChannel.rateLimitPerUser : "None"}\``, inline: true }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/channelUpdate/rateLimitPerUserUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }

        if(oldChannel.parent !== newChannel.parent) {
            const Embed = new EmbedBuilder()
            .setTitle('🔰 __**Обновление канала**__ 🔰').setColor("#3ccffa")
            .setDescription(`\`•\` ${oldChannel} | Родитель был изменён`)
            .addFields(
                { name: "Старый родитель", value: `\`${oldChannel.parent}\``, inline: true },
                { name: "Новый родитель", value: `\`${newChannel.parent}\``, inline: true }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Audit/channelUpdate/parentUpdate] Произошла ошибка при отправке:\n${e}`);
            });
        }
    }
}