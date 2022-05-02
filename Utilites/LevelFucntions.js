//Формулы взяты из JuniperBot


//Расчёт опыта для получаения нового уровня
exports.getLevelExp = async function getLevelExp(Level) {
    return 5 * (Level * Level) + (50 * Level) + 100;
    //return (Level * Level) * 100 + 100 // old func
}

//Расчёт всего опыта по уровню
exports.getLevelTotalExp = async function getLevelTotalExp(Level) {
    let exp = 0;
    for (var i = 0; i < Level; i++) {
        exp + getLevelExp(i);
    }

    return exp;
}

//
exports.getRemainingExp = async function getRemainingExp(TotalExp) {
    let remaining = TotalExp;
    for (var i = 0; i < getLevelFromExp(TotalExp); i++) {
        remaining - getLevelExp(i);
    }

    return remaining;
}