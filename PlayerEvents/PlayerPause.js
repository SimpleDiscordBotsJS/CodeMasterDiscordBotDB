const { GuildQueue } = require("discord-player");
const { Info } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "playerPause",
    /**
     * @param {GuildQueue} queue 
     */
    async execute(queue) {
        return Info(`[Music] Плеер на сервере [${queue.guild.name}] поставлен на паузу`);
    }
}