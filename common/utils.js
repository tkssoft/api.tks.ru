
const isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
};

class FetchError extends Error {
    constructor (response) {
        super(response.statusText)
        this.status = response.status
        this.url = response.url
    }
}

const get_fetch_error_msg = function (e, typeerrormsg, status404msg) {
    if (e) {
        if (e instanceof TypeError) {
            return typeerrormsg || `Ошибка подключения к API ТН ВЭД.`
        } else if (e instanceof FetchError) {
            if (e.status === 404) {
                return status404msg || "Код ТН ВЭД не найден."
            } else {
                return `${e.status} - ${e.message}`
            }
        } else {
            return e.message
        }
    }
    return 'Неизвестная ошибка'
}

const isEmpty = function(obj) {
    return Object.getOwnPropertyNames(obj).length === 0
}

const isEmptyAll = function(obj) {
    return [undefined, null].includes(obj) || isEmpty(obj)
}

const isError = (error) => {
    return ![undefined, null].includes(error) && (error.length > 0)
}

const filter_dict = (d, inclkeys) => {
    return inclkeys.reduce((arr, key) => {
        const value = d[key];
        if (value !== undefined) {
            arr[key] = d[key];
        }
        return arr;
    }, {});
    // return {
    //     ...Object.keys(d).filter(key => {
    //         return inclkeys.includes(key)
    //     }).reduce((obj, key) => {
    //         obj[key] = d[key];
    //         return obj
    //     }, {})
    // };
}

export {
    isFunction,
    FetchError,
    isEmpty,
    isError,
    isEmptyAll,
    get_fetch_error_msg,
    filter_dict
}
