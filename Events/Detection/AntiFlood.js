const { Message } = require("discord.js");
const { addWarning, Timeout } = require("../../Utilities/ModFunctions");
const { Warning } = require("../../Utilities/Logger");
const { ANTI_FLOOD } = require("../../Structures/config.json");

const usersMap = new Map();

// TODO: Прокачать систему, ну или вынести в отдельного бота, на более подходящем языке.

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message) {
        if(message.author.bot) return;
        if(message.member.permissions.has(["MANAGE_MESSAGES"])) return;

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
                    if(guild.me.permissionsIn(channel).has(["SEND_MESSAGES", "MANAGE_MESSAGES"])) {
                        let i = 0;
                        const ToDelete = [];
                        (await Messages).filter((m) => {
                            if(m.author.id === author.id && ANTI_FLOOD.MESSAGE_LIMIT > i) {
                                ToDelete.push(m);
                                i++;
                            }
                        });
                        channel.bulkDelete(ToDelete, true);
    
                        await addWarning(guild, member, message.client.user, "Флуд");
                        if(member.timeout() == null) Timeout(member, 1000 * 60 * 60, "Флуд");
                    } else {
                        Warning("У бота отсутствуют в канале необходимые права: SEND_MESSAGES & MANAGE_MESSAGES");
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