const { Message, EmbedBuilder } = require("discord.js");
const { Warning, Error } = require("../../Structures/Utilities/Logger");
const { ANTI_FLOOD } = require("../../Structures/Data/Configs/config.json");

const usersMap = new Map();
let cachedMessages;

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message) {
        const { author, channel, guild, member } = message;

        if(author.bot || member.permissions.has("ManageMessages")) return;

        if(!cachedMessages) {
            cachedMessages = await channel.messages.fetch();
        }

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
                usersMap.set(author.id, userData);
            } else {
                ++msgCount;
                if(msgCount === ANTI_FLOOD.MESSAGE_LIMIT) {
                    if(guild.members.me.permissionsIn(channel).has(["SendMessages", "ManageMessages"])) {
                        const messagesToDelete = cachedMessages.filter(m => m.author.id === author.id).array().slice(0, ANTI_FLOOD.MESSAGE_LIMIT);
                        channel.bulkDelete(messagesToDelete, true);

                        await author.send({ embeds: [new EmbedBuilder().setColor("Orange")
                            .setTitle("⌛ __**Мьют**__ ⌛")
                            .setDescription(`\`•\` Вы были __замьючены__ на сервере: **${member.guild.name}**`)
                            .setThumbnail(member.user.displayAvatarURL({ size: 512 })).addFields(
                                { name: "Пользователь:", value: `\`\`\`${member.user.tag}\`\`\``, inline: true },
                                { name: "Время:", value: `\`\`\`24h\`\`\``, inline: true },
                                { name: "Причина:", value: `\`\`\`Флуд\`\`\`` }
                            )
                            .setFooter({ text: `Сервер: ${member.guild.name} | ID: ${member.user.id}` })
                            .setTimestamp()]
                        }).catch(e => {
                            return Error(`[Detection/AntiFlood] Произошла ошибка при отправке:\n${e}`);
                        });

                        await member.timeout({ duration: 24 * 60 * 60 * 1000, reason: "Флуд" }).catch(e => {
                            return Error(`[Detection/ScamDetection] Произошла ошибка при выполнении timeout'а:\n${e}`);
                        });
                    } else {
                        Warning("У бота отсутствуют в канале необходимые права: SendMessages & ManageMessages");
                    }
                } else {
                    userData.msgCount = msgCount;
                    usersMap.set(author.id, userData);
                }
            }
        } else {
            const remove = setTimeout(() => usersMap.delete(author.id), ANTI_FLOOD.TIME_CHECK);
            usersMap.set(author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: remove
            });
        }
    }
}