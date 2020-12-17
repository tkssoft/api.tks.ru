
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

export {
    isFunction,
    FetchError
}
