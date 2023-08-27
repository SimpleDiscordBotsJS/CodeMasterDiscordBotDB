const { GuildMember, Client } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member 
     * @param {Client} client 
     */
    async execute(member, client) {
        const { guild, roles } = member;

        const roleToAdd = await client.autoRole.get(guild.id);
        const checkRole = guild.roles.cache.find(role => role.id === roleToAdd);
        if(!checkRole) return;

        const memberRoles = roles.cache.get(checkRole);
        if(!memberRoles) return;

        roles.add(checkRole);
    }
}