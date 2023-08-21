const { ChannelType, Client, Collection, VoiceState } = require("discord.js");
const schema = require("../../Structures/Data/Schemas/JoinToCreateDB");
const voiceManager = new Collection();

//TODO: По возможности, обновить/улучшить.

module.exports = {
    name: "voiceStateUpdate",
    /**
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState
     * @param {Client} client 
     */
    async execute(oldState, newState, client) {
        const { member, guild } = oldState;

        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        const data = await schema.findOne({ GuildID: newState.guild.id });
        if(!data) return;

        const channelId = data.ChannelID;
        const channel = await client.channels.fetch(channelId);
        if(!channel) return;
        
        const userLimit = data.UserLimit;

        if(oldChannel !== newChannel && newChannel && newChannel.id === channel.id) {
            const voiceChannel = await guild.channels.create({
                name: `Канал ${member.user.tag}`,
                type: ChannelType.GuildVoice,
                parent: newChannel.parent,
                permissionOverwrites: [
                    { id: member.id, allow: ["Connect", "ManageChannels"] },
                    { id: guild.id, allow: ["Connect"] }
                ],
                userLimit: userLimit
            });

            voiceManager.set(member.id, voiceChannel.id);

            await newChannel.permissionOverwrites.edit(member, {
                Connect: false
            });

            setTimeout(() => {
                newChannel.permissionOverwrites.delete(member);
            }, 30 * 1000);

            return setTimeout(() => {
                member.voice.setChannel(voiceChannel);
            }, 500);
        }

        const joinToCreate = voiceManager.get(member.id);
        const members = oldChannel?.members.filter((member) => !member.user.bot).map((member => member.id));

        if(joinToCreate && oldChannel.id === joinToCreate && (!newChannel || newChannel.id !== joinToCreate)) {
            if(members.length > 0) {
                let randomId = members[Math.floor(Math.random() * members.length)];
                let randomMember = guild.members.cache.get(randomId);

                randomMember.voice.setChannel(oldChannel).then(() => {
                    oldChannel.setName(`Канал ${randomMember.user.username}`).catch((error) => console.log(error));
                    oldChannel.permissionOverwrites.edit(randomMember, {
                        Connect: true,
                        ManageChannels: true
                    });
                });

                voiceManager.set(member.id, null);
                voiceManager.set(randomMember.id, oldChannel.id);
            } else {
                voiceManager.set(member.id, null);
                oldChannel.delete().catch((error) => console.log(error));
            }
        }
    }
}