# Discord-DB-Template-Bot
It's a discord bot

---

> # Instructions
## Customizing the Config.json File
 ```js
 {
    "BOT_TOKEN": "Enter_discord_bot_token",
    "DATABASE": "Enter_mongoDB_database_url"
 }
 ```
 
 The bot token can be copied in the Bot section of [your application](https://discord.com/developers/applications)

## To run locally, you need Node.JS
 - [Download Node.JS](https://nodejs.org/en/) - 16.14.2 or above

## Start
 ```sh
 node .
 ```

---

> # pm2
## Install pm2
 ```sh 
 npm install --global pm2
 ```

## Startup
 - [Check this](https://futurestud.io/tutorials/pm2-restart-processes-after-system-reboot)

## Starting
 ```sh
 pm2 start . --name "Code bot" --watch
 ```

## Base commands for Neophyte's
 ```sh
pm2 list - show all process

pm2 stop (id) - stopping process

pm2 logs (. or id) - show logs
 ```
more in `pm2 -h` or [this](https://pm2.keymetrics.io/docs/usage/quick-start/) and Google 😉

---

> ### If you want to use nodemon and pm2
 - [Check this](https://stackoverflow.com/questions/69457892/nodemon-watch-vs-pm2-watch)
