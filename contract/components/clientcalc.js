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

function create_context_function_template(eval_string, context) {
    return `
    return function (context) {
        "use strict";
        const round2 = function (value) {
            return Math.round((value + 0.00001) * 100) / 100;
        }
        ${Object.keys(context).length > 0
            ? `let ${Object.keys(context).map((key) => ` ${key} = context['${key}']`)};`
            : ``
        }
        return ${eval_string};
    }
    `
}

function make_context_evaluator(eval_string, context) {
    try {
        let template = create_context_function_template(eval_string, context)
        let functor = Function(template)
        return functor()
    } catch (e) {
        return null;
    }
}

const eval_value = (value, vars, def=0, debug=false) => {
    let r = def;
    if (value) {
        try {
            let evaluator = make_context_evaluator(value, vars);
            if (evaluator) {
                try {
                    r = evaluator(vars);
                } catch (e) {
                    r = def;
                }
            } else {
                r = def;
            }
            if (debug) {
                console.log(r, value, vars);
            }
        } catch(error) {
            console.error('clientcalc.eval_value', error);
            r = def;
        }
    }
    return r;
}

const get_result_value = (result) => {
    const { items, value } = result;
    if (items && items.length > 0) {
        return items.reduce((sum, res) => {
            let v = get_result_value(res);
            if (v !== undefined) {
                return round2(sum + v);
            } else {
                return sum;
            }
        }, 0);
    }
    return value;
}

/* Обработка отдельных структур config_field */
const process_config_field = (field_config, variables, init) => {
    const { name, formula, ifthen, ifelse, items, variable, value, visible, edizm  } = field_config;
    let result = {};
    if (init) {
        result = {
            ...init
        };
    };
    if (name) {
        result.name = name;
    }
    if (visible !== undefined) {
        result.visible = visible;
    }
    if (value !== undefined) {
        result.value = value;
    }
    if (!isEmptyAll(ifthen)) {
        if (eval_value(ifthen.condition, variables)) {
            result = {
                ...result,
                ...process_config_field(ifthen, variables, result)
            };
        } else if (!isEmptyAll(ifthen.ifelse)) {
            result = {
                ...result,
                ...process_config_field(ifthen.ifelse, variables, result)
            };
        }
    }
    if (items && items.length > 0) {
        result.items = items.map((cfg) => {
            return process_config_field(cfg, variables);
        })
    }
    if (formula) {
        result.value = eval_value(formula, variables);
    }
    if (variable) {
        variables[variable] = get_result_value(result);
    }
    if (edizm) {
        result.edizm = eval_value(edizm, variables);
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
            if (result.name && [undefined, 1, true].includes(result.visible)) {
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
    get_result_array,
    eval_value
}