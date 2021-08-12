// Приложение для расчета контракта (верхняя часть, таблица и нижняя часть)

const React  = require('react');


const { contract_manager, tbl_kontrakt, tbl_kontdop } = require('./contract_manager');
const { isFunction, filter_dict, isEmptyAll,  } = require('../../common/utils');

// Наименования полей, которые сохраняются у пользователя
const saved_fields = {
    [tbl_kontrakt]: ['G34', 'TYPE', 'G221', ],
    [tbl_kontdop]: ['G33', 'G45', 'G38C', 'G38', 'GEDI1C', 'GEDI1', 'GEDI2C', 'GEDI2', 'GEDI3C', 'GEDI3', ],
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
        this.storage_section = this.get_storage_section();

        this.read_data();

    }

    get_storage_section () {
        return 'ContractApp'
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

    get_storage_key (tblname, keys) {
        let d = {
            'section': this.storage_section,
            'tblname': tblname,
        };
        if (!isEmptyAll(keys)) {
            d = {
                ...d,
                ...keys
            }
        }
        return JSON.stringify(d)
    }

    get_storage_values (tblname, keys, def={}) {
        const key = this.get_storage_key(tblname, keys);
        const data = window.localStorage.getItem(key);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                console.error('get_storage_values', tblname, keys, error);
                return def;
            }
        }
        return def;
    }

    set_storage_values (tblname, data, keys) {
        const key = this.get_storage_key(tblname, keys);
        if (data) {
            window.localStorage.setItem(key, JSON.stringify(data));
        }
    }

    componentDidMount () {
        window.addEventListener('unload', this.handleSaveData);
        this.mounted = true;
    }

    componentWillUnmount () {
        window.removeEventListener('unload', this.handleSaveData);
        this.save_data();
    }

    /* Восстановление данных расчета */
    read_data () {
        // ToDo: возможно сохранять / восстанавливать ставки-признаки
        let that = this;
        const kontrakt = this.get_storage_values(tbl_kontrakt, null, {});
        const kontdop = this.get_storage_values(tbl_kontdop, null, []);
        this.contract_manager.begin_update();
        try {
            this.contract_manager.kontrakt = {
                ...this.contract_manager.kontrakt,
                ...kontrakt
            };
            if (Array.isArray(kontdop)) {
                kontdop.map((data, index) => {
                    if (!isEmptyAll(data)) {
                        Object.keys(data).map((fieldname) => {
                            if (![undefined, null].includes(data[fieldname])) {
                                that.contract_manager.setFieldData(fieldname, data[fieldname], index + 1);
                            }
                        })
                    }
                    return true;
                });
            }
            this.contract_manager.setState({modified: true});
        } finally {
            this.contract_manager.end_update((cm) => {cm.kondopchange()});
        }
    }

    /* Сохранение данных расчета */
    save_data () {
        // ToDo: сохранять все товары. Табличные данные сохранять отдельно от однотоварных
        try {
            const kontrakt_to_save = filter_dict(this.contract_manager.kontrakt, saved_fields[tbl_kontrakt]);
            this.set_storage_values(tbl_kontrakt, kontrakt_to_save);
            this.set_storage_values(tbl_kontdop, this.contract_manager.kontdop.reduce((arr, kontdop, index) => {
                let to_save = filter_dict(kontdop.state.data, saved_fields[tbl_kontdop]);
                arr.push(to_save);
                return arr;
            }, []));
        } catch(err) {
            console.error('save_data', err);
        }
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