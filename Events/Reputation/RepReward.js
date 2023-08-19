const { Message, Client } = require("discord.js");
const { getData } = require("../../Structures/Utilities/RepUtilities");

//TODO: Переделать систему наград.

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        const { member, guild } = message;

        const { REP_ROLE_1, REP_ROLE_2, REP_ROLE_3 } = client.config;

        const data = await getData(guild.id, member.id);
        if(!data) return;

        const rep = data.Reputation.Positive + data.Reputation.Negative;
        const rolesToAdd = [];

        if(rep >= 100 && rep <= 149 && REP_ROLE_1) {
            rolesToAdd.push(REP_ROLE_1);
        }

        if(rep >= 150 && rep <= 299 && REP_ROLE_2) {
            rolesToAdd.push(REP_ROLE_2);
            if(REP_ROLE_1) rolesToAdd.push(REP_ROLE_1);
        }

        if(rep >= 300 && REP_ROLE_3) {
            rolesToAdd.push(REP_ROLE_3);
            if(REP_ROLE_2) rolesToAdd.push(REP_ROLE_2);
            if(REP_ROLE_1) rolesToAdd.push(REP_ROLE_1);
        }

        const memberRoles = member.roles.cache.map(role => role.id);
        rolesToAdd.forEach(roleToAdd => {
            if(!memberRoles.includes(roleToAdd)) {
                member.roles.add(roleToAdd).catch(console.error);
            }
        });

        const rolesToRemove = [REP_ROLE_3, REP_ROLE_2, REP_ROLE_1].filter(role => role && !rolesToAdd.includes(role));
        rolesToRemove.forEach(roleToRemove => {
            if(memberRoles.includes(roleToRemove)) {
                member.roles.remove(roleToRemove).catch(console.error);
            }
        });
    }
}