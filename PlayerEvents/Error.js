const { GuildQueue } = require("discord-player");
const { Error } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "error",
    /**
     * @param {GuildQueue} queue
     */
    execute(queue, error) {
        return Error(`[MUSIC] ${error}`);
    }
}