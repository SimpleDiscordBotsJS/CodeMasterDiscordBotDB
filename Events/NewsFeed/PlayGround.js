const { EmbedBuilder, Client, ChannelType } = require("discord.js");
const { Error, Info, Success } = require("../../Structures/Utilities/Logger");
const dataBase = require("../../Structures/Data/Schemas/FeedsDB");
const Parser = require("rss-parser");
const posts = new Parser({ timeout: 120000 });

module.exports = {
    name: "ready",
    /**
     * @param {Client} client
     */
    async execute(client) {

        everyTenMinutes();

        /**
         * Check exist and get guild channel
         * @param {Client} client Discord bot Client
         * @param {String} channelId Discord Guild Channel ID
         * @returns Return guild channel or error
         */
        async function checkExistAndGetChannel(client, channelId) {
            try {
                const checkChannel = await client.channels.fetch(channelId).catch(e => {
                    Error(`[FEED][PLAYGROUND] Не удалось определить канал! Причина: \n${e}`);
                });

                if(!checkChannel) {
                    Error(`[FEED][PLAYGROUND] Канал не найден! Остановка отправки...`);
                    return false;
                }

                if(checkChannel.type === ChannelType.GuildText) {
                    //Info(`[FEED][PLAYGROUND] Канал успешно определён!`);
                    return checkChannel;
                } else if(checkChannel.type === ChannelType.GuildAnnouncement) {
                    //Info(`[FEED][PLAYGROUND] Канал успешно определён!`);
                    return checkChannel;
                } else {
                    Error(`[FEED][PLAYGROUND] Найденный канал имеет неподходящий тип! Остановка отправки...`);
                    return false;
                }
            } catch (e) {
                Error(e);
                return false;
            }
        }

        
        async function everyTenMinutes() {
            const feed = await posts.parseURL(`http://www.playground.ru/rss/news.xml`).catch(e => {
                Error(`[FEED][PLAYGROUND] Не удалось загрузить ленту! Причина: \n${e}`);
                setTimeout(everyTenMinutes, 1000 * 60);
            });
            if(!feed) return Info(`[FEED][PLAYGROUND] Производится попытка восстановления работоспособности через перезапуск!`);

            const channel = await checkExistAndGetChannel(client, client.config.FEEDS_CHANNELS.PLAYGROUND);
            if(!channel) return Info(`[FEED][PLAYGROUND] Отправка новостной ленты остановлена!`);

            let data = await dataBase.findOne({ GuildID: channel.guildId });
            if(!data) data = await dataBase.create({ GuildID: channel.guildId });
            const lastId = data.FeedsData.PlayGround;

            feed.items.reverse().forEach(async (item) => {
                const id = item.guid.match(/\d/g).join("");

                if(lastId < id) {
                    data.FeedsData.PlayGround = id;

                    const Embed = new EmbedBuilder()
                    .setTitle(item.title)
                    .setDescription(item.contentSnippet)
                    .setURL(item.link)
                    .setColor("Red")
                    .setImage(item.enclosure.url);
                        
                    channel.send({ embeds: [Embed] }).then((m) => {
                        if(m.crosspostable) m.crosspost();
                        m.startThread({ name: `${item.title.substring(0, 50)}...`});
                    });

                    Success(`[FEED][PLAYGROUND] Отправлен пост под номером: [${id}]`);
                }
            });

            await data.save();
            
            // ======================================================================== //
            
            setTimeout(everyTenMinutes, 1000 * 60 * 10);
        }
    }
}