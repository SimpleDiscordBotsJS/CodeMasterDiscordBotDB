const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { GuildQueue } = require("discord-player");
const { Warning, Error } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "playerError",
    /**
     * @param {GuildQueue} queue
     * @param {Track} track 
     */
    async execute(queue, error, track) {
        const { metadata } = queue;

        const resolved = new PermissionsBitField([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]);
		const missingPerms = metadata.channel.permissionsFor(metadata.client).missing(resolved);
		if(missingPerms.length) {
            return Warning(`[Music] У бота нет прав для отправки уведомления по ивенту [emptyChannel]`);
        }

        Error(error);

		return await metadata.channel.send({ embeds: [new EmbedBuilder().setColor("DarkRed").setTimestamp()
            .setDescription(`\`•\` Возникла ошибка с ${track.title}`)]
        });
    }
}