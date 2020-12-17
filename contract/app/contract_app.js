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
            errors : {...this.contract_manager.state.errors}
        }

    }

    get_manager_params () {
        return {
            NUM: this.props.NUM || this.props.num,
            onChange: this.contractmanagerchanged.bind(this),
            onResultsChange: this.calcresultschange.bind(this),
            onGetDefaultValues: this.get_default_values.bind(this),
            /*  Дополнительные обязательные единицы измерения
                ToDo: сделать по настройке из отдельного файла
            */
            addedizm: this.props.addedizm ? {...this.props.addedizm} : {}
        }
    }

    get_default_values (tblname) {
        return {}
    }

    contractmanagerchanged (cm) {
        this.setState({
            ...cm.state
        })
    }

    calcresultschange = (r) => {
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