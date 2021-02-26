// Приложение для расчета контракта (верхняя часть, таблица и нижняя часть)

const React  = require('react');


const { contract_manager } = require('./contract_manager')
const { isFunction } = require('../../common/utils')
// const { Dummy } = require('../common/debug')

class BaseContractApp extends React.Component {

    constructor (props) {
        super(props)

        this.contract_manager = new contract_manager(
            this.get_manager_params()
        )

        this.state = {
            sums: {
                total: 0,
                g32: {},
                letter: {}
            },
            errors : {
                ...this.contract_manager.state.errors
            },
            result : {

            },
            calcdata : {

            }
        }

    }

    get_manager_params () {
        return {
            NUM: this.props.NUM || this.props.num || 1,
            onChange: this.contractmanagerchanged.bind(this),
            onResultsChange: this.calcresultschange.bind(this),
            onGetDefaultValues: this.get_default_values.bind(this),
            /*  Дополнительные обязательные единицы измерения
                ToDo: сделать по настройке из отдельного файла
            */
            addedizm: this.props.addedizm ? {...this.props.addedizm} : {}
        }
    }

    get_table_config (tblname) {
        const { fieldconfig } = this.props
        if (fieldconfig) {
            if (tblname in fieldconfig) {
                return fieldconfig[tblname]
            }
        }
        return null
    }

    get_field_config (tblname) {
        const tableconfig = this.get_table_config(tblname)
        if (tableconfig && tableconfig.fields) {
            return tableconfig.fields
        }
        return {}
    }

    get_default_values (tblname) {
        let r = {}
        const tableconfig = this.get_table_config(tblname)
        if (tableconfig) {
            const fieldconfig = tableconfig.fields || {}
            r = Object.keys(fieldconfig).reduce((arr, fieldname) => {
                    const cfg = fieldconfig[fieldname]
                    if (cfg) {
                        arr[fieldname] = cfg.value
                    }
                    return arr
                }, r)
        }
        return r
    }

    contractmanagerchanged (cm) {
        this.setState({
            ...cm.state
        })
    }

    calcresultschange (r) {
        this.setState({...r})
    }

    render() {
        const { children } = this.props
        return isFunction(children) ? children({
            manager: this.contract_manager,
            ...this.props
        }) : children
    }
}

export {
    BaseContractApp
}