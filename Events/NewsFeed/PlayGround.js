const { EmbedBuilder, Client, ChannelType } = require("discord.js");
const { Error, Success } = require("../../Structures/Utilities/Logger");
const dataBase = require("../../Structures/Data/Schemas/FeedsDB");
const Parser = require("rss-parser");
const posts = new Parser({ timeout: 120000 });

module.exports = {
    name: "ready",
    /**
     * @param {Client} client
     */
    async execute(client) {

        checkOneHour();
        
        async function checkOneHour() {
            const feed = await posts.parseURL(`http://www.playground.ru/rss/news.xml`).catch(e => {
                setTimeout(checkOneHour, 1000 * 60)
            });

            const channel = await client.channels.fetch(client.config.FEEDS_CHANNELS.PLAYGROUND).catch(e => {
                return Error("[FEED][PLAYGROUND] Не удалось определить канал!");
            });
            if(!channel) return Error("[FEED][PLAYGROUND] Канал не найден!");
            if(channel.type !== ChannelType.GuildText) {
                return Error("[FEED][PLAYGROUND] Найденный канал имеет неподходящий тип!");
            }

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
            
            setTimeout(checkOneHour, 1000 * 60 * 10);
        }
    }
}