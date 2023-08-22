const { GuildQueue, Track } = require("discord-player");
const { Info } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "playerSkip",
    /**
     * @param {GuildQueue} queue 
     * @param {Track} track 
     */
    async execute(queue, track) {
        const { user } = queue.metadata;

        try {
            return Info(`[Music] Пользователь [${user.tag}] пропустил трек [${track.title}]`);
        } catch(error) {
            throw error;
        }
    }
}