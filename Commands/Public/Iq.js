const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("iq")
    .setDescription("Show iq.")
    .setDescriptionLocalizations({ "ru": "Показать iq." })
    .addUserOption((options) => options
        .setName("user")
        .setNameLocalizations({ "ru": "пользователь" })
        .setDescription("Show user iq.")
        .setDescriptionLocalizations({ "ru": "Показать iq пользователя." })
        .setRequired(false)
    )
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, user } = interaction;
        const target = options.getUser("user") || user;

        if(target.bot) return interaction.reply({ content: "Лол, что?", ephemeral: true });

        const iq = Math.floor(Math.random() * 200) + 1;

        const embed = new EmbedBuilder().setTitle("🧠 IQ")
        .setDescription(`>>> **Уровень IQ пользователя ${target} равен \`${iq}\`!**`)
        .setColor("DarkBlue").setThumbnail(target.displayAvatarURL({ size: 256 }));

        interaction.reply({ embeds: [embed] });
    }
}