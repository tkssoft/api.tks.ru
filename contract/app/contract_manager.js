// менеджер расчета контракта

import { debug } from "../../common/debug"
import { isEmpty } from "../../common/utils"
import { stateobject } from "../../common/stateobject"
import { FetchError, isError } from '../../common/utils'
import { tnved_manager } from "../../tnved/tnved_manager"
import { validate_code_error } from "../../tnved/tnved_utils"

import { get_stavka, get_tnvedcc_rec, updatestavka, get_prim_values } from "../../tnved/stavka"
import { calc_get5, has_pr, is_pr, get_edizm_list } from "../../tnved/tnved_utils"
import {
    LETTER_B,
    LETTER_C,
    LETTER_D,
    PRIZNAK_IMPORTDUTY,
    PRIZNAK_VAT,
    PRIZNAK_EXCISEDUTY } from '../../tnved/tnv_const'
import { Console } from "console"

const nsi = require( '../../common/nsi' )
const edizm = nsi.edizm()

const DELAY_TNVED = 'TNVED'
const DELAY_CALC = 'CALC'

const get_edizm_displayLabel = (edi, index) => {
    switch (edi) {
        case "166":
        case "168": return "Вес";
        case "113": return "Объем";
        case nsi.POWER_CODES[0]:
        case nsi.POWER_CODES[1]: return "Мощность";
        default:
            return `Количество ${index}`
    }
};

/* Товарная часть контракта */
class kontdop extends stateobject {

    constructor (props) {
        super(props);
        const { tn, data, addedizm } = props;
        // tnved_manager
        this.tn = tn;
        this.update_count = 0;
        /* дополнительные количества, единицы измерения и их поля */
        this.addedizm = {
            ...addedizm
        }
        this.state = {
            debug: false,
            data: {
                ...data,
                ...this.get_additional_values(data)
            },
            errors: {
                G33: validate_code_error(data.G33),
                G45: this.validateNotEmptyNumber(data.G45),
                ...this.validateEdizmAll(data)
            }
        };
    }

    register_delay (deman) {
        super.register_delay(deman)
        deman.add({
            name: DELAY_TNVED,
            action: this.loadTnvedData.bind(this),
            params: this.loadTnvedDataParams.bind(this),
            delay: 1000
        })
    }

    doStateUpdated(prevState, delta) {
        super.doStateUpdated(prevState, delta)
        let updated = this.updatestavka()
        if (!isEmpty(updated)) {
            this.state.data = {
                ...this.state.data,
                ...updated
            }
        }
        // ToDo: переделать
        // Передача в kontrakt части по ставкам из TNVEDCC в зависимости от страны G34
        // let cc = {};
        // if (this.state.tnved) {
        //     cc = get_tnvedcc_rec(this.state.data.G34, this.state.tnved.TNVEDCC);
        // }
    }

    setStavka = (value) => {
        let v;
        if (value.value !== undefined) {
            v = value.value
        } else {
            v = value
        }
        if (v !== undefined) {
            this.doStavkaSelect(v.PRIZNAK, v.base, v, v)
        }
    }

    setAttr = (attr, value) => {
        switch (attr) {
            case 'G33':
                this.setG33(value);
                break;
            case 'G45':
                this.doG45Change(value);
                break;
            case 'G38':
                this.doEdizmChange(value, this.state.data.G38C)
                break
            case 'GEDI1':
                this.doEdizmChange(value, this.state.data.GEDI1C)
                break
            case 'GEDI2':
                this.doEdizmChange(value, this.state.data.GEDI2C)
                break
            case 'GEDI3':
                this.doEdizmChange(value, this.state.data.GEDI3C)
                break
            case 'STAVKA_1':
            case 'STAVKA_2':
            case 'STAVKA_3':
                this.setStavka(value);
                break;
            default:
                this.setFieldData(attr, value, '')
        }
    };

    get_edizm_list = (data) => {
        const d = data ? data : this.state.data
        const addedizm = Object.keys(this.addedizm)
        return get_edizm_list(d, this.props.typ, addedizm);
    }

    is_field_editable = (fieldname) => {
        const edizm_list = this.get_edizm_list()
        let r = false
        for (let edi of edizm_list) {
            let fldname = this.get_edizm_fieldname(edi)
            if (fldname === fieldname) {
                return true
            }
        }
        return false
    }

    validateEdizmAll = (data, tnved) => {
        let r = {
            G38 : '',
            GEDI1 : '',
            GEDI2 : '',
            GEDI3 : ''
        };
        const edizm_list = this.get_edizm_list(data)
        for (let edi of edizm_list) {
            let fieldname = this.get_edizm_fieldname(edi)
            r[fieldname] = this.validateNotEmptyNumber(data[fieldname])
        }
        return r
    };

    get_additional_values = (data, tnved) => {
        return {
            ...this.get_edizm_values(data, tnved),
            ...this.get_stavka_values(data, tnved)
        }
    };

    get_edizm_values = (data, tnved) => {
        let r = {
            G38C : '',
            GEDI1C : '',
            GEDI2C : '',
            GEDI3C : '',
            G38CN : '',
            GEDI1CN : '',
            GEDI2CN : '',
            GEDI3CN : ''
        };
        let edizm_list = this.get_edizm_list(data);
        for (let edi of edizm_list) {
            let fieldname = this.get_edizm_fieldname(edi)
            r[fieldname + 'C'] = edi
            r[fieldname + 'CN'] = this.get_edizm_name(edi)
        }
        return r
    };

    get_stavka_value = (fieldname) => {
        switch (fieldname) {
            case 'STAVKA_1':
                return calc_get5(this.state.data, PRIZNAK_IMPORTDUTY)
            case 'STAVKA_2':
                return calc_get5(this.state.data, PRIZNAK_EXCISEDUTY)
            case 'STAVKA_3':
                return calc_get5(this.state.data, PRIZNAK_VAT)
            default:
                return 'Неизвестная ставка'
        }
    }

    get_stavka_values = (data, tnved) => {
        return {
            'STAVKA_1': calc_get5(data, PRIZNAK_IMPORTDUTY),
            'STAVKA_2': calc_get5(data, PRIZNAK_EXCISEDUTY),
            'STAVKA_3': calc_get5(data, PRIZNAK_VAT)
        }
    };

    get_prim_values = (prz) => {
        if (this.state.tnved === undefined) {
            return []
        }
        let {TNVED, TNVEDALL, TNVEDCC} = this.state.tnved;
        return get_prim_values(prz, TNVED, TNVEDALL, TNVEDCC)
    };

    validateG45V = (value) => {
        return Object.keys(nsi.valname()).includes(value)
    };

    updatestavka = () => {
        return {
            ...updatestavka(this.props.typ, this.state.data),
            ...this.calcfields()
        }

    };

    calcfields () {
        if (this.props.onCalcFields) {
            return this.props.onCalcFields(this)
        }
        return {}
    }

    get_tnved_error_message(e) {
        if (e) {
            if (e instanceof TypeError) {
                return `Ошибка подключения к API ТН ВЭД.`
            } else if (e instanceof FetchError) {
                if (e.status === 404) {
                    return "Код ТН ВЭД не найден."
                } else {
                    return `${e.status} - ${e.message}`
                }
            } else {
                return e.message
            }
        }
        return 'Неизвестная ошибка'
    }

    loadTnvedDataParams() {
        return {
            code: this.state.data.G33,
        }
    }

    loadTnvedData(procinfo, params) {
        const { code } = params
        let tn = this.tn || new tnved_manager();
        let that = this
        if (code && (code.length === 10)) {
            return tn.getData(code)
                .then(data => {
                    this.updateStateWithTnved(data)
                })
                .catch(error => {
                    const error_msg = that.get_tnved_error_message(error)
                    this.setState({
                        modified: true,
                        errors: {
                            ...this.state.errors,
                            G33: error_msg
                        }
                    })
                })
        } else {
            return new Promise((resolve, reject) => {
                this.setState({
                    modified: true,
                    errors: {
                        ...this.state.errors,
                        G33: 'Введите код товара'
                    }
                }, () => {
                    resolve()
                })
            })
        }
    }

    updateStateWithTnved(data) {
        const not_allowed = ['CODE', 'EDI2', 'EDI3', 'IMPFEES', 'EXPFEES', 'AKCCODE', 'EXPCODE', 'STUFF1'];
        var state = {
            tnved: {...data}
        };
        /*Переписываем поля из таблицы TNVED в нашу data, за исключением некоторых, которых нет в kontdop*/
        state.data = {
            ...Object.keys(data.TNVED).filter(key => {
                return !not_allowed.includes(key)
            },
            ).reduce((obj, key) => {
                obj[key] = data.TNVED[key];
                return obj
            }, {...this.state.data}),
            G312: data.KR_NAIM
        };
        this.setState(state, () => {
            this.setState(
                {
                    data: {
                        ...this.state.data,
                        ...this.get_additional_values(this.state.data, this.state.tnved)
                    },
                    errors: {
                        ...this.state.errors,
                        ...this.validateEdizmAll(this.state.data, this.state.tnved),
                        G33: null
                    },
                    modified: true
                }
            )
        })
    }

    setFieldData = (fieldname, fieldvalue, error, delayname, cb) => {
        this.setDelayedState({
            data: {
                ...this.state.data,
                [fieldname]: fieldvalue
            },
            modified: ['', undefined].includes(error || delayname),
            errors: {
                ...this.state.errors,
                [fieldname]: error || delayname
            }
        }, delayname, cb)
    }

    setG33 = (code) => {
        this.setFieldData('G33', code, validate_code_error(code), DELAY_TNVED)
    }

    parseFloat(value, def='') {
        let r = parseFloat(value)
        if (isNaN(r)) {
            return def
        }
        return r
    }

    doG45Change = (value) => {
        // Проверка ввода таможенной стоимости
        const error = this.validateNotEmptyNumber(value);
        return this.setFieldData('G45', this.parseFloat(value), error)
    };

    validateNotEmptyNumber = (number) => {
        try {
            if ([undefined, null, '', NaN].includes(number) || (parseFloat(number).toString() !== number.toString())) {
                return 'Введите значение'
            }
        } catch (e) {
            return 'Введите значение'
        }
        return ''
    };

    getEdiValue = (edi) => {
        let edi2 = this.state.tnved !== undefined ? this.state.tnved.TNVED.EDI2 : 'XXX'
        switch(edi) {
            case "166":
                return this.state.data.G38;
            case "168":
                return this.state.data.G38 / 1000;
            case edi2:
                return this.state.data.GEDI1;
            case nsi.POWER_CODES[0]:
            case nsi.POWER_CODES[1]:
                return this.state.data.GEDI3;
            default:
                return this.state.data.GEDI2;
        }
    };

    getEdiError = (edi) => {
        const fieldname = this.get_edizm_fieldname(edi)
        return this.state.errors[fieldname]
    };

    get_edizm_displayLabel = (edi, index) => {
        if (edi in this.addedizm) {
            return this.addedizm[edi].displayLabel
        }
        return get_edizm_displayLabel(edi, index)
    }

    /* Наименование единицы измерения */
    get_edizm_name = (edi) => {
        if (edi in this.addedizm) {
            return this.addedizm[edi].name
        }
        return edi in edizm ? edizm[edi].KRNAIM : ''
    }

    /* Имя поля, в котором хранится значение */
    get_edizm_fieldname = (edi) => {
        if (edi in this.addedizm) {
            return this.addedizm[edi].fieldname
        }
        let edi2 = this.state.tnved !== undefined
            ? this.state.tnved.TNVED.EDI2
            : 'XXX'
        switch(edi) {
            case "166":
            case "168":
                return 'G38'
            case edi2:
                return 'GEDI1'
            case nsi.POWER_CODES[0]:
            case nsi.POWER_CODES[1]:
                return 'GEDI3';
            default:
                return 'GEDI2';
        }
    }

    doEdizmChange = (value, edi) => {
        const error = this.validateNotEmptyNumber(value)
        const fieldname = this.get_edizm_fieldname(edi)
        return this.setFieldData(fieldname, this.parseFloat(value), error)
    }

    doG33Select = (code, text) => {
        this.setG33(code);
    };

    doStavkaSelect = (prz, base, tnvedall, stavka) => {
        if (stavka === undefined) {
            stavka = get_stavka(prz, this.state.tnved.TNVED, base ? undefined : tnvedall);
        }
        const data = {
            ...this.state.data,
            ...stavka
        }
        this.setState({
            data: {
                ...data,
                ...this.get_additional_values(data, this.state.tnved)
            },
            errors: {
                ...this.state.errors,
                ...this.validateEdizmAll(data, this.state.tnved)
            },
            modified: true
        })
    }

    get_field_value_def(fieldname, def) {
        return ['', undefined, null].includes(this.state.data[fieldname])? def: this.state.data[fieldname]
    }

}


const default_kontrakt = () => {
    var d = new Date();
    return {
        G221: "840",
        G34: '000',
        G542: d.toISOString().slice(0, 10),
        NUM: 1,
        TYPE: 0,
        MAX_PLAT: 0
    }
};


const default_kontdop = () => {
    return {
        G32: 1,
        NUM: 1,
        // Вьетнам
        //"G34": '704',
        // страна неизвестна
        G34: '000',
        // аналог галочки - есть сертификат происхождения
        SERT: true,
        // валюта по умолчанию
        G45V: '643'
    }
};

/* Центральная часть расчетов */
class contract_manager extends stateobject {

    constructor (props) {
        super(props)
        // tnved_manager
        this.tn = new tnved_manager();
        const { NUM } = props;
        /* Номер контракта (уникальный идентификатор) */
        this.num = NUM;
        this.kontrakt = {
            ...default_kontrakt(),
            ...this.get_default_values('kontrakt'),
            NUM: this.num
        }
        this.kontdop = [
            this.append(1)
        ]
        // ToDo - сделать. Непонятно как редактировать такие ставки
        this.kontdopcc = []
    }

    register_delay(deman) {
        super.register_delay(deman)
        deman.add({
            name: DELAY_CALC,
            action: this.loadCalcResults.bind(this),
            delay: 1000,
        })
    }

    get_default_values (tblname) {
        if (this.props.onGetDefaultValues) {
            return this.props.onGetDefaultValues(tblname)
        }
        return {}
    }

    get_init_state() {
        var r = super.get_init_state()
        return {
            ...r,
            result: {
                kont47: null,
                log: null,
                valuta: null,
                totals: null
            },
            errors: {
                calc: null
            },
            sums: {
                total: 0,
                g32: {},
                letter: {}
            }
        }
    }

    /**Добавление товара */
    append = (G32) => {
        var data = default_kontdop()
        return new kontdop({
                tn: this.tn,
                onChange: this.kondopchange,
                onCalcFields: this.props.onCalcFields,
                data: {
                    ...data,
                    G32: G32,
                    NUM: this.num
                },
                addedizm: this.props.addedizm ? {...this.props.addedizm} : {}
            })
    }

    all_errors = () => {
        return this.kontdop.reduce((errors, k) => {
            for (let fieldname of Object.keys(k.state.errors)) {
                let error = k.state.errors[fieldname]
                if (isError(error)) {
                    errors[fieldname] = error
                    break
                }
            }
            return errors
        }, {
            calc: this.state.errors.calc
        })
    }

    kondopchange = (kondop) => {
        const errors = this.all_errors()
        // Должно вызвать onchange
        this.setDelayedState({
            errors: {
                ...errors
            },
            modified: true
        }, DELAY_CALC);
    }

    setFieldData = (fieldname, newvalue, g32) => {
        if (g32 === undefined) {
            return this.setKontraktData({[fieldname]: newvalue})
        }
        const index = g32 - 1
        while (index >= this.kontdop.length) {
            this.kontdop.push(this.append(this.kontdop.length + 1))
        }
        var kontdop = this.kontdop[index];
        return kontdop.setAttr(fieldname, newvalue)
    }

    getFieldData = (fieldname, g32) => {
        if (g32 === undefined) {
            return this.getKontraktData(fieldname)
        }
        const index = g32 - 1
        let dop = this.getSourceData(index)
        if (dop) {
            return dop.state.data[fieldname]
        }
        return undefined
    }

    setKontraktData = (data) => {
        this.kontrakt = {
            ...this.kontrakt,
            ...data
        }
        this.setDelayedState({
            modified: true
        }, DELAY_CALC)
    }

    getKontraktData = (fieldname) => {
        return this.kontrakt[fieldname]
    }

    getFieldValue(value, def='') {
        return value === undefined? def : value
    }

    getSourceData = (index) => {
        if ((index >= 0) && (index < this.kontdop.length)) {
            return this.kontdop[index]
        }
        return undefined
    }

    getLetter = (index, letter) => {
        if (this.state.sums.g47) {
            let ind = this.state.sums.g47[index]
            return ind ? ind[letter]: undefined
        }
    }

    getData = () => {
        var index = 0
        let that = this
        return this.kontdop.map((kontdop) => {
            index = index + 1
            let has_prim = false
            let poshl_pr = false
            let akciz_pr = false
            let nds_pr = false
            if (kontdop.state.tnved) {
                has_prim = has_pr(kontdop.state.tnved.TNVED, that.kontrakt.TYPE)
                poshl_pr = is_pr(kontdop.state.tnved.TNVED, PRIZNAK_IMPORTDUTY)
                akciz_pr = is_pr(kontdop.state.tnved.TNVED, PRIZNAK_EXCISEDUTY)
                nds_pr = is_pr(kontdop.state.tnved.TNVED, PRIZNAK_VAT)
            }
            return {
                G33: this.getFieldValue(kontdop.state.data.G33),
                G312: this.getFieldValue(kontdop.state.data.G312),
                G45: this.getFieldValue(kontdop.state.data.G45),
                // Вес
                // ToDo: возможно оптимизировать вызов is_field_editable
                G38: this.getFieldValue(kontdop.state.data.G38),
                G38C: this.getFieldValue(kontdop.state.data.G38C),
                G38CN: this.getFieldValue(kontdop.state.data.G38CN),
                G38EDIT: kontdop.is_field_editable('G38'),
                // Количество
                GEDI1: this.getFieldValue(kontdop.state.data.GEDI1),
                GEDI1C: this.getFieldValue(kontdop.state.data.GEDI1C),
                GEDI1CN: this.getFieldValue(kontdop.state.data.GEDI1CN),
                GEDI1EDIT: kontdop.is_field_editable('GEDI1'),
                // Физ. объем
                GEDI2: this.getFieldValue(kontdop.state.data.GEDI2),
                GEDI2C: this.getFieldValue(kontdop.state.data.GEDI2C),
                GEDI2CN: this.getFieldValue(kontdop.state.data.GEDI2CN),
                GEDI2EDIT: kontdop.is_field_editable('GEDI2'),
                // Мощность
                GEDI3: this.getFieldValue(kontdop.state.data.GEDI3),
                GEDI3C: this.getFieldValue(kontdop.state.data.GEDI3C),
                GEDI3CN: this.getFieldValue(kontdop.state.data.GEDI3CN),
                GEDI3EDIT: kontdop.is_field_editable('GEDI3'),
                // Итого
                TOTAL: this.round(this.state.sums.g32[index]) || 0,
                // Ошибки
                ERRORS: {...kontdop.state.errors},
                // Суммы по 47 графе
                POSHL: this.round(this.getLetter(index, LETTER_B)) || 0,
                AKCIZ: this.round(this.getLetter(index, LETTER_C)) || 0,
                NDS: this.round(this.getLetter(index, LETTER_D)) || 0,
                // Признак того, что есть примечания
                HAS_PR: has_prim,
                POSHL_PR: poshl_pr,
                AKCIZ_PR: akciz_pr,
                NDS_PR: nds_pr
            }
        })
    }

    round(value) {
        return Math.round((value + 0.00001) * 100) / 100
    }

    calcsums = (data) => {
        var g32sum = {}
        var lettersum = {}
        var g47sum = {}
        var total = 0
        if (data.kont47) {
            data.kont47.map((rec) => {
                let g474 = this.round(rec.G474V)
                total += g474
                lettersum[rec.LETTER] = (lettersum[rec.LETTER] || 0) + g474
                g32sum[rec.G32] = (g32sum[rec.G32] || 0) + g474
                var d = g47sum[rec.G32] === undefined ? {} : g47sum[rec.G32]
                g47sum[rec.G32] = {...d, [rec.LETTER]: g474}
            })
        }
        var r = {
            total: this.round(total),
            g32: g32sum,
            letter: lettersum,
            g47: g47sum
        }
        return r
    }

    // Данные расчета получены с сервера - сниманием флажок calcpending
    updateStateWithResults(data, calcdata) {
        this.setState({
            result: data,
            sums: this.calcsums(data),
            pending: false
        }, () => {
            if (this.props.onResultsChange !== undefined) {
                this.props.onResultsChange({
                    result: {
                        ...this.state.result
                    },
                    sums: {
                        ...this.state.sums
                    },
                    calcdata: {
                        ...calcdata
                    },
                })
            }
        })
    }

    get_calc_url() {
        return `${this.get_api_calc_tks_ru()}${this.get_calc_method()}/${encodeURIComponent(calc_tks_ru_license.split('\n').join(''))}`
    }

    get_api_calc_tks_ru() {
        return window.api_calc_tks_ru === undefined ? 'https://calc.tks.ru' : window.api_calc_tks_ru
    }

    get_calc_method() {
        return this.props.calc_method || '/calc'
    }

    get_calc_error_msg(error) {
        if (error instanceof FetchError) {
            switch (error.status) {
                case 500:
                    return "Внутренняя ошибка сервера. Обратитесь к разработчику."
                default:
                    return `Ошибка ${error.status}. ${error.message}`
            }
        }
        return error.toString()
    }

    any_errors() {
        for (var fieldname of Object.keys(this.state.errors)) {
            if (fieldname !== 'calc') {
                const error = this.state.errors[fieldname]
                if (isError(error)) {
                    return error
                }
            }
        }
        return ''
    }

    loadCalcResults(procinfo) {
        const error = this.any_errors()
        if (error) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    calc: null
                }
            })
            return false
        }
        const calcdata = this.getCalcData();
        const url = this.get_calc_url()
        fetch(url, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(calcdata)
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new FetchError(response)
            }
        }).then(data => {
            this.updateStateWithResults(data, calcdata);
        }).catch(error => {
            this.setState({
                errors: {
                    ...this.state.errors,
                    calc: `Ошибка расчета. ${this.get_calc_error_msg(error)}`
                }
            })
        })
        return true
    }

    getCalcData = () => {
        var r = {
            kontrakt: this.filterCalcData(this.kontrakt),
            kontdop: this.kontdop.map((kontdop) => this.filterCalcData(kontdop.state.data)),
            kontdopcc: this.kontdopcc.map((kontdopcc) => this.filterCalcData(kontdopcc)),
        }
        return r
    };

    filterCalcData = (data, exfields) => {
        return Object.keys(data).reduce((obj, key) => {
            if (exfields === undefined || !exfields.includes(key) ) {
                if (data[key] !== null && obj[key] === undefined) {
                    obj[key] = data[key]
                }
            }
            return obj
        }, {
            NUM: this.num,
            G34: this.kontrakt.G34,
            G45V: this.kontrakt.G221
        })
    }

    /* Чтение настроек показа полей */
    get_field_config (props) {
        if (this.props.onGetFieldConfig) {
            return this.props.onGetFieldConfig(props)
        }
        return {}
    }

}

export {
    contract_manager
}
