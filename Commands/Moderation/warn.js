const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/Moderation/WarningDB");

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
                { name: "reason", description: "Укажите причину", type: "STRING", required: true }
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
                { name: "warnid", description: "Укажите ID предупреждения", type: "NUMBER", required: true }
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
        const subCommand = options.getSubcommand();
        const Target = options.getMember("target");
        const Reason = options.getString("reason");
        const WarnID = options.getNumber("warnid") - 1;
        const WarnDate = new Date(interaction.createdTimestamp).toLocaleDateString();

        if(Target.user.bot)
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED")
            .setDescription(`Нельзя выдавать предупреждения боту!`).setTimestamp()
            ], ephemeral: true});;

        switch(subCommand) {
            case ("add") : {
                DB.findOne({ GuildID: guild.id, UserID: Target.id }, async (err, data) => {
                    if(err) throw err;
                    if(!data){
                        data = new DB({ GuildID: guild.id, UserID: Target.id, Content: [{
                                    ExecuterID: user.id,
                                    Reason: Reason,
                                    Date: WarnDate
                                }
                            ],
                        });
                    } else {
                        const obj = {
                            ExecuterID: user.id,
                            Reason: Reason,
                            Date: WarnDate
                        }
                        data.Content.push(obj);
                    }
                    data.save();
                });
    
                interaction.reply({embeds: [new MessageEmbed().setTitle("Предупреждение добавлено").setColor("BLURPLE")
                    .setDescription(`Добавлено __предупреждение__: ${Target.user} \n**Причина**: ${Reason}`)
                    .setFooter({text: `ID: ${Target.id}`}).setTimestamp()
                ], ephemeral: true});
    
                await Target.send({embeds: [new MessageEmbed().setColor("#00defa").setTitle("⚠️ WARNING").setTimestamp()
                .setAuthor({name: Target.user.tag, iconURL: Target.user.avatarURL({dynamic: true, size: 512})})
                .setDescription(`Вам было выдано __предупреждение__ по причине: \`\`\`${Reason}\`\`\` \nСервер: **${guild.name}**`)
                .setFooter({text: `ID: ${Target.user.id}`})]});    
            }
            break;
            case ("remove") : {
                DB.findOne({ GuildID: guild.id, UserID: Target.id }, async (err, data) => {
                    if(err) throw err;
                    if(data) {
                        data.Content.splice(WarnID, 1);
                        interaction.reply({embeds: [new MessageEmbed().setTitle("Удалено").setColor("BLURPLE").setTimestamp()
                            .setDescription(`Предупреждение у ${Target.user} под ID: ${WarnID + 1} было удалено.`)
                        ], ephemeral: true});
                        data.save();
                    } else {
                        interaction.reply({embeds: [new MessageEmbed().setTitle("WARNING").setColor("BLURPLE")
                            .setDescription(`${Target.user} не имеет предупреждений.`)
                            .setFooter({text: `ID: ${Target.id}`}).setTimestamp()
                        ], ephemeral: true});
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