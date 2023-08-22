const { GuildQueue } = require("discord-player");
const { Error } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "connectionError",
    /**
     * @param {GuildQueue} queue 
     */
    async execute(queue, error) {
        return Error(`[Music] На сервере [${queue.guild.name}] произошла ошибка, выданная соединением: ${error.message}`);
    }
}