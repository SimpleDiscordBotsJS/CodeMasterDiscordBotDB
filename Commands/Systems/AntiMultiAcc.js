const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/GuildSettingsDB");

module.exports = {
    name: "anti-mult",
    description: "Setup the logs channel to the Anti Multi Account system",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "channel", description: "Select the channel to send the server anti-alt logs to", required: true,
            type: "CHANNEL", channelTypes: ["GUILD_TEXT"] 
        }
    ],
    /**
     * @param {GuildMember} member
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const { guild, options } = interaction;
        const LogChannel = options.getChannel("channel");

        await DB.findOneAndUpdate({ GuildID: guild.id }, { AntiMultiAccLog: LogChannel.id }, { new: true, upsert: true })
        .catch((err) => console.log(err));

        await interaction.reply({embeds: [new MessageEmbed().setColor("GOLD").addField("Канал", LogChannel)
        .setDescription("Установлен канал логов системы анти мульти-аккаунтов.")], ephemeral: true});
        
        return;
    }
}