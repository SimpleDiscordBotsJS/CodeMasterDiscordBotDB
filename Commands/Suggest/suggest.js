const { CommandInteraction, MessageEmbed,  MessageActionRow, MessageButton } = require("discord.js");
const { Error } = require("../../Utilites/Logger");
const SetupDB = require("../../Structures/Schemas/Suggest/SuggestSetupDB");
const DB = require("../../Structures/Schemas/Suggest/SuggestDB");

module.exports = {
    name: "suggest",
    nameLocalizations: {
        "ru": "предложить"
    },
    description: "Suggest",
    descriptionLocalizations: {
        "ru": "Предложить"
    },
    cooldown: 300000,
    options: [
        {   
            name: "type",
            nameLocalizations: {
                "ru": "тип"
            },
            description: "Select a type.",
            descriptionLocalizations: {
                "ru": "Выберите тип предложения."
            },
            type: "STRING",
            required: true,
            choices: [
                { 
                    name: "Сервер",
                    nameLocalizations: {
                        "en-US": "Server"
                    },
                    value: "Сервер" 
                },
                { 
                    name: "Дискорд бот",
                    nameLocalizations: {
                        "en-US": "Discord Bot"
                    },
                    value: "Дискорд бот" 
                },
                { 
                    name: "Другое",
                    nameLocalizations: {
                        "en-US": "Other"
                    },
                    value: "Другое" 
                }
            ]
        }, {
            name: "suggestion",
            nameLocalizations: {
                "ru": "предложение"
            },
            description: "Describe your suggestion.",
            descriptionLocalizations: {
                "ru": "Опишите ваше ппредложение."
            },
            type: "STRING",
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId, member, user } = interaction;

        const Type = options.getString("type");
        const Suggestion = options.getString("suggestion");

        const Embed = new MessageEmbed().setColor("NAVY")
        .setAuthor({name: user.tag, iconURL: user.displayAvatarURL({dynamic: true})})
        .addFields(
            {name: "Предложение:", value: Suggestion, inline: false},
            {name: "Тип:", value: Type, inline: true},
            {name: "Статус", value: "Ожидает", inline: true}
        ).setFooter({text: `Guild ID: ${guildId}`})
        .setTimestamp();
        
        const Buttons = new MessageActionRow();
        Buttons.addComponents(
            new MessageButton().setCustomId("suggest-accept")
            .setLabel("✅ Принять").setStyle("SUCCESS"),
            new MessageButton().setCustomId("suggest-decline")
            .setLabel("⛔ Отклонить").setStyle("DANGER")
        );

        const SuggestSetupDB = await SetupDB.findOne({GuildID: guildId});

        if(!SuggestSetupDB) return interaction.reply({embeds: [new MessageEmbed().setColor("RED")
            .setDescription("Этот сервер не настроил систему предложений.")], ephemeral: true});

        try {
            const M = await interaction.guild.channels.cache.get(SuggestSetupDB.ChannelID).send({embeds: [Embed], components: [Buttons], fetchReply: true});
            await M.react('✅').then(() => M.react('⛔'));
            await M.startThread({ name: `${Suggestion.substring(0, 50)}...`});
        
            await DB.create({GuildID: guildId, MessageID: M.id, Details: [
                { MemberID: member.id, Type: Type, Suggestion: Suggestion }
            ]});
            interaction.reply({embeds: [new MessageEmbed().setColor("GOLD")
                .setDescription(`✅ Ваше [предложение](${M.url}) было добавлено в ${interaction.guild.channels.cache.get(SuggestSetupDB.ChannelID)}`).setTimestamp()], ephemeral: true});
        } catch (err) {
            Error(err);
        }
    }
}
