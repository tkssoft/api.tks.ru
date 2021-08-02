
const g47name = (g471, letter) => {
    switch (letter) {
        case "":
        case "1": return "Сборы";
        case "2": return "Пошлина";
        case "3": return "Врем. пошлина";
        case "4": return "Дополн. пошлина";
        case "5": return "Антидем. пошлина";
        case "6": return "Компен. пошлина";
        case "7": return "Акциз";
        case "8": return "НДС";
        default: return g471;
    }
};

const calctype = () => {
    return {
        0: "Импорт",
        1: "Экспорт",
        2: "Депозит"
    }
};

const TYPE_IM = 0;
const TYPE_EK = 1;
const TYPE_DEPOSIT = 2;

const QTYFIELDS = ["G38", "GEDI1", "GEDI2", "GEDI3", "VOLUME"];

const get_api_tks_ru = () => {
    const api = 'https://api.tks.ru'
    try {
        return window.api_tks_ru === undefined? api: api_tks_ru
    } catch {
        return api
    }
}

const nbsp = '\u00A0';

export {
    g47name,
    calctype,
    TYPE_IM,
    TYPE_EK,
    TYPE_DEPOSIT,
    QTYFIELDS,
    get_api_tks_ru,
    nbsp
}