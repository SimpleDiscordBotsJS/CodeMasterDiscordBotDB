const { ThreadChannel } = require("discord.js");

module.exports = {
    name: "threadCreate",
    /**
     * @param {ThreadChannel} thread 
     */
    async execute(thread) {
        if(thread.joinable && !thread.joined) {
            await thread.join();
        }
    }
}