const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/Moderation/WarningDB");
const { addWarning } = require("../../Utilities/ModFunctions");
const ms = require("ms");
const { Error } = require("../../Utilities/Logger");

module.exports = {
    name: "warn",
    nameLocalizations: {
        "ru": "пред"
    },
    description: "Warnings",
    descriptionLocalizations: {
        "ru": "Предупреждения"
    },
    permission: "KICK_MEMBERS",
    options: [
        {
            name: "add",
            nameLocalizations: {
                "ru": "добавить"
            },
            description: "Добавить предупреждение",
            descriptionLocalizations: {
                "ru": "Добавить предупреждение"
            },
            type: "SUB_COMMAND", options: [
                { name: "target", description: "Выберите цель", type: "USER", required: true },
                { name: "reason", description: "Укажите причину", type: "STRING", required: true },
                { name: "duration", description: "Укажите время", type: "STRING" }
            ]
        },
        {
            name: "remove",
            nameLocalizations: {
                "ru": "удалить"
            },
            description: "Удалить предупреждение",
            descriptionLocalizations: {
                "ru": "Удалить предупреждение"
            },
            type: "SUB_COMMAND", options: [
                { name: "target", description: "Выберите цель", type: "USER", required: true },
                { name: "warnid", description: "Укажите ID предупреждения", type: "STRING", required: true }
            ]
        },
        {
            name: "clear",
            nameLocalizations: {
                "ru": "очистить"
            },
            description: "Удалить все предупреждения",
            descriptionLocalizations: {
                "ru": "Удалить все предупреждения"
            },
            type: "SUB_COMMAND", options: [
                { name: "target", description: "Выберите цель", type: "USER", required: true }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, user, guild } = interaction;
        const Target = options.getMember("target");
        const Reason = options.getString("reason");
        const WarnID = options.getString("warnid");
        const Duration = options.getString("duration") || null;

        let durationMs;
        if(Duration == null) durationMs = null;
        else durationMs = ms(Duration);

        if(Target.user.bot)
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED")
            .setDescription(`Нельзя выдавать предупреждения боту!`).setTimestamp()
            ], ephemeral: true});;

        switch(options.getSubcommand()) {
            case ("add") : {
                await addWarning(guild, Target, user, Reason, durationMs);
    
                interaction.reply({embeds: [new MessageEmbed().setTitle("Предупреждение добавлено").setColor("BLURPLE")
                    .setDescription(`Добавлено __предупреждение__: ${Target.user} \n**Причина**: ${Reason}`)
                    .setFooter({text: `ID: ${Target.id}`}).setTimestamp()
                ], ephemeral: true}); 
            }
            break;
            case ("remove") : {
                DB.findOne({ GuildID: guild.id, UserID: Target.id }, async(error, data) => {
                    if(error) return Error(error);
                    if(!data) {
                        return interaction.reply({embeds: [new MessageEmbed().setTitle("WARNING").setColor("BLURPLE")
                        .setDescription(`${Target.user} не имеет предупреждений.`)
                        .setFooter({text: `ID: ${Target.id}`}).setTimestamp()], ephemeral: true});
                    }

                    let warnId = '';
                    for(var i = 0; i < data.Content.length; ++i) {
                        if(data.Content[i].WarningID == WarnID) {
                            warnId = data.Content[i].WarningID;
                            data.Content.splice(i, 1);
                            data.save();
                        }
                    }

                    if(warnId) {
                        return interaction.reply({embeds: [new MessageEmbed().setTitle("Предупреждение удалено").setColor("BLURPLE")
                        .setDescription(`Предупреждение \`${WarnID}\` у ${Target.user}, было удалено.`)
                        .setFooter({text: `ID: ${Target.id}`}).setTimestamp()], ephemeral: true});
                    } else if(!warnId) {
                        return interaction.reply({embeds: [new MessageEmbed().setTitle("WARNING").setColor("BLURPLE")
                        .setDescription(`${Target.user} не имеет предупреждения с ID: \`${WarnID}\`.`)
                        .setFooter({text: `ID: ${Target.id}`}).setTimestamp()], ephemeral: true});
                    }
                });
            }
            break;
            case ("clear") : {
                DB.findOne({ GuildID: guild.id, UserID: Target.id }, async (err, data) => {
                    if(err) throw err;
                    if(data) {
                        await DB.findOneAndDelete({ GuildID: guild.id, UserID: Target.id });
                        interaction.reply({embeds: [new MessageEmbed().setTitle("WARNING").setColor("BLURPLE")
                            .setDescription(`Предупреждения ${Target.user} были удалены`)
                            .setFooter({text: `ID: ${Target.id}`}).setTimestamp()
                        ], ephemeral: true});
                    } else {
                        interaction.reply({embeds: [new MessageEmbed().setTitle("WARNING").setColor("BLURPLE")
                            .setDescription(`${Target.user} не имеет предупреждений.`)
                            .setFooter({text: `ID: ${Target.id}`}).setTimestamp()
                        ], ephemeral: true});
                    }
                });
            }
            break;
        }
    }
}