const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { GuildQueue } = require("discord-player");
const { Warning } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "emptyChannel",
    /**
     * @param {GuildQueue} queue 
     */
    async execute(queue) {
        const { metadata } = queue;

        const resolved = new PermissionsBitField([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]);
		const missingPerms = metadata.channel.permissionsFor(metadata.client).missing(resolved);
		if(missingPerms.length) {
            return Warning(`[Music] У бота нет прав для отправки уведомления по ивенту [emptyChannel]`);
        }

		await metadata.channel.send({ embeds: [new EmbedBuilder().setColor("DarkRed").setTimestamp()
            .setDescription("Я покинул канал через **5 минут** по причине **отсутствия активности канала**.")]
        }).then((m) => setTimeout(() => m.delete(), 15000));
    }
}