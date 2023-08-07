const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ChannelType, Client } = require("discord.js");
const DB = require("../../Structures/Data/Schemas/AntiScamDB");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("anti-scam")
    .setDescription("Anti Scam system management")
    .setDescriptionLocalizations({ "ru": "Управление системой Anti Scam" })
    .addSubcommand((sub) => sub
        .setName("setup")
        .setNameLocalizations({ "ru": "установка" })
        .setDescription("Configuring the Anti Scam system")
        .setDescriptionLocalizations({ "ru": "Настройка системы Anti Scam" })
        .addChannelOption((options) => options
            .setName("logging")
            .setNameLocalizations({ "ru": "логирование" })
            .setDescription("Select a logging channel.")
            .setDescriptionLocalizations({ "ru": "Выберите канал логирования." })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;
        const SubCommand = options.getSubcommand();

        switch (SubCommand) {
            case "setup": {
                const loggingChannel = options.getChannel("logging").id;

                await DB.findOneAndUpdate(
                    { GuildID: guild.id }, 
                    { ChannelID: loggingChannel },
                    { new: true, upsert: true }
                );

                client.antiScamLog.set(guild.id, loggingChannel);

                await interaction.reply({ embeds: [new EmbedBuilder().addFields({ name: "Канал", value: LogChannel })
                    .setDescription(`Канал логов системы Anti Scam успешно установлен.`)
                    .setColor("Gold")], ephemeral: true
                });
            }
            break;
        }
    }
}
