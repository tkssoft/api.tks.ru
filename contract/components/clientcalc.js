/*  Расчет на стороне клиента по конфигам, полученным в виде файла из ЛК */

/*
    Структура конфига - массив
    [
        config_field1,
        config_field2,
        config_field3
    ]

    config_field = {
        name: '',
        formula: '',
        variable: '',
        orderby: 0,
        ifthen: {
            condition,
            ifelse: {
                ...config_field
            },
            ...config_field,
        },
        items: [
            config_field1,
            config_field2,
            config_field3
        ]
    }

    config_field = {
        ...config_field,
    }

    Структура результатов
    [
        result_field1,
        result_field2,
        result_field3
    ]

    result_field = {
        name: '',
        value: '',
        orderby: 0,
        items: [
            result_field1,
            result_field2,
            result_field3
        ]
    }


*/

import { isEmptyAll } from '../../common/utils';


const round2 = (value) => {
    return Math.round((value + 0.00001) * 100) / 100;
}

const eval_value = (value, vars) => {
    Object.keys(vars).map((key) => {
        window[key] = vars[key];
    });
    if (value) {
        return eval(value);
    }
    return 0;
}

const get_result_value = (result) => {
    const { items, value } = result;
    if (items && items.length > 0) {
        return items.reduce((sum, res) => {
            return round2(sum + get_result_value(res));
        }, 0)
    }
    return value;
}

/* Обработка отдельных структур config_field */
const process_config_field = (field_config, variables, init) => {
    const { name, formula, ifthen, ifelse, items, variable  } = field_config;
    let result = {};
    if (init) {
        result = {
            ...init
        };
    } else if (name) {
        result.name = name;
    }
    if (!isEmptyAll(ifthen)) {
        if (eval_value(ifthen.condition)) {
            return process_config_field(ifthen, variables, result);
        } else if (!isEmptyAll(ifthen.ifelse)) {
            return process_config_field(ifthen.ifelse, variables, result);
        }
    }
    if (items && items.length > 0) {
        result.items = items.map((cfg) => {
            return process_config_field(cfg, variables)
        })
    }
    if (formula) {
        result.value = eval_value(formula, variables);
    }
    if (variable) {
        variables[variable] = get_result_value(result);
    }
    return result;
}

/*
    Обрабатывает массив config_field
    config - массив config_field
    variables - значения переменных

    возвращает массив result_field

*/
const process_config = (config, variables) => {
    const vars = {
        ...variables
    };
    if (config && config.length > 0) {
        return config.reduce((arr, cfg) => {
            let r = process_config_field(cfg, vars);
            if (r && r.name) {
                arr.push(r);
            }
            return arr;
        }, []);
    }
    return [];
}

/* сортировка результатов по полю orderby */
const sort_results = (results) => {
    const r = [...results];
    r.sort((a, b) => {
        if (a.orderby < b.orderby) {
            return -1;
        }
        if (a.orderby > b.orderby) {
            return 1;
        }
        return 0;
    })
    return r;
}

const get_result_array = (results, indent=0) => {
    if (results) {
        let r = results.reduce((r, result) => {
            if (result.name) {
                r.push({
                    ...result,
                    indent
                });
            }
            if (result.items && result.items.length > 0) {
                r = r.concat(get_result_array(result.items, indent+1));
            }
            return r;
        }, []);
        return r;
    }
    return [];
}

export {
    process_config,
    get_result_value,
    sort_results,
    get_result_array
}