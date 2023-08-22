const { GuildQueue } = require("discord-player");
const { Info, Error } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "disconnect",
    /**
     * @param {GuildQueue} queue 
     */
    async execute(queue) {
        const { member } = queue.metadata;
        const channel = member.voice.channel;
        if(!channel) return Error(`[Music] Канал не найден!`);

        try {
            Info(`[Music] Отключено от канала [${channel.name}]`);
        } catch(error) {
            return Error(`[Music] ${error}`);
        }
    }
}