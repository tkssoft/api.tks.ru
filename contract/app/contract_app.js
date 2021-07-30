// Приложение для расчета контракта (верхняя часть, таблица и нижняя часть)

const React  = require('react');


const { contract_manager } = require('./contract_manager');
const { isFunction, filter_dict } = require('../../common/utils');
import { LocalContractStorage } from "./contract_storage"

const kontdop = 'kontdop';
const kontrakt = 'kontrakt';

// Наименования полей, которые сохраняются у пользователя
const saved_fields = {
    kontrakt: ['G34', ],
    kontdop: ['G33', 'G45', 'G38C', 'G38', 'GEDI1C', 'GEDI1', ],
};

class BaseContractApp extends React.Component {

    constructor (props) {
        super(props)

        this.contract_manager = new contract_manager(
            this.get_manager_params()
        )

        this.state = this.get_init_state();
        this.handleSaveData = this.save_data.bind(this);
        this.mounted = false;

    }

    get_init_state () {
        return {
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
        };
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

    get_default_values (tblname, keys) {
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
        r = {
            ...r,
            ...this.get_storage_values(tblname, keys)
        }
        return r
    }

    get_storage_key (tblname, keys) {
        let d = {
            'tblname': tblname,
        };
        if (keys) {
            d = {
                ...d,
                ...keys
            }
        }
        return JSON.stringify(d)
    }

    get_storage_values (tblname, keys) {
        const key = this.get_storage_key(tblname, keys);
        const data = window.localStorage.getItem(key);
        if (data && (tblname in saved_fields)) {
            return filter_dict(JSON.parse(data), saved_fields[tblname]);
        }
        return {};
    }

    set_storage_values (tblname, data, keys) {
        const key = this.get_storage_key(tblname, keys);
        if (data && (tblname in saved_fields)) {
            const to_save = filter_dict(data, saved_fields[tblname]);
            window.localStorage.setItem(key, JSON.stringify(to_save));
        }
    }

    componentDidMount () {
        this.mounted = true;
        window.addEventListener('unload', this.handleSaveData);
    }

    componentWillUnmount () {
        window.removeEventListener('unload', this.handleSaveData);
    }

    save_data () {
        this.set_storage_values('kontrakt', this.contract_manager.kontrakt);
        this.set_storage_values('kontdop', this.contract_manager.kontdop[0].state.data, { G32: 1 });
    }

    contractmanagerchanged (cm) {
        if (this.mounted) {
            this.setState({
                ...cm.state
            })
        }
    }

    calcresultschange (r) {
        if (this.mounted) {
            this.setState({...r})
        }
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