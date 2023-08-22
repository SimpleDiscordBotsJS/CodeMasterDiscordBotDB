const { ActivityType, Client } = require("discord.js");
const { Success } = require("../../Structures/Utilities/Logger");
const { loadCommands } = require("../../Structures/Handlers/commandHandler");
const { loadPlayerEvents } = require("../../Structures/Handlers/playerHandler");
const { Player } = require("discord-player");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    execute(client) {
        Success(`[BOT] Запущен от имени бота: ${client.user.tag}`);
        client.user.setPresence({
            activities: [{ name: "CodeМ", type: ActivityType.Watching }],
            status: "dnd",
        });

        const player = new Player(client);
        player.extractors.loadDefault();

        loadPlayerEvents(player);
        loadCommands(client);

        require("../../Structures/Systems/AntiScamSystem")(client);
    }
}