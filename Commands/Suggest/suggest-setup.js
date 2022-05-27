const { MessageEmbed, CommandInteraction } = require("discord.js");
const DB = require("../../Structures/Schemas/Suggest/SuggestSetupDB");

module.exports = {
    name: "suggest-setup",
    nameLocalizations: {
        "ru": "предложения-установки"
    },
    description: "Set up a channel where suggests are sent.",
    descriptionLocalizations: {
        "ru": "Настройте канал, куда отправляются предложения."
    },
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "set",
            nameLocalizations: {
                "ru": "установить"
            },
            description: "Set the channel to which suggests will be sent.",
            descriptionLocalizations: {
                "ru": "Установите канал, на который будут отправляться предложения."
            },
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    nameLocalizations: {
                        "ru": "канал"
                    },
                    description: "The channel where suggests are sent.", 
                    descriptionLocalizations: {
                        "ru": "Канал, куда будут отправляться предложения."
                    },
                    type: "CHANNEL", channelTypes: ["GUILD_TEXT"], required: true
                }
            ]
        },
        {
            name: "current-channel",
            nameLocalizations: {
                "ru": "текущий-канал"
            },
            description: "Show the current channel for the suggests.",
            descriptionLocalizations: {
                "ru": "Показать текущий канал для предложений."
            },
            type: "SUB_COMMAND",
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {

        switch(interaction.options.getSubcommand()) {
            case "set": {
                const channel = interaction.options.getChannel("channel");

                try {
                    await channel.send({embeds: [new MessageEmbed().setColor("AQUA")
                        .setDescription(`✅ Этот канал был установлен как канал предложений.`)]}).then(async() => { 
                            await DB.findOneAndUpdate(
                                { GuildID: interaction.guild.id }, 
                                { ChannelID: channel.id }, 
                                { new: true, upsert: true }
                            );
                        interaction.reply({embeds: [new MessageEmbed().setColor("GOLD")
                            .setDescription(`✅ ${channel} был успешно установлен в качестве канала предложений для ${interaction.guild.name}.`)]});
                    })
                } catch (error) {
                    if(error.message === "Missing Access") {
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED")
                            .setDescription(`❌ У бота нет доступа к этому каналу.`)]});
                    } else {
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED")
                            .setDescription(`\`\`\`${error}\`\`\``)]});
                    }    
                }
            }
            break;
            case "current-channel": {
                const suggestion = await DB.findOne({GuildID: interaction.guild.id});

                if(!suggestion) {
                    interaction.reply({embeds: [new MessageEmbed().setColor("RED")
                    .setDescription(`❌ Этот сервер не настроил систему предложений.`)]});
                } else {
                    interaction.reply({embeds: [new MessageEmbed().setColor("AQUA")
                    .setDescription(`В настоящее время, каналом предложений является <#${suggestion.ChannelID}>`)]});
                }
            }
            break;
        }
    }
};