const { ThreadChannel } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "threadCreate",
    /**
     * @param {ThreadChannel} thread 
     */
    async execute(thread) {
        if(thread.joinable && !thread.joined) {
            await thread.join().catch(e => {
                return Error(`[Thread/AutoJoin] Произошла ошибка:\n${e}`);
            });
        }
    }
}