/*  Расчет на стороне клиента по конфигам, полученным в виде файла из ЛК */

/*
    Структура конфига - массив
    [
        config_field1,
        config_field2,
        config_field3
    ]
*/

const process_config_field = (field_config, variables, r) => {
    const { items } = field_config;
    if (items && items.length > 0) {
        items.map((cfg) => {

        })
        r.push(process_config_field())
    }
}

const process_config = (config, variables) => {
    if (config && config.length > 0) {
        return config.map((cfg) => {
            return
        })
    }
    return []
}