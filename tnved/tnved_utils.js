/* Расшифровка значений ставок/признаков по товарам */

const tnv_const = require('./tnv_const');
const { getLook } = require('./tnvlook');
const { debug } = require('../common/debug');
const nsi = require('../common/nsi');
const { TYPE_IM, TYPE_EK, TYPE_DEPOSIT } = require('../common/consts')

import { isEmpty } from '../common/utils'


const EncodeSign = (s) => {
    switch (s) {
        case '>':
            return ' но не менее ';
        case '<':
            return ' но не более ';
        case '+':
            return ' плюс ';
        case '-':
            return ' минус ';
        case '|':
            return ' или ';
        case '~':
            return ' для ТС более ';
        default:
            return ' ';
    }
};


const strtoreal = (r) => {
    return r ? parseFloat(r) : parseFloat(0);
};


const trim = (s) => {
    return (typeof s === 'string') ? String(s).trim() : s !== undefined ? String(s) : ''
};


const inlist = (s, arr) => {
    return arr && arr.indexOf(s) !== -1
};


const isnull = (s) => {
    return [null, undefined, ''].includes(s)
}


const get5 = (prz, s1, t1, s2, t2, s3, t3, pref, s, sign2, def, cu='') => {
    switch (prz) {
        // Экспорт
        case 0:
            if (isnull(s1)) {
                return 'Беспошлинно';
            } else {
                let r = trim(s1) + ' ' + getLook(prz, t1);
                if (!isnull(s)) {
                    r = trim(r + EncodeSign(s) + s2 + ' ' + getLook(prz, t2));
                }
                if ((!isnull(sign2)) && (strtoreal(s3) !== 0)) {
                    r = trim(r + EncodeSign(sign2) + s3 + ' ' + getLook(prz, t3));
                }
                return r;
            }
        // Ставки обеспечения
        case 4:
            if (strtoreal(s1) === 0) {
                return 'Нет'
            } else {
                return trim(s1) + ' ' + getLook(prz, t1);
            }
        // 1 - Импортная пошлина
        case tnv_const.PRIZNAK_IMPORTDUTY:
        case tnv_const.PRIZNAK_IMPORTDUTY_EA:
            if (s1 === null) {
                if (def === null) {
                    return 'Беспошлинно'
                } else {
                    return def
                }
            } else if ((strtoreal(s1) === 0) && (!inlist(pref, ['О', 'ОО', 'С', '', null]))) {
                return `(условно по преф. "${pref}")`
            } else {
                let r = trim(s1) + ' ' + getLook(prz, t1);
                if (s !== null) {
                    r = trim(r + EncodeSign(s) + s2 + ' ' + getLook(prz, t2))
                }
                if ((sign2 !== null) && (strtoreal(s3) !== 0)) {
                    r = trim(r + EncodeSign(sign2) + s3 + ' ' + getLook(prz, t3))
                }
                // Изменения Влада.
                if (!inlist(pref, ['О', 'ОО', '', null])) {
                    if (pref && pref.indexOf('С') !== -1) {
                        r = r + ` (с указанием преф. "${pref}")`
                    } else {
                        r = r + ` (условно по преф. "${pref}'")`
                    }
                }
                return r
            }
        // 2 - Акциз
        // 16 - Временная специальная пошлина
        // 19 - Антидемпинговая пошлина
        // 20 - Компенсационная пошлина
        case tnv_const.PRIZNAK_EXCISEDUTY:
        case tnv_const.PRIZNAK_EXCISEDUTY_EA:
        case tnv_const.PRIZNAK_IMPORTSPECDUTY:
        case tnv_const.PRIZNAK_IMPORTANTIDUMP:
        case tnv_const.PRIZNAK_IMPORTCOMP:
            if (s1 === null) {
                if (def === null) {
                    return 'Нет'
                } else
                    return def
            } else {
                let r = trim(s1) + ' ' + getLook(prz, t1);
                if (!inlist(s, [null, ''])) {
                    r = trim(r + EncodeSign(s) + s2 + ' ' + getLook(prz, t2))
                }
                if ((sign2 !== null) && (strtoreal(s3) !== 0)) {
                    r = trim(r + EncodeSign(sign2) + s3 + ' ' + getLook(prz, t3))
                }
                return r
            }
        // 3 - Н Д С
        case tnv_const.PRIZNAK_VAT:
        case tnv_const.PRIZNAK_VAT_EA:
            if (s1 === null) {
                return 'Нет'
            } else if ((strtoreal(s1) === 0) && (!inlist(pref, ['О', 'ОО', '', null]))) {
                return `0% (условно по преф. "${pref}")`
            } else {
                let r = trim(s1) + ' %';
                if (!inlist(pref, ['О', 'ОО', '', null])) {
                    if (inlist(pref, ['З', 'К', 'Л', 'М', 'Н', 'ЛД', 'ЛК', 'ЛМ', 'ЛП', 'ЛС', 'ПЖ'])) {
                        r = r + ` (с указанием преф. "${pref}")`
                    } else {
                        r = '0% (' + r + ` условно по преф. "${pref}")`
                    }
                }
                return r
            }
        // 17 - Дополнительная импортная пошлина
        case 17:
            if (strtoreal(s1) === 0) {
                return 'Нет'
            } else {
                return trim(s1) + ' %'
            }
        // 15 - Прочие особенности
        case 15:
            return getLook(prz, t1, def);
        case 30:
            let r = '';
            if (t1 === '3') {
                r = 'Ставка ЕТТ'
            } else {
                if (s1 === null) {
                    r = def === null ? 'Беспошлинно' : def
                } else {
                    if ((strtoreal(s1) === 0) && (!inlist(pref, ['О', 'ОО', 'С', '', null]))) {
                        r = `(условно по преф. "${pref}")`
                    } else {
                        r = trim(s1) + ' ' + getLook(prz, t1);
                        if (s !== null) {
                            r = trim(r + EncodeSign(s) + s2 + ' ' + getLook(prz, t2));
                            if ((sign2 !== null) && (strtoreal(s3) !== 0)) {
                                r = trim(r + EncodeSign(sign2) + s3 + ' ' + getLook(prz, t3))
                            }
                        }
                        // Изменения Влада.
                        if (!inlist(pref, ['О', 'ОО', '', null])) {
                            if (pref && pref.indexOf('С') !== -1) {
                                r = r + ` (с указанием преф. "${pref}")`
                            } else {
                                r = r + ` (условно по преф. "${pref}'")`
                            }
                        }
                    }
                }
            }
            if (r !== '' && cu !== undefined && cu !== null) {
                const oksmt = nsi.oksmt();
                if (oksmt[cu] !== undefined) {
                    let name = oksmt[cu].KRNAIM;
                    r = r + ` (${name})`
                }
            }
            return r;
        default:
            return getLook(prz, t1, def)
    }
};


const is_ru = (country) => inlist(country, [null, '', tnv_const.CNTR_RUSSIA]);


const get_priznak = (prz, acountry) => {
    if (!is_ru(acountry)) {
        switch (prz) {
            case tnv_const.PRIZNAK_IMPORTDUTY:
                return tnv_const.PRIZNAK_IMPORTDUTY_EA;
            case tnv_const.PRIZNAK_EXCISEDUTY:
                return tnv_const.PRIZNAK_EXCISEDUTY_EA;
            case tnv_const.PRIZNAK_VAT:
                return tnv_const.PRIZNAK_VAT_EA;
            default:
                return prz;
        }
    } else {
        return prz
    }
};


const STRINGCONST_ONE = () => '1';
const STRINGCONST_ZERO = () => '0';


const calc_get5 = (TBL, prz, acountry=tnv_const.CNTR_RUSSIA) => {
    let b_is_ru = is_ru(acountry);
    switch (prz) {
        // экспортная пошлина
        case tnv_const.PRIZNAK_EXPORTDUTY:
            return get5(prz, TBL.EXP, TBL.EXPEDI, TBL.EXP2, TBL.EXPEDI2,
                TBL.EXP3, TBL.EXPEDI3, null, TBL.EXPSIGN, TBL.EXPSIGN2, 'Беспошлинно');

        // импорная пошлина
        case tnv_const.PRIZNAK_IMPORTDUTY:
            return get5(get_priznak(tnv_const.PRIZNAK_IMPORTDUTY, acountry), TBL.IMP, TBL.IMPEDI, TBL.IMP2, TBL.IMPEDI2,
                TBL.IMP3, TBL.IMPEDI3, TBL.IMPPREF, TBL.IMPSIGN, TBL.IMPSIGN2, b_is_ru ? 'Беспошлинно' : 'Ставка ТС');
        // акциз
        case tnv_const.PRIZNAK_EXCISEDUTY:
            return get5(get_priznak(tnv_const.PRIZNAK_EXCISEDUTY, acountry), TBL.AKC, TBL.AKCEDI, TBL.AKC2, TBL.AKCEDI2,
                TBL.AKC3, TBL.AKCEDI3, null, TBL.AKCSIGN, TBL.AKCSIGN2, 'Нет');
        // НДС
        case tnv_const.PRIZNAK_VAT:
            return get5(get_priznak(tnv_const.PRIZNAK_VAT, acountry), TBL.NDS,
                null, null, null, null, null, TBL.NDSEDI, null, null, 'Нет');
        case 4:
            return get5(4, TBL.DEPOSIT, TBL.DEPOSITEDI, null, null, null, null, null, null, null, 'Нет');
        case 5:
            return get5(5, null, TBL.NOPREF, null, null, null, null, null, null, null, 'Нет');
        case 32:
            return get5(32, null, TBL.PREF92, null, null, null, null, null, null, null, 'Нет');
        case 6:
            return get5(6, null, TBL.LICEXP, null, null, null, null, null, null, null, 'Нет');
        case 7:
            return get5(7, null, TBL.LICIMP, null, null, null, null, null, null, null, 'Нет');
        case 8:
            return get5(8, null, TBL.KVOTAEXP, null, null, null, null, null, null, null, 'Нет');
        case 9:
            return get5(9, null, TBL.KVOTAIMP, null, null, null, null, null, null, null, 'Нет');
        case 21:
            return get5(21, null, TBL.REG, null, null, null, null, null, null, null, 'Нет');
        case 11:
            return get5(11, null, TBL.SAFETY, null, null, null, null, null, null, null, 'Нет');
        case 12:
            return get5(12, null, TBL.STRATEG, null, null, null, null, null, null, null, 'Нет');
        case 13:
            return get5(13, null, TBL.DOUBLE, null, null, null, null, null, null, null, 'Нет');
        // Разрешительные прочие экспорт
        case tnv_const.PRIZNAK_OTHER_LIC_IMP:
            return get5(tnv_const.PRIZNAK_OTHER_LIC_IMP, null,
                parseInt(TBL.KLASS) & tnv_const.I_OTHER_IMPORT ? STRINGCONST_ONE : STRINGCONST_ZERO,
                null, null, null, null, null, null, null, 'Нет');
        // Разрешительные прочие экспорт
        case tnv_const.PRIZNAK_OTHER_LIC_EXP:
            return get5(tnv_const.PRIZNAK_OTHER_LIC_EXP, null,
                parseInt(TBL.KLASS) & tnv_const.I_OTHER_EXPORT ? STRINGCONST_ONE : STRINGCONST_ZERO,
                null, null, null, null, null, null, null, 'Нет');
        // Временная специальная пошлина
        case 16:
            return get5(tnv_const.PRIZNAK_IMPORTSPECDUTY, TBL.IMPTMP, TBL.IMPTMPEDI, TBL.IMPTMP2, TBL.IMPTMPEDI2,
                null, null, null, TBL.IMPTMPSIGN, null, 'Нет');
        case 17:
            return get5(17, TBL.IMPDOP, null, null, null, null, null, null, null, null, 'Нет');
        // Антидемпинговая пошлина
        case 19:
            return get5(tnv_const.PRIZNAK_IMPORTANTIDUMP, TBL.IMPDEMP, TBL.IMPDEMPEDI, TBL.IMPDEMP2, TBL.IMPDEMPEDI2,
                null, null, null, TBL.IMPDEMPSIGN, null, 'Нет');
        case 20:
            return get5(tnv_const.PRIZNAK_IMPORTCOMP, TBL.IMPCOMP, TBL.IMPCOMPEDI, TBL.IMPCOMP2, TBL.IMPCOMPEDI2,
                null, null, null, TBL.IMPCOMPSIGN, null, 'Нет');
        case 28:
            return get5(28, null, TBL.MARK, null, null, null, null, null, null, null, 'Нет');
        case 33:
            return get5(33, null, TBL.TRACE, null, null, null, null, null, null, null, 'Нет');
        case 34:
            return get5(34, null, TBL.PENEXP, null, null, null, null, null, null, null, 'Нет');
        case 35:
            const res = get5(35, null, TBL.PENIMP, null, null, null, null, null, null, null, 'Нет');
            return res;
        default:
            return '';
    }
};


/* Функция определяет, есть ли примечания по указанному номеру признака */
const is_pr = (TBL, prz, TBLCC, acountry=tnv_const.CNTR_RUSSIA) => {
    if (TBL === undefined) {
        return false
    }
    let b_is_ru = is_ru(acountry);
    switch (prz) {
        // экспортная пошлина
        case tnv_const.PRIZNAK_EXPORTDUTY:
            return TBL.EXP_PR === 1;
        // импорная пошлина
        case tnv_const.PRIZNAK_IMPORTDUTY:
            return TBL.IMP_PR === 1;
        // акциз
        case tnv_const.PRIZNAK_EXCISEDUTY:
            return TBL.AKC_PR === 1;
        // НДС
        case tnv_const.PRIZNAK_VAT:
            return TBL.NDS_PR === 1;
        case 4:
            return TBL.DEPOSIT_PR === 1;
        case 5:
            return TBL.NOPREF_PR === 1;
        case 32:
            return TBL.PREF92_PR === 1;
        case 6:
            return TBL.LICEXP_PR === 1;
        case 7:
            return TBL.LICIMP_PR > 0;
        case 8:
            return TBL.KVOTAEXP_PR === 1;
        case 9:
            return TBL.KVOTAIMP_PR === 1;
        case 21:
            return TBL.REG_PR === 1;
        case 11:
            return TBL.SAFETY_PR > 0;
        case 12:
            return TBL.STRATEG_PR === 1;
        case 13:
            return TBL.DOUBLE_PR === 1;
        // Разрешительные прочие экспорт
        case tnv_const.PRIZNAK_OTHER_LIC_IMP:
            return TBL.KLASS_PR & tnv_const.I_OTHER_IMPORT === tnv_const.I_OTHER_IMPORT
        // Разрешительные прочие экспорт
        case tnv_const.PRIZNAK_OTHER_LIC_EXP:
            return TBL.KLASS_PR & tnv_const.I_OTHER_EXPORT === tnv_const.I_OTHER_EXPORT
        // Временная специальная пошлина
        case 16:
            return TBL.IMPTMP_PR > 0;
        case 17:
            return TBL.IMPDOP_PR === 1;
        // Антидемпинговая пошлина
        case 19:
            return TBL.IMPDEMP_PR === 1;
        case 20:
            return TBL.IMPCOMP_PR === 1;
        case 28:
            return TBL.MARK_PR > 0;
        // Отслеживание
        case 33:
            return TBL.TRACE_PR > 0;
        case 34:
            return TBL.PENEXP_PR > 0;
        case 35:
            return TBL.PENIMP_PR > 0;
        // Прочие
        case 15:
            return TBL.OTHER_PR > 0;
        //Пошлины других стран
        case 30:
            // Дополнительная таблица с пошлинами непустая
            if (TBLCC !== undefined) {
                if (Array.isArray(TBLCC)) {
                    return TBLCC.length > 1;
                }
                return TBLCC.PRIM > 0;
            }
            return  false;
        default:
            return false;
    }
};


const calc_get5_cc = (TABLE, prz, acountry=tnv_const.CNTR_RUSSIA) => {
    switch (prz) {
        case tnv_const.PRIZNAK_IMPORTDUTY_OTHER:
            if (TABLE !== undefined) {
                if (Array.isArray(TABLE)) {
                    return TABLE.length === 0 ? 'Нет' : 'Есть'
                }
                if (Object.getOwnPropertyNames(TABLE).length > 0) {
                    return get5(tnv_const.PRIZNAK_IMPORTDUTY_OTHER,
                        TABLE.MIN,
                        TABLE.TYPEMIN,
                        TABLE.MAX,
                        TABLE.TYPEMAX,
                        TABLE.MIN2,
                        TABLE.TYPEMIN2,
                        '',
                        TABLE.SIGN,
                        TABLE.SIGN2,
                        'Нет',
                        TABLE.CC
                    );
                }
            }
        default:
            return 'Нет';
    }
};


const calctxt = (Tnved, TnvedCC, acountry=tnv_const.CNTR_RUSSIA) => {
    let b_is_ru = is_ru(acountry);
    const { PRIZNAK_OTHER_LIC_IMP, PRIZNAK_OTHER_LIC_EXP } = tnv_const;
    return {
        // экспортная пошлина
        0: b_is_ru ? calc_get5(Tnved, tnv_const.PRIZNAK_EXPORTDUTY) : '',
        // импорная пошлина
        1: calc_get5(Tnved, tnv_const.PRIZNAK_IMPORTDUTY, acountry),
        // акциз
        2: calc_get5(Tnved, tnv_const.PRIZNAK_EXCISEDUTY, acountry),
        // НДС
        3: calc_get5(Tnved, tnv_const.PRIZNAK_VAT, acountry),
        4: b_is_ru ?  calc_get5(Tnved, 4) : '',
        5: b_is_ru ?  calc_get5(Tnved, 5) : '',
        6: b_is_ru ?  calc_get5(Tnved, 6) : '',
        7: b_is_ru ?  calc_get5(Tnved, 7) : '',
        8: b_is_ru ?  calc_get5(Tnved, 8) : '',
        9: b_is_ru ?  calc_get5(Tnved, 9) : '',
        21: b_is_ru ?  calc_get5(Tnved, 21) : '',
        11: b_is_ru ?  calc_get5(Tnved, 11) : '',
        12: b_is_ru ?  calc_get5(Tnved, 12) : '',
        13: b_is_ru ?  calc_get5(Tnved, 13) : '',
        // Разрешительные прочие экспорт
        PRIZNAK_OTHER_LIC_IMP: b_is_ru ?  calc_get5(Tnved, tnv_const.PRIZNAK_OTHER_LIC_IMP) : '',
        // Разрешительные прочие экспорт
        PRIZNAK_OTHER_LIC_EXP: b_is_ru ?  calc_get5(Tnved, tnv_const.PRIZNAK_OTHER_LIC_EXP) : '',
        // Временная специальная пошлина
        16: b_is_ru ?  calc_get5(Tnved, tnv_const.PRIZNAK_IMPORTSPECDUTY) : '',
        17: b_is_ru ?  calc_get5(Tnved, 17) : '',
        // Антидемпинговая пошлина
        19: b_is_ru ?  calc_get5(Tnved, tnv_const.PRIZNAK_IMPORTANTIDUMP) : '',
        20: b_is_ru ?  calc_get5(Tnved, tnv_const.PRIZNAK_IMPORTCOMP) : '',
        28: b_is_ru ?  calc_get5(Tnved, 28) : '',
        30: b_is_ru ?  calc_get5_cc(TnvedCC, 30) : '',
        32: b_is_ru ?  calc_get5(Tnved, 32) : '',
        33: b_is_ru ?  calc_get5(Tnved, 33) : '',
        34: b_is_ru ?  calc_get5(Tnved, 34) : '',
        35: b_is_ru ?  calc_get5(Tnved, 35) : ''
    }
};

/*  Список признаков для определенного вида перевозок (экспорт, депозит, импорт) */
const get_type_priznak = (typ, expertmode=false) => {
    switch (parseInt(typ)) {
        case TYPE_EK:
            if (expertmode) {
                return [
                    tnv_const.PRIZNAK_EXPORTDUTY, // 0 - экспортная пошлина
                    tnv_const.PRIZNAK_EXPORTLIC, // 6 Лицензирование - импорт
                    tnv_const.PRIZNAK_EXPORTDOUBLE, // 21 двойное применение - экспорт
                    tnv_const.PRIZNAK_EXPORTQUOTA, // 8 квортирование - экспорт
                    // ToDo проверить правильность постановки признака. в импорте тоже самое
                    tnv_const.PRIZNAK_OTHER_LIC_EXP, // 27 прочие разрешительные документы
                    tnv_const.PRIZNAK_PENEXP, // 34
                ]
            } else {
                return [
                    tnv_const.PRIZNAK_EXPORTDUTY, // 0 - экспортная пошлина
                ]
            };
            break;
        case TYPE_DEPOSIT:
            return [
                tnv_const.PRIZNAK_DEPOSIT, // 4 - ставки депозита
            ];
            break;
        default:
            if (expertmode) {
                return [
                    tnv_const.PRIZNAK_IMPORTDUTY, // 1 Импортная пошлина
                    tnv_const.PRIZNAK_EXCISEDUTY, // 2 Акциз
                    tnv_const.PRIZNAK_VAT, // 3 НДС
                    tnv_const.PRIZNAK_IMPORTDUTY_OTHER, // 30 Импортная пошлина другие страны
                    tnv_const.PRIZNAK_IMPORTANTIDUMP, // 19 антидемпинговая пошлина
                    tnv_const.PRIZNAK_IMPORTCOMP, // 20 компенсационная пошлина
                    tnv_const.PRIZNAK_IMPORTSPECDUTY, // 16 Временная специальная пошлина
                    tnv_const.PRIZNAK_IMPORTADDDUTY, // 17 доп.имп. пошлина
                    tnv_const.PRIZNAK_IMPORTLIC, // 7 Лицензирование - импорт
                    tnv_const.PRIZNAK_MARK, // 28 маркировка
                    tnv_const.PRIZNAK_TRACE, // 33 прослеживаемость
                    tnv_const.PRIZNAK_IMPORTDOUBLE, // 13 двойное применение - импорт

                    tnv_const.PRIZNAK_PREF, // 5 Преференциальные для развивающихся стран
                    tnv_const.PRIZNAK_PREF_92, // 32 Преференциальные для наименее развитых стран
                    tnv_const.PRIZNAK_IMPORTQUOTA, // 9 квотирование на импорт

                    tnv_const.PRIZNAK_SAFETY, // 11 сертификация
                    tnv_const.PRIZNAK_OTHER_LIC_IMP, // 14 прочие разрешительные документы
                    tnv_const.PRIZNAK_PENIMP, // 35
                    tnv_const.PRIZNAK_OTHER, // 15 прочие особенности

                ]
            } else {
                return [
                    tnv_const.PRIZNAK_IMPORTDUTY, // 1 Импортная пошлина
                    tnv_const.PRIZNAK_IMPORTDUTY_OTHER, // 30 Пошлина для других стран
                    tnv_const.PRIZNAK_EXCISEDUTY, // 2 Акциз
                    tnv_const.PRIZNAK_VAT, // 3 НДС
                    tnv_const.PRIZNAK_IMPORTANTIDUMP, // 19 антидемпинговая пошлина
                    tnv_const.PRIZNAK_IMPORTCOMP, // 20 компенсационная пошлина
                    tnv_const.PRIZNAK_IMPORTSPECDUTY, // 16 Временная специальная пошлина
                    tnv_const.PRIZNAK_IMPORTADDDUTY, // 17 доп.имп. пошлина
                    tnv_const.PRIZNAK_PREF, // 5 Преференциальные для развивающихся стран
                    tnv_const.PRIZNAK_PREF_92 // 32 Преференциальные для наименее развитых стран
                ]
            }
    }
}

/* есть ли по типу примечания */
const has_pr = (tbl, typ, expertmode) => {
    let arr = get_type_priznak(typ, expertmode)
    for (var prz of arr) {
        if (is_pr(tbl, prz)) {
            return true
        }
    }
    return false
}

/* Список единиц измерения */
const get_edizm_list = (data, type=TYPE_IM, include=[], exclude=[]) => {

    let a;

    if (type == TYPE_EK) {
        a = [
            data.EXPEDI,
            data.EXPEDI2,
            data.EXPEDI3
        ]
    } else {
        a = [
            data.IMPEDI,
            data.IMPEDI2,
            data.IMPEDI3,
            data.AKCEDI,
            data.AKCEDI2,
            data.AKCEDI3,
            data.IMPTMPEDI,
            data.IMPTMPEDI2,
            data.IMPCOMPEDI,
            data.IMPCOMPEDI2,
            data.IMPDEMPEDI,
            data.IMPDEMPEDI2
        ]
    }

    return a.reduce((r, v) => {
        if (v && (v.length > 1)) {
            let edi = v.slice(0, 3);
            // Исключаем из списка единицы измерения, которые редактируются где-то еще
            if (exclude && exclude.includes(edi)) {
                return r
            }
            if (r.indexOf(edi) === -1) {
                r.push(edi);
            }
        }
        return r
    }, include);
};

const validate_code = (code) => {
    return !([undefined, null, ''].includes(code) || code.length < 10)
}

const validate_code_error = (code) => {
    if (!validate_code(code)) {
        return 'Введите код товара'
    }
    return ''
}

export  {
    calctxt,
    is_pr,
    has_pr,
    calc_get5,
    get5,
    calc_get5_cc,
    get_type_priznak,
    get_edizm_list,
    validate_code,
    validate_code_error
};
