
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

const isEmpty = function(obj) {
    return Object.getOwnPropertyNames(obj).length === 0
}

const isEmptyAll = function(obj) {
    return [undefined, null].includes(obj) || isEmpty(obj)
}

const isError = (error) => {
    return ![undefined, null].includes(error) && (error.length > 0)
}

export {
    isFunction,
    FetchError,
    isEmpty,
    isError,
    isEmptyAll
}
