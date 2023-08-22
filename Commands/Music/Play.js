const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setNameLocalizations({ "ru": "играть" })
    .setDescription("Play music")
    .setDescriptionLocalizations({ "ru": "Играть музыку" })
    .addStringOption((options) => options
        .setName("query")
        .setNameLocalizations({ "ru": "запрос" })
        .setDescription("What do you want to listen to? [Links and titles supported]")
        .setDescriptionLocalizations({ "ru": "Что вы хотите слушать? [Поддерживаются ссылки и названия]" })
        .setRequired(true)
    )
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { member, user, options } = interaction;

        const channel = member.voice.channel;
        if(!channel) return interaction.reply('Вы не подключены к голосовому каналу!');

        const query = options.getString('query', true);
        const player = useMainPlayer();
        
        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, { nodeOptions: { metadata: interaction } });
            if(!track) return await interaction.followUp({ content: "Произошла ошибка при поиске трека!" });

            return await interaction.followUp({ embeds: [new EmbedBuilder().setColor("Gold")
                .setDescription(`Трек **[[${track.title}](${track.url})]** добавлен в проигрыватель!`).setTimestamp()
                .setFooter({ text: `Запросил: ${member.nickname || user.username}`, iconURL: user.avatarURL() })]
            });
        } catch (e) {
            await interaction.followUp(e);
            throw e;
        }
    }
}