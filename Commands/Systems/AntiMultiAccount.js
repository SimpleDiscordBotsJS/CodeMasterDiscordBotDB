const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");
const DB = require("../../Structures/Data/Schemas/AntiMultiAccountDB");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("anti-multi-account")
    .setDescription("Setup the logs channel to the Anti Multi Account system")
    .setDescriptionLocalizations({ "ru": "Настройка канала передачи логов системы Anti Multi Account" })
    .addChannelOption((options) => options
        .setName("channel")
        .setNameLocalizations({ "ru": "канал" })
        .setDescription("Select the channel to send logs to")
        .setDescriptionLocalizations({ "ru": "Выберите канал, на который будут отправляться логи" })
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    /**
     * @param {GuildMember} member
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { guild, options } = interaction;
        const LogChannel = options.getChannel("channel");

        await DB.findOneAndUpdate({ GuildID: guild.id }, { LogsChannel: LogChannel.id }, { new: true, upsert: true })
        .catch((err) => Error(err));

        await interaction.reply({ embeds: [new EmbedBuilder().addFields({ name: "Канал", value: LogChannel })
            .setDescription("Канал логов системы Anti Multi Account успешно установлен.")
            .setColor("Gold")], ephemeral: true
        });
        
        return;
    }
}