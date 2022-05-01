const { CommandInteraction, MessageEmbed } = require('discord.js');
const LevelDB = require('../../Structures/Schemas/Leveling/LevelingDB');

module.exports = {
    name: 'leaderboard',
    description: 'Показать лидеров',
    cooldown: 10000,
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const Embed = new MessageEmbed().setColor("GREEN").setTitle("📜 Рейтинг участников")
        .setThumbnail(interaction.guild.iconURL({dynamic: true, size: 256}))
        .setFooter({text: `Запросил: ${interaction.member.displayName}`});

        //Embed.setAuthor({name: `Страница {} из {} - Всего участников: ${interaction.guild.members.fetch()}`});

        const results = await LevelDB.find({ GuildID: interaction.guild.id }).sort({ Level: -1 }).limit(10);

        for(let counter = 0; counter < results.length; ++counter) {
            const { UserID, Level = 0, XP } = results[counter];

            const TotalXP = (Level - 1) * (Level - 1) * 100 + 100 + XP;

            const User = interaction.guild.members.cache.find(user => user.id === UserID);

            Embed.addField(`**#${counter + 1}.** ${User.displayName}`, `**Уровень**: \`${Level}\` | **Опыт**: \`${TotalXP}\``);
        }

        return interaction.reply({embeds: [Embed]});
    }
}