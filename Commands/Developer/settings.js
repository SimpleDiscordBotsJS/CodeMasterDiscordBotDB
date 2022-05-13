const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const DB = require("../../Structures/Schemas/GuildSettingsDB");

module.exports = {
    name: "settings",
    description: "Настройки.",
    permission: "ADMINISTRATOR",
    options: [
        { name: "interaction", description: "Выберите действие", type: "STRING", required: true, choices: [
                { name: "Добавить", value: "add" },
                { name: "Удалить", value: "delete" }
            ]
        },
        { name: "module", description: "Выберите, для какого модуля, выберается канал",
            type: "STRING", required: true, choices: [
                { name: "Уведомление о входе", value: "join_channel" },
                { name: "Уведомление о выходе", value: "exit_channel" },
                { name: "Фильтр чата", value: "filter_channel" },
                { name: "Анти SCAM", value: "antiscam_channel" },
                { name: "Анти мульти акк", value: "antimult_channel" },
                { name: "Предложения", value: "suggest_channel" },
                { name: "Аудит - изменено", value: "audit_edit_channel" },
                { name: "Аудит - ужалено", value: "audit_delete_channel" },
                { name: "Новостные ветки", value: "news_thread_create_channel" },
                { name: "Авто-ответчик", value: "auto_responder_channel" },
                { name: "Авто-создание веток", value: "auto_thread_create_channel" },
                { name: "Авто-удаление веток", value: "auto_thread_delete_channel" }
            ]
        },
        { name: "channel", description: "выберите канал", type: "CHANNEL",
            channelTypes: ["GUILD_TEXT", "GUILD_NEWS"], required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guildId, options } = interaction;

        const Choice = options.getString("interaction");
        switch(Choice) {
            case "add" : {
                const Modul = options.getString("module");
                const channel = options.getChannel("channel").id;
                switch(Modul) {
                    case "join_channel" : {
                        client.JoinChannel.set(guildId, channel);
                        await DB.findOneAndUpdate(
                            { GuildID: guildId }, 
                            { JoinChannelID: channel }, 
                            { new: true, upsert: true })
                        .catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "exit_channel" : {
                        client.ExitChannel.set(guildId, channel);
                        await DB.findOneAndUpdate(
                            { GuildID: guildId }, 
                            { ExitChannelID: channel }, 
                            { new: true, upsert: true })
                        .catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "filter_channel" : {
                        client.filtersLog.set(guildId, channel);
                        await DB.findOneAndUpdate(
                            { GuildID: guildId }, 
                            { FilterLogChannelID: channel }, 
                            { new: true, upsert: true })
                        .catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "antiscam_channel" : {
                        client.AntiScamLog.set(guildId, channel);
                        await DB.findOneAndUpdate(
                            { GuildID: guildId }, 
                            { AntiScamChannelID: channel }, 
                            { new: true, upsert: true })
                        .catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "antimult_channel" : {
                        client.AntiMultiAccLog.set(guildId, channel);
                        await DB.findOneAndUpdate(
                            { GuildID: guildId }, 
                            { AntiMultiAccChannelID: channel }, 
                            { new: true, upsert: true })
                        .catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "suggest_channel" : {
                        client.SuggestChannel.set(guildId, channel);
                        await DB.findOneAndUpdate(
                            { GuildID: guildId }, 
                            { SuggestChannelID: channel }, 
                            { new: true, upsert: true })
                        .catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "audit_edit_channel" : {
                        client.AuditEditLog.set(guildId, channel);
                        await DB.findOneAndUpdate(
                            { GuildID: guildId }, 
                            { AuditEditLogChannelID: channel }, 
                            { new: true, upsert: true })
                        .catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "audit_delete_channel" : {
                        client.AuditDeleteLog.set(guildId, channel);
                        await DB.findOneAndUpdate(
                            { GuildID: guildId }, 
                            { AuditDeleteLogChannelID: channel }, 
                            { new: true, upsert: true })
                        .catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "news_thread_create_channel" : {
                        client.NewsThreadChannel.set(guildId, channel);
                        await DB.findOneAndUpdate(
                            { GuildID: guildId }, 
                            { NewsThreadCreateChannelID: channel }, 
                            { new: true, upsert: true })
                        .catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "auto_responder_channel" : {
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;

                            data.AutoResponderChannelsID.push(channel);
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "auto_thread_create_channel" : {
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;

                            data.AutoThreadCreateChannelsID.push(channel);
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "auto_thread_delete_channel" : {
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;

                            data.AutoThreadDeleteChannelsID.push(channel);
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                }
            }
            break;
            case "delete" : {
                const Modul = options.getString("module");
                const channel = options.getChannel("channel").id;
                switch(Modul) {
                    case "join_channel" : {
                        client.JoinChannel.delete(guildId, channel);
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.JoinChannelID = "";
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "exit_channel" : {
                        client.ExitChannel.delete(guildId, channel);
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.ExitChannelID = "";
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "filter_channel" : {
                        client.filtersLog.delete(guildId, channel);
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.FilterLogChannelID = "";
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "antiscam_channel" : {
                        client.AntiScamLog.delete(guildId, channel);
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.AntiScamChannelID = "";
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "antimult_channel" : {
                        client.AntiMultiAccLog.delete(guildId, channel);
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.AntiMultiAccChannelID = "";
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "suggest_channel" : {
                        client.SuggestChannel.delete(guildId, channel);
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.SuggestChannelID = "";
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "audit_edit_channel" : {
                        client.AuditEditLog.delete(guildId, channel);
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.AuditEditLogChannelID = "";
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "audit_delete_channel" : {
                        client.AuditDeleteLog.delete(guildId, channel);
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.AuditDeleteLogChannelID = "";
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "news_thread_create_channel" : {
                        client.NewsThreadChannel.delete(guildId, channel);
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.NewsThreadCreateChannelID = "";
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "auto_responder_channel" : {
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.AutoResponderChannelsID.remove(channel);
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "auto_thread_create_channel" : {
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.AutoThreadCreateChannelsID.remove(channel);
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                    case "auto_thread_delete_channel" : {
                        await DB.findOne({ GuildID: guildId }, async(err, data) => {
                            if(err) throw err;
                            if(!data) return;
                            data.AutoThreadDeleteChannelsID.remove(channel);
                            data.save();
                        }).catch((err) => console.log(err));

                        interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setTimestamp()
                        .setDescription("Настройки применены!")], ephemeral: true});
                    }
                    break;
                }
            }
            break;
        }
    }
}