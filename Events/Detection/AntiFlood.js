const { Message, EmbedBuilder } = require("discord.js");
const { Warning } = require("../../Structures/Utilities/Logger");
const { ANTI_FLOOD } = require("../../Structures/Data/Configs/config.json");

const usersMap = new Map();

// TODO: Прокачать систему, ну или вынести в отдельного бота, на более подходящем языке.

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message) {
        if(message.author.bot) return;
        if(message.member.permissions.has(["ManageMessages"])) return;

        const { author, channel, guild, member } = message;

        const Messages = await channel.messages.fetch();

        if(usersMap.has(author.id)) {
            const userData = usersMap.get(author.id);
            const { lastMessage, timer } = userData;
            const difference = message.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount;
    
            if(difference > ANTI_FLOOD.DIFFERENCE) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.lastMessage = message;
                userData.timer = setTimeout(() => {
                    usersMap.delete(author.id);
                }, ANTI_FLOOD.TIME_CHECK);
                usersMap.set(author.id, userData)
            } else {
                ++msgCount;
                if(parseInt(msgCount) === ANTI_FLOOD.MESSAGE_LIMIT) {
                    if(guild.members.me.permissionsIn(channel).has(["SendMessages", "ManageMessages"])) {
                        let i = 0;
                        const ToDelete = [];
                        (await Messages).filter((m) => {
                            if(m.author.id === author.id && ANTI_FLOOD.MESSAGE_LIMIT > i) {
                                ToDelete.push(m);
                                i++;
                            }
                        });

                        channel.bulkDelete(ToDelete, true);

                        await author.send({ embeds: [new EmbedBuilder()
                        .setColor("Orange").setTitle("⌛ __**Мьют**__ ⌛")
                        .setDescription(`Вы были __замьючены__ на сервере: **${member.guild.name}**`)
                        .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 512}))
                        .addFields(
                            { name: "Пользователь:", value: `\`\`\`${member.user.tag}\`\`\``, inline: true },
                            { name: "Время:", value: `\`\`\`24h\`\`\``, inline: true },
                            { name: "Причина:", value: `\`\`\`Флуд\`\`\`` })
                        .setFooter({ text: `Сервер: ${member.guild.name} | ID: ${member.user.id}` })
                        .setTimestamp()]
                        });

                        await member.timeout(24 * 60 * 60 * 1000, "Флуд");
                    } else {
                        Warning("У бота отсутствуют в канале необходимые права: SendMessages & ManageMessages");
                    }
                } else {
                    userData.msgCount = msgCount;
                    usersMap.set(author.id, userData);
                }
            }
        } else {
            let remove = setTimeout(() => usersMap.delete(author.id), ANTI_FLOOD.TIME_CHECK);

            usersMap.set(author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: remove
            });
        }
    }
}