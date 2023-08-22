const { GuildQueue } = require("discord-player");
const { Info, Error } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "connectionDestroyed",
    /**
     * @param {GuildQueue} queue 
     */
    async execute(queue) {
        try {
            Info(`[Music] Голосовое соединение на сервере [${queue.guild.name}] было уничтожено!`);

            queue.delete();
        } catch(error) {
            return Error(`[Music] ${error}`);
        }
    }
}