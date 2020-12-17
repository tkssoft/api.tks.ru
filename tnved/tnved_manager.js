// Кэширование запросов к базе ставок

const { get_api_tks_ru } = require('../common/consts')
const { FetchError } = require('../common/utils')

class tnved_manager {
    constructor (props) {
        this.props = {...props};
        this.data = {}
    }

    getData = code => {
        return new Promise((resolve, reject) => {
            if (code in this.data) {
                return resolve(this.data[code])
            }
            this.fetchData(code).then(data => {
                this.data[code] = data;
                return resolve(data);
            }).catch(error => {
                reject(error)
            })
        })
    };

    fetchData = code => {
        const clientid = encodeURIComponent(calc_tks_ru_license.split('\n').join(''));
        return fetch(`${get_api_tks_ru()}/tnved.json/json/${clientid}/${code}.json`).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new FetchError(response)
            }
        })
    }
}

export {
    tnved_manager
}
