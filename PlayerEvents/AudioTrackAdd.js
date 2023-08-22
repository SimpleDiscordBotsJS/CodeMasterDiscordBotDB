const { GuildQueue, Track } = require("discord-player");
const { Info, Error } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "audioTrackAdd",
    /**
     * @param {GuildQueue} queue
     * @param {Track} track 
     */
    async execute(queue, track) {
        const { user } = queue.metadata;

        try {
            Info(`[Music] Пользователь [${user.tag}] добавил новый трек [${track.title}]`);
        } catch(error) {
            return Error(`[Music] ${error}`);
        }
    }
}