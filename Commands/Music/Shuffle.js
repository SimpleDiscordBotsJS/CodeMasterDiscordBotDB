const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("shuffle")
    .setNameLocalizations({ "ru": "перемешать" })
    .setDescription("Shuffle tracks.")
    .setDescriptionLocalizations({ "ru": "Перемешать треки." })
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { member, user, guild } = interaction;
        const channel = member.voice.channel;
        if(!channel) return interaction.reply('Вы не подключены к голосовому каналу!');

        const queue = useQueue(guild.id);

        try {
            if(!queue) {
                return interaction.reply({ content: `Меня нет в голосовом канале`, ephemeral: true });
            }

            if(queue.tracks.size < 2) {
                return interaction.reply({ content: `В очереди не достаточно треков для перемешивания.`, ephemeral: true });
            }

            queue.tracks.shuffle();

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setAuthor({ name: `Перемешивание треков`, iconURL: guild.client.user.avatarURL() })
                .setColor("Green").setDescription([
                    `Треки успешно перемешаны.`,
                    `__Текущий трек__: **[[${queue.currentTrack.title}](${queue.currentTrack.url})]**`,
                    ``,
                    `Для перемешивания треков, используйте: **\`/shuffle\`**`
                ].join("\n")).setTimestamp()
                .setFooter({ text: `Перемешал: ${member.nickname || user.displayName}`, iconURL: user.avatarURL() })]
            });
        } catch (e) {
            interaction.reply(e);
            throw e;
        }
    }
}