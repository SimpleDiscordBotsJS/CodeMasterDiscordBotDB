const { CommandInteraction, Client } = require("discord.js");
const Schema = require("../../Structures/Schemas/FilterDB");

module.exports = {
    name: "filter",
    description: "Простая система фильтрации чата.",
    permission: "MANAGE_MESSAGES",
    options: [
        { name: "clear", description: "Очистите свой черный список.", type: "SUB_COMMAND" },
        { name: "list", description: "Список слов в черном списке.", type: "SUB_COMMAND" },
        {
            name: "settings",
            description: "Настройте свою систему фильтрации.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "logging",
                    description: "Выберите канал логирования.",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                }
            ]
        },
        {
            name: "configure",
            description: "Добавить или удалить слова из черного списка.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Выберите параметр.",
                    type: "STRING",
                    required: true,
                    choices: [
                        {name: "Add", value: "add"},
                        {name: "Remove", value: "remove"}
                    ]
                },
                {
                    name: "word",
                    description: "Укажите слово, добавьте несколько слов, поставив запятую между ними (слово, другое_слово)",
                    type: "STRING",
                    required: true
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const subCommand = options.getSubcommand();

        switch(subCommand) {
            case "clear" : {
                await Schema.findOneAndUpdate({Guild: guild.id}, {Words: []});
                client.filters.set(guild.discoverySplash, []);
                interaction.reply({content: "Черный список очищен."});
            }
            break;
            case "list" : {
                const Data = await Schema.findOne({Guild: guild.id});
                if(!Data) return interaction.reply({content: "Нет данных для перечисления."});
                
                interaction.reply({content: `**Черный список**:\n\n${Data.Words.map((w) => w).join("\n") || "None"}`});
            }
            break;
            case "settings" : {
                const loggingChannel = options.getChannel("logging").id;

                await Schema.findOneAndUpdate(
                    { Guild: guild.id }, 
                    { Log: loggingChannel },
                    { new: true, upsert: true }
                );

                client.filtersLog.set(guild.id, loggingChannel);

                interaction.reply({content: `Добавлен <#${loggingChannel}> в качестве канала логирования для системы фильтрации.`, ephemeral: true});
            }
            break;
            case "configure" : {
                const Choice = options.getString("options");
                const Words = options.getString("word").toLowerCase().split(",");

                switch(Choice) {
                    case "add" : {
                        Schema.findOne({Guild: guild.id}, async (err, data) => {
                            if(err) throw err;
                            if(!data) {
                                await Schema.create({Guild: guild.id, Log: null, Words: Words})
                                
                                client.filters.set(guild.id, Words);

                                return interaction.reply({content: `В черный список добавлено новых слов: ${Words.length}.`});
                            }

                            const newWords = [];

                            Words.forEach((w) => {
                                if(data.Words.includes(w)) return;
                                newWords.push(w);
                                data.Words.push(w);
                                client.filters.get(guild.id).push(w);
                            });

                            interaction.reply({content: `В черный список добавлено новых слов: ${newWords.length}.`});
                        
                            data.save();
                        });
                    }
                    break;
                    case "remove" : {
                        Schema.findOne({Guild: guild.id}, async (err, data) => {
                            if(err) throw err;
                            if(!data) {
                                return interaction.reply({content: "Нет данных для удаления!"});
                            }

                            const removedWords = [];

                            Words.forEach((w) => {
                                if(!data.Words.includes(w)) return;
                                data.Words.remove(w);
                                removedWords.push(w);
                            });

                            const newArray = await client.filters.get(guild.id)
                            .filter((word) => !removedWords.includes(word));

                            client.filters.set(guild.id, newArray);

                            interaction.reply({content: `Из черного списка удалено: ${removedWords.length} слов(о).`});
                            data.save();
                        });
                    }
                    break;
                }
            }
            break;
        }
    }
}