/*
* Функции для работы со ставками
*
* */

import { debug } from '../common/debug'
import { get5 } from "./tnved_Utils";
import {CNTR_SERBIA} from "../common/nsi";
const tnv_const = require('./tnv_const');
const nsi = require('../common/nsi');

/* Получаем кусок таблицы TNVED для выбранного признака
*  Если передана запись tnvedall, то заполняем информацию из нее,
*  иначе заполняем информацию из tnved (базовые ставки)
*
* */
const get_stavka = (prz, tnved, tnvedall) => {
    const base = tnvedall === undefined;
    let add = {base: base, PRIZNAK: prz}
    switch (prz) {
        // экспортная пошлина
        case tnv_const.PRIZNAK_EXPORTDUTY:
            return {
                ...add,
                EXP: base ? tnved.EXP : tnvedall.MIN,
                EXPEDI: base ? tnved.EXPEDI : tnvedall.TYPEMIN,
                EXP2: base ? tnved.EXP2 : tnvedall.MAX,
                EXPEDI2: base ? tnved.EXPEDI2 : tnvedall.TYPEMAX,
                EXP3: base ? tnved.EXP3 : tnvedall.MIN2,
                EXPEDI3: base ? tnved.EXPEDI3 : tnvedall.TYPEMIN2,
                EXPSIGN : base ? tnved.EXPSIGN : tnvedall.SIGN,
                EXPSIGN2 : base ? tnved.EXPSIGN2 : tnvedall.SIGN2
            };
        // импорная пошлина
        case tnv_const.PRIZNAK_IMPORTDUTY:
            return {
                ...add,
                IMP: base ? tnved.IMP : tnvedall.MIN,
                IMPEDI: base ? tnved.IMPEDI : tnvedall.TYPEMIN,
                IMP2: base ? tnved.IMP2 : tnvedall.MAX,
                IMPEDI2: base ? tnved.IMPEDI2 : tnvedall.TYPEMAX,
                IMP3: base ? tnved.IMP3 : tnvedall.MIN2,
                IMPEDI3: base ? tnved.IMPEDI3 : tnvedall.TYPEMIN2,
                IMPSIGN : base ? tnved.IMPSIGN : tnvedall.SIGN,
                IMPSIGN2 : base ? tnved.IMPSIGN2 : tnvedall.SIGN2
            };
        // акциз
        case tnv_const.PRIZNAK_EXCISEDUTY:
            return {
                ...add,
                AKC: base ? tnved.AKC : tnvedall.MIN,
                AKCEDI: base ? tnved.AKCEDI : tnvedall.TYPEMIN,
                AKC2: base ? tnved.AKC2 : tnvedall.MAX,
                AKCEDI2: base ? tnved.AKCEDI2 : tnvedall.TYPEMAX,
                AKC3: base ? tnved.AKC3 : tnvedall.MIN2,
                AKCEDI3: base ? tnved.AKCEDI3 : tnvedall.TYPEMIN2,
                AKCSIGN : base ? tnved.AKCSIGN : tnvedall.SIGN,
                AKCSIGN2 : base ? tnved.AKCSIGN2 : tnvedall.SIGN2
            };
        // НДС
        case tnv_const.PRIZNAK_VAT:
            return {
                ...add,
                NDS: base ? tnved.NDS : tnvedall.MIN,
                NDSEDI: base ? tnved.NDSEDI : tnvedall.PREF
            };
        case 4:
            return {
                ...add,
                DEPOSIT: base ? tnved.DEPOSIT : tnvedall.MIN,
                DEPOSITEDI: base ? tnved.DEPOSITEDI : tnvedall.TYPEMIN
            };
        case 5:
            return {
                ...add,
                NOPREF: base ? tnved.NOPREF : tnvedall.TYPEMIN
            };
        case 32:
            return {
                ...add,
                NOPREF92: base ? tnved.NOPREF92 : tnvedall.TYPEMIN
            };
        case 6:
            return {
                ...add,
                LICEXP: base ? tnved.LICEXP : tnvedall.TYPEMIN
            };
        case 7:
            return {
                ...add,
                LICIMP: base ? tnved.LICIMP : tnvedall.TYPEMIN
            };
        case 8:
            return {
                ...add,
                KVOTAEXP: base ? tnved.KVOTAEXP : tnvedall.TYPEMIN
            };
        case 9:
            return {
                ...add,
                KVOTAIMP: base ? tnved.KVOTAIMP : tnvedall.TYPEMIN
            };
        case 21:
            return {
                ...add,
                REG: base ? tnved.REG : tnvedall.TYPEMIN
            };
        case 11:
            return {
                ...add,
                SAFETY: base ? tnved.SAFETY : tnvedall.TYPEMIN
            };
        case 12:
            return {
                ...add,
                STRATEG: base ? tnved.STRATEG : tnvedall.TYPEMIN
            };
        case 13:
            return {
                ...add,
                DOUBLE: base ? tnved.DOUBLE : tnvedall.TYPEMIN
            };
        // Разрешительные прочие экспорт
        case tnv_const.PRIZNAK_OTHER_LIC_IMP:
            // ToDo: исправить parseInt(TBL.KLASS) & tnv_const.I_OTHER_IMPORT ? STRINGCONST_ONE : STRINGCONST_ZERO,
            return {
                ...add,
                KLASS: base ? tnved.KLASS : tnvedall.TYPEMIN
            };
        // Разрешительные прочие экспорт
        case tnv_const.PRIZNAK_OTHER_LIC_EXP:
            // ToDo: исправить parseInt(TBL.KLASS) & tnv_const.I_OTHER_EXPORT ? STRINGCONST_ONE : STRINGCONST_ZERO,
            return {
                ...add,
                KLASS: base ? tnved.KLASS : tnvedall.TYPEMIN
            };
        // Временная специальная пошлина
        case 16:
            return {
                ...add,
                IMPTMP: base ? tnved.IMPTMP : tnvedall.MIN,
                IMPTMPEDI: base ? tnved.IMPTMPEDI : tnvedall.TYPEMIN,
                IMPTMP2: base ? tnved.IMPTMP2 : tnvedall.MAX,
                IMPTMPEDI2: base ? tnved.IMPTMPEDI2 : tnvedall.TYPEMAX,
                IMPTMPSIGN : base ? tnved.IMPTMPSIGN : tnvedall.SIGN,
            };
        case 17:
            return {
                ...add,
                IMPDOP: base ? tnved.IMPDOP : tnvedall.MIN
            };
        // Антидемпинговая пошлина
        case 19:
            return {
                ...add,
                IMPDEMP: base ? tnved.IMPDEMP : tnvedall.MIN,
                IMPDEMPEDI: base ? tnved.IMPDEMPEDI : tnvedall.TYPEMIN,
                IMPDEMP2: base ? tnved.IMPDEMP2 : tnvedall.MAX,
                IMPDEMPEDI2: base ? tnved.IMPDEMPEDI2 : tnvedall.TYPEMAX,
                IMPDEMPSIGN : base ? tnved.IMPDEMPSIGN : tnvedall.SIGN,
            };
        case 20:
            return {
                ...add,
                IMPCOMP: base ? tnved.IMPCOMP : tnvedall.MIN,
                IMPCOMPEDI: base ? tnved.IMPCOMPEDI : tnvedall.TYPEMIN,
                IMPCOMP2: base ? tnved.IMPCOMP2 : tnvedall.MAX,
                IMPCOMPEDI2: base ? tnved.IMPCOMPEDI2 : tnvedall.TYPEMAX,
                IMPCOMPSIGN : base ? tnved.IMPCOMPSIGN : tnvedall.SIGN,
            };
        case 28:
            return {
                ...add,
                MARK: base ? tnved.MARK : tnvedall.MIN
            };
        default:
            return {...add};
    }
};


const get_tnvedcc_rec = (g34, tnvedcc) => {
    if ([tnv_const.CNTR_RUSSIA, '000', '', undefined, null].includes(g34)) {
        // Случай, когда требуется показать просто список всех ставок
        return tnvedcc
    }
    if (![undefined, null].includes(tnvedcc)) {
        if (Object.getOwnPropertyNames(tnvedcc).length > 0) {
            for (let cc of tnvedcc) {
                if (cc.CC === g34) {
                    return cc;
                }
            }
        }
    }
    return {}
};


const isinstuff = (stuff, index, values, vsize) => {
    if ([undefined, null].includes(stuff)) {
        return false;
    }
    let avalue = '';
    let i = 0;
    let len = 0;
    let r = false;
    avalue = stuff.substr((index - 1)*vsize, vsize).trim();
    len = avalue.length;
    if ((len = vsize) && (avalue[len - 1] === '1')) {
        // ToDo: не понятно, что имеется ввиду. почему нет анализа передней части
        return false;
    }
    return values.includes(avalue);
};


const get_koeff_ex = (g34, tnved) => {
    if ([undefined, null].includes(tnved)) {
        return false;
    }
    let d = tnved.TNVEDALL[18];
    if (d !== undefined) {
        for (let rec of d) {
            if (rec.TYPEMIN === g34) {
                return true
            }
        }
    }
    return false
};


const updatestavka = (typ, data, tnvedcc, tnved) => {
    let r = {};
    let s = nsi.lookupoksmtname(data.G34, 'KOD_AR');
    switch (typ) {
        case 1:
            // Пошлина
            r.PREF2 = nsi.is_CIS(s) && !isinstuff(data.STUFF, 1, ['T', '11'], 4);
            break;
        case 0:
        case 2:
            // Пошлина
            let koeff = get_koeff_ex(data.G34, tnved);
            if (data.SERT && !koeff) {
                r.PREF2 = nsi.is_CIS(s);
                if (typ === 0 && !r.PREF2) {
                       r.PREF2 = data.G34 === nsi.CNTR_SERBIA
                }
            }
            // НДС
            if (data.NDSEDI !== null && data.NDSEDI !== undefined) {
                r.PREF4 = nsi.kodpref()[4][data.NDSEDI].SIGN === 1
            } else {
                r.PREF4 = false
            }
    }
    return r
};

// Список примечаний по ставкам (первая запись - базовая)
const get_prim_values = (prz, TNVED, TNVEDALL, TNVEDCC) => {
    if (TNVEDALL[prz] === undefined) {
        return []
    }
    let base = calc_get5(TNVED, prz);
    return TNVEDALL[prz].reduce(
        (a, v) => {
            let stavka = get5(
                v.PRIZNAK,
                v.MIN,
                v.TYPEMIN,
                v.MAX,
                v.TYPEMAX,
                v.MIN2,
                v.TYPEMIN2,
                v.PREF,
                v.SIGN,
                v.SIGN2,
                ''
            )
            a.push({
                label: stavka,
                key: stavka,
                note: v.NOTE && v.NOTE.replace('\n', '<br />'),
                value: {...v, base: false},
            });
            return a
        }, [{
            label: base + ' - (БАЗОВАЯ)',
            key: base,
            value: {...TNVED, PRIZNAK: prz, base: true},
        }]
    )
};

export  {
    get_stavka,
    get_tnvedcc_rec,
    updatestavka,
    get_prim_values,
}