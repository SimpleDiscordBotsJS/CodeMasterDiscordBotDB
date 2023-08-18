class CooldownSystem {
    constructor() {
        this.cooldowns = new Map()
    }

    setCooldown(userId, action, cooldown) {
        const user = this.cooldowns.get(userId) || {}

        user[action] = Date.now() + cooldown

        this.cooldowns.set(userId, user)
    }
    getCooldown(userId, action) {
        const user = this.cooldowns.get(userId) || {}
        const cooldownTime = user[action] || 0

        return Math.max(0, cooldownTime - Date.now())
    }

    inCooldown(userId, action) {
        return this.getCooldown(userId, action) > 0
    }
}

module.exports = new CooldownSystem()