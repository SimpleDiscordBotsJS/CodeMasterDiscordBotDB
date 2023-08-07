const { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder,
    ChannelType, PermissionFlagsBits } = require("discord.js");
const DB = require("../../Structures/Data/Schemas/Suggest/SuggestSetupDB");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("suggest-setup")
    .setNameLocalizations({ "ru": "предложения-установки" })
    .setDescription("Set up a channel where suggests are sent.")
    .setDescriptionLocalizations({ "ru": "Настройте канал, куда отправляются предложения." })
    .addSubcommand((options) => options
        .setName("set")
        .setNameLocalizations({ "ru": "установить" })
        .setDescription("Set the channel to which suggests will be sent.")
        .setDescriptionLocalizations({ "ru": "Установите канал, на который будут отправляться предложения." })
        .addChannelOption((channel) => channel
            .setName("channel")
            .setNameLocalizations({ "ru": "канал" })
            .setDescription("The channel where suggests are sent.")
            .setDescriptionLocalizations({ "ru": "Канал, куда будут отправляться предложения." })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((options) => options
        .setName("current-channel")
        .setNameLocalizations({ "ru": "текущий-канал" })
        .setDescription("Show the current channel for the suggests.")
        .setDescriptionLocalizations({ "ru": "Показать текущий канал для предложений." })
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {

        switch(interaction.options.getSubcommand()) {
            case "set": {
                const channel = interaction.options.getChannel("channel");

                try {
                    await channel.send({embeds: [new EmbedBuilder().setColor("Aqua")
                        .setDescription(`✅ Этот канал был установлен как канал предложений.`)]}).then(async() => { 
                            await DB.findOneAndUpdate(
                                { GuildID: interaction.guild.id }, 
                                { ChannelID: channel.id }, 
                                { new: true, upsert: true }
                            );
                        interaction.reply({embeds: [new EmbedBuilder().setColor("Gold")
                            .setDescription(`✅ ${channel} был успешно установлен в качестве канала предложений для ${interaction.guild.name}.`)]});
                    })
                } catch (error) {
                    if(error.message === "Missing Access") {
                        return interaction.reply({embeds: [new EmbedBuilder().setColor("Red")
                            .setDescription(`❌ У бота нет доступа к этому каналу.`)]});
                    } else {
                        return interaction.reply({embeds: [new EmbedBuilder().setColor("Red")
                            .setDescription(`\`\`\`${error}\`\`\``)]});
                    }    
                }
            }
            break;
            case "current-channel": {
                const suggestion = await DB.findOne({GuildID: interaction.guild.id});

                if(!suggestion) {
                    interaction.reply({embeds: [new EmbedBuilder().setColor("Red")
                    .setDescription(`❌ Этот сервер не настроил систему предложений.`)]});
                } else {
                    interaction.reply({embeds: [new EmbedBuilder().setColor("Aqua")
                    .setDescription(`В настоящее время, каналом предложений является <#${suggestion.ChannelID}>`)]});
                }
            }
            break;
        }
    }
};