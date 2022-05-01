const { CommandInteraction, MessageEmbed } = require("discord.js");
const LevelRewardDB = require("../../Structures/Schemas/Leveling/LevelRewardDB");

module.exports = {
    name: 'level-adm',
    description: 'Усталовки системы уровней',
    permission: "ADMINISTRATOR",
    options: [
        { name: 'view', description: 'Показать текущие установки', type: "SUB_COMMAND" },
        { name: 'add-reward', description: 'Добавить награду за уровень', type: "SUB_COMMAND",
            options: [
                { name: 'level', description: 'Уровень', type: 'NUMBER', required: true },
                { name: 'reward', description: 'Роль', type: 'ROLE', required: true }
            ]
        },
        { name: 'remove-reward', description: 'Удалить награду за роль', type: "SUB_COMMAND",
            options: [{ name: 'role', description: 'Роль', type: 'ROLE', required: true }]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        switch(interaction.options.getSubcommand()) {
            case "view":
                const rewards = await LevelRewardDB.find({ GuildID: interaction.guild.id })
                if(!rewards) {
                    LevelRewardDB.create({ GuildID: interaction.guild.id })
                    return interaction.reply({ content: "Я не смог найти этот сервер в базе данных. Пожалуйста, попробуйте еще раз", ephemeral: true })
                }

                var description = `**Награду за уровень**\n`
                for (const reward of rewards) {
                    description += `Уровень: ${reward.Level} - ${reward.Role}\n`
                }

                const embed = new MessageEmbed()
                .setColor('GOLD')
                .setTitle('Установки бота')
                .setDescription(description)
                interaction.reply({ embeds: [embed], ephemeral: true })
            break;
            case "add-reward":
                LevelRewardDB.create({
                    GuildID: interaction.guild.id,
                    Level: interaction.options.getNumber('level'),
                    Role: interaction.options.getRole('reward')
                })
                interaction.reply({ content: `Уровень: ${interaction.options.getNumber('level')}, награда: ${interaction.options.getRole('reward')}`, ephemeral: true })
            break;
            case "remove-reward":
                const result = await LevelRewardDB.findOne({ GuildID: interaction.guild.id, Role: interaction.options.getRole('role') })
                if (!result) {
                    return interaction.reply({ content: `Не удалось найти награду за уровень с этой ролью`, ephemeral: true })
                }
                result.delete()
                interaction.reply({ content: `Удалена награда за уровень`, ephemeral: true })
            break;
        }
    }
};