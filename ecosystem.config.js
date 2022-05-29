module.exports = {
    apps: [{
        name: "CodeBot",
        script: "Structures/index.js",
        watch: true,
        ignore_watch : ["node_modules", "Structures/Logs/"],
    }]
}