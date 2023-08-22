const { GuildQueue } = require("discord-player");
const { Info, Error } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "connection",
    /**
     * @param {GuildQueue} queue 
     */
    execute(queue) {
        const { member, user } = queue.metadata;
        const channel = member.voice.channel;
        if(!channel) return Error(`[Music] Канал не найден!`);

        try {
            Info(`[Music] Подключено к каналу [${channel.name}] по запросу от [${user.tag}]`)
        } catch(error) {
            return Error(`[Music] ${error}`);
        }
    }
}