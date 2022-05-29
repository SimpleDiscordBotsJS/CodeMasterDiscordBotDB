const { Message } = require("discord.js");
const { addWarning, Timeout } = require("../../Utilities/ModFunctions");
const { Warning } = require("../../Utilities/Logger");
const { ANTI_FLOOD } = require("../../Structures/config.json");

const usersMap = new Map();

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message) {
        if(message.author.bot) return;
        if(message.member.permissions.has(["MANAGE_MESSAGES"])) return;

        const Messages = await message.channel.messages.fetch();

        if(usersMap.has(message.author.id)) {
            const userData = usersMap.get(message.author.id);
            const { lastMessage, timer } = userData;
            const difference = message.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount;
    
            if(difference > ANTI_FLOOD.DIFFERENCE) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.lastMessage = message;
                userData.timer = setTimeout(() => {
                    usersMap.delete(message.author.id);
                }, ANTI_FLOOD.TIME_CHECK);
                usersMap.set(message.author.id, userData)
            } else {
                ++msgCount;
                if(parseInt(msgCount) === ANTI_FLOOD.MESSAGE_LIMIT) {
                    if(message.guild.me.permissionsIn(message.channel).has(["SEND_MESSAGES", "MANAGE_MESSAGES"])) {
                        let i = 0;
                        const ToDelete = [];
                        (await Messages).filter((m) => {
                            if(m.author.id === message.author.id && ANTI_FLOOD.MESSAGE_LIMIT > i) {
                                ToDelete.push(m);
                                i++;
                            }
                        });
                        message.channel.bulkDelete(ToDelete, true);
    
                        addWarning(message.guild, message.member, message.client.user, "Флуд");
                        if(message.member.timeout() == null) Timeout(message.member, 1000 * 60 * 60, "Флуд");
                    } else {
                        Warning("У бота отсутствуют в канале необходимые права: SEND_MESSAGES & MANAGE_MESSAGES");
                    }
                } else {
                    userData.msgCount = msgCount;
                    usersMap.set(message.author.id, userData);
                }
            }
        } else {
            let remove = setTimeout(() => usersMap.delete(message.author.id), ANTI_FLOOD.TIME_CHECK);

            usersMap.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: remove
            });
        }
    }
}