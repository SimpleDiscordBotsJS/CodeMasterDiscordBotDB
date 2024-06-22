const { ActivityType, Client } = require("discord.js");
const { Success, Error } = require("../../Structures/Utilities/Logger");
const { loadCommands } = require("../../Structures/Handlers/commandHandler");
const RSSManager = require("../../Structures/Utilities/RSS/RSSManager");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    execute(client) {
        try {
            Success(`[BOT] Запущен от имени бота: ${client.user.tag}`);
            client.user.setPresence({
                activities: [{ name: "Сервер - CodeМ", type: ActivityType.Custom }],
                status: "dnd",
            });

            setInterval(() => {
                client.user.setPresence({
                    activities: [{ name: "Сервер - CodeМ", type: ActivityType.Custom }],
                    status: "dnd",
                });
            }, 60 * 60 * 1000);

            loadCommands(client);
            
            client.rssManager = new RSSManager(client, "./Data/RSSFeeds");

            require("../../Structures/Systems/AntiScamSystem")(client);
            require("../../Structures/Systems/AutoRoleSystem")(client);
        } catch (error) {
            return Error(`[Client/ready] Произошла ошибка:\n${error}`);
        }
    }
}