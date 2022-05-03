const { CommandInteraction, MessageEmbed } = require("discord.js");
const LevelRewardDB = require("../../Structures/Schemas/Leveling/LevelRewardDB");
const LevelDB = require("../../Structures/Schemas/Leveling/LevelingDB");
const { getLevelExp } = require("../../Utilites/LevelFucntions");

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
        },
        { name: 'manage', description: 'Управление опытом и уровнем пользователей', type: 'SUB_COMMAND',
            options: [
                { name: 'action', description: 'Действие, которое необходимо выполнить',
                    type: 'STRING', required: true,
                    choices: [
                        { name: 'add', value: 'add' },
                        { name: 'set', value: 'set' },
                    ]
                },
                { name: 'type', description: 'Выберите, чтобы установить уровень или опыт',
                    type: 'STRING', required: true,
                    choices: [
                        { name: 'уровень', value: 'level' },
                        { name: 'опыт', value: 'xp' }
                    ]
                },
                { name: 'user', description: 'Пользователь', type: 'USER', required: true, },
                { name: 'amount', description: 'Количество', type: 'NUMBER', required: true }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        switch(interaction.options.getSubcommand()) {
            case "view":
                const rewards = await LevelRewardDB.find({ GuildID: interaction.guild.id });
                if(!rewards) {
                    LevelRewardDB.create({ GuildID: interaction.guild.id });

                    return interaction.reply({ 
                        content: "Я не смог найти этот сервер в базе данных. Пожалуйста, попробуйте еще раз", 
                        ephemeral: true 
                    });
                }

                var description = `**Награду за уровень**\n`
                for (const reward of rewards) {
                    description += `Уровень: ${reward.Level} - ${reward.Role}\n`
                }

                const embed = new MessageEmbed()
                .setColor('GOLD')
                .setTitle('Установки бота')
                .setDescription(description);

                interaction.reply({ embeds: [embed], ephemeral: true });
            break;
            case "add-reward":
                LevelRewardDB.create({
                    GuildID: interaction.guild.id,
                    Level: interaction.options.getNumber('level'),
                    Role: interaction.options.getRole('reward')
                });

                interaction.reply({ 
                    content: `Уровень: ${interaction.options.getNumber('level')}, награда: ${interaction.options.getRole('reward')}`, 
                    ephemeral: true
                });
            break;
            case "remove-reward":
                const result = await LevelRewardDB.findOne({ GuildID: interaction.guild.id, Role: interaction.options.getRole('role') });

                if (!result) {
                    return interaction.reply({ 
                        content: `Не удалось найти награду за уровень с этой ролью`, 
                        ephemeral: true
                    });
                }
                result.delete();

                interaction.reply({ content: `Удалена награда за уровень`, ephemeral: true });
            break;
            case "manage" : {
                const user = interaction.options.getUser("user");
                let amountAdd = interaction.options.getNumber('amount');

                switch(interaction.options.getString("type")) {
                    case "level" : {
                        switch(interaction.options.getString("action")) {
                            case "add" : {
                                const data = await LevelDB.findOne({ GuildID: interaction.guild.id, UserID: user.id });
            
                                let BeforeLevel;
            
                                if(!data) {
                                    const newData = await LevelDB.create({ GuildID: interaction.guild.id, UserID: user.id });
                                    newData.save();
                                } else {
                                    BeforeLevel = data.Level;
                                    data.Level += amountAdd;
                                    for (let counter = BeforeLevel; counter < data.Level; ++counter) {
                                        data.TotalXP += (await getLevelExp(counter)).valueOf();
                                    }
                                    data.save();
                                }

                                const embed = new MessageEmbed()
                                    .setTitle(`${user.username}'s level`)
                                    .setFields(
                                        { name: 'Было:', value: `\`${BeforeLevel}\``, inline: true },
                                        { name: 'Стало:', value: `\`${data.Level}\``, inline: true },
                                        { name: 'Добавлено:', value: `\`${amountAdd}\``, inline: true }
                                    ).setColor('GREEN');
            
                                interaction.reply({ embeds: [embed] });
                            }
                            break;
                            case "set" : {
                                const data = await LevelDB.findOne({ GuildID: interaction.guild.id, UserID: user.id });
            
                                let BeforeLevel;
            
                                if(!data) {
                                    const newData = await LevelDB.create({ GuildID: interaction.guild.id, UserID: user.id });
                                    newData.save();
                                } else {
                                    BeforeLevel = data.Level;
                                    data.Level = amountAdd;
                                    if(BeforeLevel > data.Level) {
                                        for (let counter = BeforeLevel; counter > data.Level; --counter) {
                                            data.TotalXP -= (await getLevelExp(counter - 1)).valueOf();
                                        }
                                    } else if(BeforeLevel < data.Level) {
                                        for (let counter = BeforeLevel; counter < data.Level; ++counter) {
                                            data.TotalXP += (await getLevelExp(counter)).valueOf();
                                        }
                                    }
                                    data.save();
                                }
                    
                                const embed = new MessageEmbed()
                                    .setTitle(`${user.username}'s level`)
                                    .setFields(
                                        { name: 'Было:', value: `\`${BeforeLevel}\``, inline: true },
                                        { name: 'Стало:', value: `\`${data.Level}\``, inline: true }
                                    ).setColor('GREEN');
            
                                interaction.reply({ embeds: [embed] });
                            }
                            break;
                        }
                    }
                    break;

                    case "xp" : {
                        switch(interaction.options.getString("action")) {
                            case "add" : {
                                const data = await LevelDB.findOne({ GuildID: interaction.guild.id, UserID: user.id });
              
                                let BeforeXP;
              
                                if(!data) {
                                    const newData = await LevelDB.create({ GuildID: interaction.guild.id, UserID: user.id });
                                    newData.save();
                                } else {
                                    BeforeXP = data.XP;
                                    data.XP += amountAdd;
                                    data.TotalXP += amountAdd;
                                    data.save();
                                }
              
                                const embed = new MessageEmbed()
                                .setTitle(`${user.username}'s XP`)
                                .setFields(
                                    { name: 'Было:', value: `\`${BeforeXP}\``, inline: true },
                                    { name: 'Стало:', value: `\`${data.XP}\``, inline: true },
                                    { name: 'Добавлено:', value: `\`${amountAdd}\``, inline: true }
                                ).setColor('GREEN');
            
                                interaction.reply({ embeds: [embed] });
                            }
                            break;
                            case "set" : {
                                const data = await LevelDB.findOne({ GuildID: interaction.guild.id, UserID: user.id });
            
                                let BeforeXP;
            
                                if(!data) {
                                    const newData = await LevelDB.create({ GuildID: interaction.guild.id, UserID: user.id });
                                    newData.save();
                                } else {
                                    BeforeXP = data.XP;
                                    data.XP = amountAdd;
                                    if(BeforeXP > data.XP) data.TotalXP -= (BeforeXP - data.XP);
                                    else if(BeforeXP < data.XP) data.TotalXP += (data.XP - BeforeXP);
                                    data.save();
                                }
              
                                const embed = new MessageEmbed()
                                .setTitle(`${user.username}'s XP`)
                                .setFields(
                                    { name: 'Было:', value: `\`${BeforeXP}\``, inline: true }, 
                                    { name: 'Стало:', value: `\`${data.XP}\``, inline: true }
                                ).setColor('GREEN');
            
                                interaction.reply({ embeds: [embed] });
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            break;
        }
    }
};