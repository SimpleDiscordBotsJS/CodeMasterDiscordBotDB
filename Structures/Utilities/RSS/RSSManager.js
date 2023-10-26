const { EmbedBuilder, Client, TextChannel, NewsChannel } = require("discord.js");
const compact = require("./LodashCompact");
const isEqual = require("./LodashIsEqual");
const { Error, Info } = require("../Logger");
const fs = require("fs");
const path = require("path");
const RSSParser = require("rss-parser");

const to = (promise) => {
    return promise.then((data) => [null, data]).catch((err) => [err]);
};

class RSSManager {
    /**
     * @param {Client} client 
     */
    constructor(client, folderLocation) {
        this.client = client;
        this.folderLocation = path.join(__dirname, "../..", folderLocation);

        this.rssParser = new RSSParser();

        if (!fs.existsSync(this.folderLocation)) {
            fs.mkdirSync(this.folderLocation);
        }

        this.feeds = [];

        this.load();
    }

    /**
     * @param {TextChannel|NewsChannel} channel Discord guild text\news channel
     * @param {URL} url Link to the RSS feed
     */
    async subscribeTo(channel, url) {
        // Fetch current feed data
        const [err, feed] = await to(this.rssParser.parseURL(url));
        if (err) return channel.send(err + "!");

        // Get and sort all existing feeds
        let files = await fs.promises.readdir(this.folderLocation);
        files = files.sort((a, b) => {
            if (a === b) return 0;
            return a < b ? -1 : 1;
        });

        // If the feed in the supplied channel already exists then return
        for (const file of files) {
            const fileData = JSON.parse(await fs.promises.readFile(path.join(this.folderLocation, file)));
            if (fileData.channel === channel.id && fileData.url === url) {
                return;
            }
        }

        // Otherwise increment the filename by 1 to save it
        const nextFileName = files.length > 0 ? parseInt(files[files.length - 1].replace(/[^0-9]+/g, "")) + 1 + ".json" : "0.json";

        // Add it to the list of running feeds
        this.feeds.push(nextFileName);

        // Subscription format
        const feedData = {
            channel: channel.id,
            url,
            fileName: nextFileName,
            feed
        };

        // Save to disk
        await fs.promises.writeFile(path.join(this.folderLocation, nextFileName), JSON.stringify(feedData));
        Info(`[RSSManager] Добавлена новая новостная лента. Имя дата файла: [ ${nextFileName} ]`);

        // Add to RSS subscription rotation
        this.fetch(feedData);
    }

    /**
     * @param {TextChannel|NewsChannel} channel Discord guild text\news channel
     * @param {URL} url Link to the RSS feed
     */
    async unsubscribeFrom(channel, url) {
        let files = await fs.promises.readdir(this.folderLocation);

        for (const file of files) {
            const fullPath = path.join(this.folderLocation, file);
            const fileData = JSON.parse(await fs.promises.readFile(fullPath));
            if (fileData.channel === channel.id && fileData.url === url) {
                this.feeds.splice(this.feeds.indexOf(file), 1);
                Info(`[RSSManager] Новостная лента удалена. Имя дата файла: [ ${file.toString()} ]`);
                return await fs.promises.unlink(fullPath);
            }
        }
    }

    async load() {
        Info(`[RSSManager] Загрузка...`);
        const files = (await fs.promises.readdir(this.folderLocation)).filter((fileName) => fileName.endsWith(".json"));
        for (const file of files) {
            const feedData = JSON.parse(await fs.promises.readFile(path.join(this.folderLocation, file)));
            this.feeds.push(file);
            this.fetch(feedData, true);
            Info(`[RSSManager] Загружена информация о новостной ленте из файла: [ ${file.toString()} ]`);
        }
    }

    /**
     * @param {Boolean} now true/false - if true, the startup will occur at the moment the function is called. If false, in a minute.
     */
    async fetch(feedData, now) {
        setTimeout(async () => {
            if (this.feeds.indexOf(feedData.fileName) === -1) return;

            const channel = await this.client.channels.fetch(feedData.channel);
            if (!channel) return Info(`[RSSManager] Отправка новостной ленты остановлена!\nПричина: Не удалось получить канал!\n`);

            const [err, newFeed] = await to(this.rssParser.parseURL(feedData.url));
            if (err) Error(`[RSSManager] произошла ошибка при получении новостной ленты: \n${err}\n`);

            // If there are new items
            if (!isEqual(feedData.feed.items, newFeed.items)) {
                // Filter for the new items
                const newItems = compact(newFeed.items.map((newItem) => {
                    const hasItem = feedData.feed.items.find((oldItem) => isEqual(oldItem, newItem));

                    if (!hasItem) {
                        return newItem;
                    }
                }));

                // Make Discord embeds for each one
                const embeds = await this.makeEmbeds(newItems, newFeed);
                for (const embed of embeds) {
                    // Send to the channel
                    channel.send({ embeds: [embed] }).then((message) => {
                        if(message.crosspostable) m.crosspost();
                        message.startThread({ name: `${embed.data.title.substring(0, 50)}...`});
                    }).catch(error => {
                        Error(`[RSSManager] Возникла ошибка при отправке сообщения:\n${error}\n`);
                    });
                }

                // Update the saved data
                feedData.feed = newFeed;
                await fs.promises.writeFile(path.join(this.folderLocation, feedData.fileName), JSON.stringify(feedData));
            }

            this.fetch(feedData);
        }, now ? 0 : 60000);
    }

   async makeEmbeds(items, feed) {
        const embeds = [];

        for (const item of items) {
            const embed = new EmbedBuilder().setColor("Red");

            if (item.contentSnippet) {
                embed.setDescription(item.contentSnippet);
            } else {
                embed.setDescription(item.description.slice(0, 2048));
            };
            if (item.enclosure) {
                if (item.enclosure.url) embed.setImage(item.enclosure.url);
            };
            if (item.title) embed.setTitle(item.title.slice(0, 256));
            if (item.link) {
                if (item.link.match(/(?:http).+(?::\/\/).+\..+/g)) {
                    embed.setURL(item.link)
                } else {
                    embed.setURL(feed.link)
                }
            };

            embeds.push(embed);
        }
        return embeds;
    }
}

module.exports = RSSManager;