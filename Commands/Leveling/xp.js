const { MessageEmbed } = require('discord.js')
const levelSchema = require("../../Structures/Schemas/Leveling/LevelingDB");

module.exports = {
    name: 'xp',
    description: 'Manage a users xp.',
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'manage',
            description: 'Управление опытом и уровнем пользователей',
            type: 'SUB_COMMAND',
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
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        let amountAdd = interaction.options.getNumber('amount');

        switch(interaction.options.getSubcommand()) {
            case "manage" : {
                switch(interaction.options.getString("type")) {
                    case "level" : {
                        switch(interaction.options.getString("action")) {
                            case "add" : {
                                const data = await levelSchema.findOne({ GuildID: interaction.guild.id, UserID: user.id });
            
                                let BeforeLevel;
            
                                if(!data) {
                                    const newData = await levelSchema.create({
                                        GuildID: interaction.guild.id, UserID: user.id, XP: 0, Level: 0
                                    });
                        
                                    newData.save();
                                } else {
                                    BeforeLevel = data.Level;
                                    data.Level += amountAdd;
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
                                const data = await levelSchema.findOne({ GuildID: interaction.guild.id, UserID: user.id });
            
                                let BeforeLevel;
            
                                if(!data) {
                                    const newData = await levelSchema.create({
                                        GuildID: interaction.guild.id, UserID: user.id, XP: 0, Level: 0
                                    });
                    
                                    newData.save();
                                } else {
                                    BeforeLevel = data.Level;
                                    data.Level = amountAdd;
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
                                const data = await levelSchema.findOne({ GuildID: interaction.guild.id, UserID: user.id });
              
                                let BeforeXP;
              
                                if(!data) {
                                    const newData = await levelSchema.create({
                                        GuildID: interaction.guild.id, UserID: user.id, XP: 0, Level: 0
                                    });
              
                                    newData.save();
                                } else {
                                    BeforeXP = data.XP;
                                    data.XP += amountAdd;
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
                                const data = await levelSchema.findOne({ GuildID: interaction.guild.id, UserID: user.id });
            
                                let BeforeXP;
            
                                if(!data) {
                                    const newData = await levelSchema.create({
                                        GuildID: interaction.guild.id, UserID: user.id, XP: 0, Level: 0
                                    });
            
                                    newData.save();
                                } else {
                                    BeforeXP = data.XP;
                                    data.XP = amountAdd;
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
}