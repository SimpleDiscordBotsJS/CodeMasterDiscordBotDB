const { Message } = require("discord.js");
const { CREATE_THREAD_TO_CHANNELS, NEWS_THREAD_CREATE_TO_CHANNELS } = require("../../Structures/config.json");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message) {
        if(message.author.bot) return;

        //Просто каналы
        CREATE_THREAD_TO_CHANNELS.forEach(async (channel) => {
            if(!message.guild.channels.cache.get(channel)) return;
            if(message.channel.id != channel) return;

            let Content = message.content;

            Content = Content.replaceAll("*", "")
                .replaceAll("_", "").replaceAll("~", "")
                .replaceAll("`", "").replaceAll("|", "");

            await message.startThread({ name: `${capitalizeFirstLetter(Content).substring(0, 50)}...`, autoArchiveDuration: 60 })
            .then((thread) => {
                thread.setLocked(true);
            });
        });

        //Новостные каналы
        NEWS_THREAD_CREATE_TO_CHANNELS.forEach(async (channel) => {
            if(!message.guild.channels.cache.get(channel)) return;
            if(message.channel.id != channel) return;

            let name = `${new Date().getHours()}.${new Date().getMinutes()} - ${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`;

            await message.startThread({ name: name, autoArchiveDuration: 1440 }).then((thread) => {
                thread.setLocked(true);
            });
        });


        //Делаем первый символ, верхнего регистра
        function capitalizeFirstLetter(string) {
            return string[0].toUpperCase() + string.slice(1);
        }
    }
}