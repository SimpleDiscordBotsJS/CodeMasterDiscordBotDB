const { Message, Client } = require("discord.js");
const { getData } = require("../../Structures/Utilities/RepUtilities");
const CooldownUtil = require("../../Structures/Utilities/CooldownUtil");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        const { author, channel, guild } = message;
        const channelID = client.config.REP_MSG_CHANNEL;

        if(channel.id !== channelID) return;
        if(CooldownUtil.inCooldown(author.id, "rep_msg_in_channel")) return;

        //Репутация в обычном канале +1 каждые 10 минут.
        const cooldown = CooldownUtil.getCooldown(author.id, "rep_msg_in_channel");
        if(cooldown === 0) CooldownUtil.setCooldown(author.id, "rep_msg_in_channel", 10 * 60 * 1000);

        const data = await getData(guild.id, author.id);
        if(!data) return;

        data.Reputation.Positive += 1;
        await data.save();
    }
}