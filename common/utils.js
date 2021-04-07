
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

const isError = (error) => {
    return ![undefined, null].includes(error) && (error.length > 0)
}

export {
    isFunction,
    FetchError,
    isEmpty,
    isError,
    get_fetch_error_msg
}
