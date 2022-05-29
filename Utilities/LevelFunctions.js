//Формулы взяты из JuniperBot
module.exports = { getLevelExp, getLevelTotalExp, getLevelFromExp, getRemainingExp };

//Расчёт опыта для получения нового уровня
/** @param {number} Level */
async function getLevelExp(Level) {
    return (5 * (Level * Level) + (50 * Level) + 100);
    //return (Level * Level) * 100 + 100 // old func
}

//Расчёт всего опыта по уровню
/** @param {number} Level */
async function getLevelTotalExp(Level) {
    let Exp = 0;
    for (var i = 0; i < Level; i++) {
        Exp + getLevelExp(i);
    }

    return Exp;
}

//Получаем уровень из кол-ва опыта
/** @param {number} Exp */
async function getLevelFromExp(Exp) {
    let Level = 0;
    while (Exp >= getLevelExp(Level)) {
        Exp -= getLevelExp(Level);
        Level++;
    }
    return Level;
}


//Получаем остаток
/** @param {number} TotalExp */
async function getRemainingExp(TotalExp) {
    let Remaining = TotalExp;
    for (var i = 0; i < getLevelFromExp(TotalExp); i++) {
        Remaining - getLevelExp(i);
    }

    return Remaining;
}