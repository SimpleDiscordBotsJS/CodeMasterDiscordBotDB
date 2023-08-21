const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const schema = require("../../Structures/Data/Schemas/JoinToCreateDB");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-join-to-create")
    .setNameLocalizations({ "ru": "установка-join-to-create" })
    .setDescription("Setup the join to create system.")
    .setDescriptionLocalizations({ "ru": "Установить систему join to create." })
    .addChannelOption((options) => options
        .setName("channel")
        .setNameLocalizations({ "ru": "канал" })
        .setDescription("Channel of the join to create system.")
        .setDescriptionLocalizations({ "ru": "Канал, системы join to create." })
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    )
    .addNumberOption((options) => options
        .setName("limit")
        .setNameLocalizations({ "ru": "лимит" })
        .setDescription("The user limit of every join to create channel.")
        .setDescriptionLocalizations({ "ru": "Лимит участников для каждого созданного канал." })
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, options } = interaction;
        const channel = options.getChannel("channel");
        const userLimit = options.getNumber("limit");

        await schema.findOneAndUpdate({ GuildID: guild.id }, { ChannelID: channel.id, UserLimit: userLimit }, { new: true, upsert: true })
        .catch((err) => console.log(err));

        return interaction.reply({ content: "Система join to create успешно установлена!", ephemeral: true });
    }
}