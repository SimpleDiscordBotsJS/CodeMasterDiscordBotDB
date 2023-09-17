const { ActivityType, Client } = require("discord.js");
const { Success } = require("../../Structures/Utilities/Logger");
const { loadCommands } = require("../../Structures/Handlers/commandHandler");

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

        loadCommands(client);

        require("../../Structures/Systems/AntiScamSystem")(client);
        require("../../Structures/Systems/AutoRoleSystem")(client);
    }
}