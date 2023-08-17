# CodeM Discord Bot

---

# Instructions
> <details>
> <summary>Configuration</summary>
>  1. Go to `Structures/` <br>
>  2. Rename `.env.example` to `.env` <br>
>  3. Change `.env`
> 
> ```sh
>  # Discord Bot Token
>  BOT_TOKEN = 
> 
>  # MongoDB url
>  DATABASE_URL = 
> 
>  # Webhooks
>  WEBHOOK_JOIN = 
>  WEBHOOK_EXIT = 
> 
>  
>  # Audit webhooks
>  WEBHOOK_AUDIT_CHANNEL=
>  WEBHOOK_AUDIT_BAN=
>  WEBHOOK_AUDIT_EVENT=
>  WEBHOOK_AUDIT_MEMBER=
>  WEBHOOK_AUDIT_MESSAGE=
>  WEBHOOK_AUDIT_ROLE=
>  WEBHOOK_AUDIT_THREAD=
> ```
>  The bot token can be copied in the Bot section of [your application](https://discord.com/developers/applications)
> </details>


## To run locally, you need Node.JS
 - [Download Node.JS](https://nodejs.org/en/) - 16.14.2 or above

## Start
 ```sh
 node .
 ```

---

> ## pm2
> <details>
> <summary>Installation pm2</summary>
> 
> 
> ## Install pm2
> ```sh 
> npm install --global pm2
> ```
> 
> ## Startup
>  - [Check this](https://futurestud.io/tutorials/pm2-restart-processes-after-system-reboot)
> 
> ## Starting
>  ```sh
>  pm2 start . --name "CodeM bot" --watch
>  ```
> 
> ## Base commands for Neophyte's
>  ```sh
> pm2 list - show all process
> 
> pm2 stop (id) - stopping process
> 
> pm2 logs (. or id) - show logs
>  ```
> more in `pm2 -h` or [this](https://pm2.keymetrics.io/docs/usage/quick-start/) and Google 😉
> 
> ---
> 
> ## If you want to use nodemon and pm2
>  - [Check this](https://stackoverflow.com/questions/69457892/nodemon-watch-vs-pm2-watch)
> 
> </details>

---

> ## Contribution
​
Please make sure to read the [Contributing Guide](CONTRIBUTING.md) before sending an issue or making a pull request.
