const { GuildQueue, Track } = require("discord-player");
const { Info } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "playerFinish",
    /**
     * @param {GuildQueue} queue
     * @param {Track} track 
     */
    async execute(queue, track) {
        return Info(`[Music] Плеер на сервере [${queue.guild.name}] закончил проигрывать трек [${track.title}]`);
    }
}