export const ALL_PRIZNAK = -1;

// Признак прочих разрешительных документов на импорт (поле KLASS)
export const I_OTHER_IMPORT = 1;
// Признак прочих разрешительных документов на экспорт (поле KLASS)
export const I_OTHER_EXPORT = 2;
export const I_OTHER_PRICE = 4;
// Признак наличия примечаний по прочим разрешительным документам на импорт (поле KLASS_PR)
export const I_OTHER_LIC_IMPORT = 8;
// Признак наличия примечаний по прочим разрешительным документам на экспорт (поле KLASS_PR)
export const I_OTHER_LIC_EXPORT = 16;

export const CU_SIZE = 4;
export const FLOAT_SIZE = 15;
export const SMALLINT_SIZE = 4;
export const SIGN_SIZE = 1;
export const PREF_SIZE = 2;

// Признаки в tvvedall (поле priznak)
export const PRIZNAK_EXPORTDUTY = 0; // экспортная пошлина
export const PRIZNAK_IMPORTDUTY = 1; // импорная пошлина
export const PRIZNAK_EXCISEDUTY = 2; // акциз
export const PRIZNAK_VAT = 3; // НДС
export const PRIZNAK_DEPOSIT = 4; // депозит
export const PRIZNAK_PREF = 5; // Преференциальные для развивающихся стран
export const PRIZNAK_EXPORTLIC = 6; // лицензия на экспорт
export const PRIZNAK_IMPORTLIC = 7; // лицензия на импорт
export const PRIZNAK_EXPORTQUOTA = 8; // Квотирование - Экспорт
export const PRIZNAK_IMPORTQUOTA = 9; // Квотирование - Импорт
export const PRIZNAK_SAFETY = 11; // Сертификация
export const PRIZNAK_STRATEG = 12; // Стратегические
export const PRIZNAK_IMPORTDOUBLE = 13; // Двойного применения - импорт
export const PRIZNAK_OTHER_LIC_IMP = 14; // Разрешительные прочие
export const PRIZNAK_OTHER = 15; // Прочие особенности
export const PRIZNAK_IMPORTSPECDUTY = 16; // - Временная специальная пошлина
export const PRIZNAK_IMPORTADDDUTY = 17; // доп.имп. пошлина
export const PRIZNAK_IMPORTCOEFF = 18; // особенности коэффициентов для имп. пошлины
export const PRIZNAK_IMPORTANTIDUMP = 19; // - Антидемпинговая пошлина
export const PRIZNAK_IMPORTCOMP = 20; // Компенсационная пошлина
export const PRIZNAK_EXPORTDOUBLE = 21; // Двойного применения - экспорт
export const PRIZNAK_EXPORTFEES = 22; // сборы экспорт
export const PRIZNAK_IMPORTFEES = 23; // сборы импорт
// страны ЕВРАЗИЙСКИЙ ЭКОНОМИЧЕСКИЙ СОЮЗ (ЕАЭС)
// импорная пошлина
export const PRIZNAK_IMPORTDUTY_EA = 24;
// акциз
export const PRIZNAK_EXCISEDUTY_EA = 25;
// НДС
export const PRIZNAK_VAT_EA = 26;
export const PRIZNAK_OTHER_LIC_EXP = 27; // Разрешительные прочие экспорт
export const PRIZNAK_MARK = 28; // Маркировка КИЗ
export const PRIZNAK_UTIL = 29; // Признак утилизации
export const PRIZNAK_IMPORTDUTY_OTHER = 30; // Импортная пошлина другие страны
export const PRIZNAK_EXPORTDUTY_EA = 31; // Экспортная пошлина стран ЕАЭС
export const PRIZNAK_PREF_92 = 32; // Преференциальные для наименее развитых стран
export const PRIZNAK_TRACE = 33; // Прослеживаемость
export const PRIZNAK_PENEXP = 34; // Перечень запретов других стран - экспорт
export const PRIZNAK_PENIMP = 35; // Перечень запретов других стран - импорт


const PRIZNAK_NONE = 99;

export const PRIZNAK_EA = [PRIZNAK_IMPORTDUTY_EA, PRIZNAK_EXCISEDUTY_EA, PRIZNAK_VAT_EA];
const PRIZNAK_MAX = 35;

export const CNTR_RUSSIA = '643';

export const przname = (prz) => {
    switch (String(prz)) {
        case "0":
            return  "Экспортная пошлина";
        case "1":
            return  "Импортная пошлина";
        case "2":
            return  "Акциз";
        case "3":
            return  "НДС";
        case "4":
            return  "Депозит|Ставки обеспечения";
        case "5":
            return  "Преф-ный режим для РС";
        // Экспорт
        case "6":
            return  "Лицензирование";
        // Импорт
        case "7":
            return  "Лицензирование";
        // Экспорт
        case "8":
            return  "Квотирование";
        // Импорт
        case "9":
            return  "Квотирование";
        case "10":
            return  "Сертификация";
        case "11":
            return  "Сертификация";
        case "12":
            return  "Стратегические товары";
        // Импорт
        case "13":
            return  "Товары двойного применения";
        // Импорт
        case "14":
            return  "Разрешительные прочие";
        case "15":
            return  "Прочие особенности";
        case "16":
            return  "Временная специальная пошлина";
        case "17":
            return  "Дополнительная импортная пошлина";
        case "18":
            return  "Особенности коэффициентов для импортной пошлины";
        case "19":
            return  "Антидемпинговая пошлина";
        case "20":
            return  "Компенсационная пошлина";
        // Экспорт
        case "21":
            return  "Товары двойного применения";
        case "22":
            return  "Сборы экспорт";
        case "23":
            return  "Сборы импорт";
        case "24":
            return  "Импортная пошлина стран ЕАЭС";
        case "25":
            return  "Акциз стран ЕАЭС";
        case "26":
            return  "НДС стран ЕАЭС";
        // Экспорт
        case "27":
            return  "Разрешительные прочие";
        case "28":
            return  "Маркировка";
        case "29":
            return  "Утилизация";
        case "30":
            return  "Пошлина по стране";
        case "31":
            return  "Экспортная пошлина стран ЕАЭС";
        case "32":
            return  "Преф-ный режим для НРС";
        case "33":
            return "Прослеживаемость";
        case "34":
            return 'Перечень запретов других стран - экспорт';
        case "35":
            return 'Перечень запретов других стран - импорт';

    }
};

// Обозначения для типов платежей для 47 графы
// Сборы
export const LETTER_ = '';
export const LETTER_A = '1';
// Пошлина
export const LETTER_B = '2';
// Акциз
export const LETTER_C = '7';
// НДС
export const LETTER_D = '8';
export const LETTER_E = '3';
export const LETTER_G = '4';
export const LETTER_J = '5';
export const LETTER_K = '6';
