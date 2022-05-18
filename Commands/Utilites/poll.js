const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const DB = require("../../Structures/Schemas/PollDB");

module.exports = {
    name: "poll",
    nameLocalizations: {
        "ru": "опрос"
    },
    description: "Create the poll",
    descriptionLocalizations: {
        "ru": "Создать или управлять опросом"
    },
    permission: "MANAGE_GUILD",
    options: [
        {
            name: "create",
            nameLocalizations: {
                "ru": "создать"
            },
            description: "Create a poll",
            descriptionLocalizations: {
                "ru": "Создать опрос"
            },
            type: "SUB_COMMAND",
            options: [
                { 
                    name: "theme",
                    nameLocalizations: {
                        "ru": "тема"
                    },
                    description: "Specify the topic of the survey",
                    descriptionLocalizations: {
                        "ru": "Укажите тему опроса"
                    },
                    type: "STRING", required: true 
                },
                { 
                    name: "choice1",
                    nameLocalizations: {
                        "ru": "вариант-1"
                    },
                    description: "What is the first choice for the poll",
                    descriptionLocalizations: {
                        "ru": "Укажите первый вариант ответа"
                    },
                    type: "STRING", required: true 
                },
                { 
                    name: "choice2", 
                    nameLocalizations: {
                        "ru": "вариант-2"
                    },
                    description: "What is the second choice for the poll",
                    descriptionLocalizations: {
                        "ru": "Укажите второй вариант ответа"
                    },
                    type: "STRING", required: true 
                },
                { 
                    name: "choice3",
                    nameLocalizations: {
                        "ru": "вариант-3"
                    },
                    description: "What is the third choice for the poll",
                    descriptionLocalizations: {
                        "ru": "Укажите третий вариант ответа"
                    },
                    type: "STRING" 
                },
                { 
                    name: "choice4",
                    nameLocalizations: {
                        "ru": "вариант-4"
                    },
                    description: "What is the fourth choice for the poll",
                    descriptionLocalizations: {
                        "ru": "Укажите четвертый вариант ответа"
                    },
                    type: "STRING" 
                },
                { 
                    name: "choice5",
                    nameLocalizations: {
                        "ru": "вариант-5"
                    },
                    description: "What is the fifth choice for the poll",
                    descriptionLocalizations: {
                        "ru": "Укажите пятый вариант ответа"
                    },
                    type: "STRING" 
                },
                { 
                    name: "channel",
                    nameLocalizations: {
                        "ru": "канал"
                    },
                    description: "Select a channel to send a poll",
                    descriptionLocalizations: {
                        "ru": "Выберите канал, для отправки в него опроса"
                    },
                    type: "CHANNEL", channelTypes: ["GUILD_TEXT"]
                }
            ]
        },
        {
            name: "results",
            nameLocalizations: {
                "ru": "результат"
            },
            description: "Show the results of a poll",
            descriptionLocalizations: {
                "ru": "Показать результаты опроса"
            },
            type: "SUB_COMMAND",
            options: [
                { 
                    name: "message_id",
                    nameLocalizations: {
                        "ru": "messageID опроса"
                    },
                    description: "Provide the messageID of the poll", 
                    descriptionLocalizations: {
                        "ru": "Укажите messageID опроса"
                    },
                    type: "STRING", required: true
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guild, user } = interaction;
        const SubCommand = options.getSubcommand();

        switch(SubCommand) {
            case "create": {
                const Title = options.getString("title");
                const Choice1 = options.getString("choice1");
                const Choice2 = options.getString("choice2");
                const Choice3 = options.getString("choice3");
                const Choice4 = options.getString("choice4");
                const Choice5 = options.getString("choice5");
                const Channel = options.getChannel("channel") || interaction.channel;

                let Choices = [`1️⃣ ${Choice1}`, `2️⃣ ${Choice2}`];
                const Row = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId("poll-1")
                    .setStyle("SECONDARY")
                    .setLabel("1️⃣"),
                    new MessageButton()
                    .setCustomId("poll-2")
                    .setStyle("SECONDARY")
                    .setLabel("2️⃣")
                );

                if(Choice3) {
                    Choices.push(`3️⃣ ${Choice3}`);
                    Row.addComponents(
                        new MessageButton()
                        .setCustomId("poll-3")
                        .setStyle("SECONDARY")
                        .setLabel("3️⃣")
                    );
                }

                if(Choice4) {
                    Choices.push(`4️⃣ ${Choice4}`);
                    Row.addComponents(
                        new MessageButton()
                        .setCustomId("poll-4")
                        .setStyle("SECONDARY")
                        .setLabel("4️⃣")
                    );
                }

                if(Choice5) {
                    Choices.push(`5️⃣ ${Choice5}`);
                    Row.addComponents(
                        new MessageButton()
                            .setCustomId("poll-5")
                            .setStyle("SECONDARY")
                            .setLabel("5️⃣")
                    )
                }

                const Embed = new MessageEmbed()
                .setTitle("__**Опрос:**__")
                .setFooter({text: `Опрос от ${user.tag}`})
                .setColor("NOT_QUITE_BLACK")
                .setTimestamp()
                .setDescription(`**${Title}**\n` + Choices.join("\n\n"));

                try {
                    const M = await Channel.send({embeds: [Embed], components: [Row], fetch: true});
                    await DB.create({
                        GuildID: guild.id,
                        ChannelID: Channel.id,
                        MessageID: M.id,
                        CreatedBy: user.id,
                        Title: Title,
                        Button1: 0,
                        Button2: 0,
                        Button3: Choice3 ? 0 : null,
                        Button4: Choice4 ? 0 : null,
                        Button5: Choice5 ? 0 : null,
                    });
                    interaction.reply({content: "Опрос успешно создан", ephemeral: true});
                } catch (err) {
                    interaction.reply({content: `При попытке создать опрос произошла ошибка`, ephemeral: true});
                    console.log(err);
                }
            }
            break;

            case "results": {
                const MessageID = options.getString("message_id");
                const Data = await DB.findOne({ GuildID: guild.id, MessageID: MessageID });
                if(!Data) {
                    return interaction.reply({content: `Не удалось найти ни одного опроса с таким идентификатором сообщения`, ephemeral: true});
                }
                const Embed = new MessageEmbed().setColor("NOT_QUITE_BLACK").setAuthor({name: `${Data.Title}`})
                .setFooter({text: `MessageID: ${MessageID}`}).setTimestamp();
                
                let ButtonSize = [`1️⃣ - Выбрало \`${Data.Button1}\` пользователей`, `2️⃣ - Выбрало \`${Data.Button2}\` пользователей`];
                if(Data.Button3 !== null) ButtonSize.push(`3️⃣ - Выбрало \`${Data.Button3}\` пользователей`);
                if(Data.Button4 !== null) ButtonSize.push(`4️⃣ - Выбрало \`${Data.Button4}\` пользователей`);
                if(Data.Button5 !== null) ButtonSize.push(`5️⃣ - Выбрало \`${Data.Button5}\` пользователей`);

                Embed.setDescription(ButtonSize.join("\n\n"));
                interaction.reply({embeds: [Embed]});
            }
            break;
        }
    }
}