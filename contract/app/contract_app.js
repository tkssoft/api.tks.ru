// Приложение для расчета контракта (верхняя часть, таблица и нижняя часть)

const React  = require('react');


const { contract_manager, tbl_kontrakt, tbl_kontdop } = require('./contract_manager');
const { isFunction, filter_dict, isEmptyAll,  } = require('../../common/utils');


class BaseContractApp extends React.Component {

    constructor (props) {
        super(props)

        this.contract_manager = new contract_manager(
            this.get_manager_params()
        )

        this.state = this.get_init_state();
        this.handleSaveData = this.save_data.bind(this);
        this.storage_section = props.storage_section || this.get_storage_section();

    }

    get_storage_section () {
        return 'CcsContract'
    }

    get_init_state () {
        return {
            sums: {
                total: 0,
                g32: {},
                letter: {}
            },
            errors : { ...this.contract_manager.state.errors },
            result : {},
            calcdata : {},
            mounted: false,
            // Наименования полей, которые сохраняются у пользователя
            saved_fields: {
                [tbl_kontrakt]: ['G34', 'TYPE', 'G221', ],
                [tbl_kontdop]: ['G33', 'G45', 'G38C', 'G38', 'GEDI1C', 'GEDI1', 'GEDI2C', 'GEDI2', 'GEDI3C', 'GEDI3', ],
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

    get_default_values (tblname) {
        return {}
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

    doreadprefs () {
        return this.read_data();
    }

    componentDidMount () {
        const that = this;
        window.addEventListener('unload', this.handleSaveData);
        this.doreadprefs().then(function () {
            that.setState(
                {mounted: true},
                () => {
                    that.updatestatefrommanager(that.contract_manager.state);
                }
            )
        })
    }

    componentWillUnmount () {
        window.removeEventListener('unload', this.handleSaveData);
        this.save_data();
    }

    filter_saved_data (tblname, data, saveddata) {
        const saved_fields = this.state.saved_fields[tblname];
        return saved_fields.reduce((r, fieldname) => {
            const fieldvalue = saveddata[fieldname];
            if (fieldvalue !== undefined) {
                r[fieldname] = saveddata[fieldname];
            }
            return r;
        }, data)
    }

    /* Восстановление данных расчета */
    read_data () {
        const that = this;
        return new Promise(function (res, rej) {
            const kontrakt = that.get_storage_values(tbl_kontrakt, null, {});
            const kontdop = that.get_storage_values(tbl_kontdop, null, []);
            that.contract_manager.begin_update();
            try {
                that.contract_manager.kontrakt = that.filter_saved_data(
                    tbl_kontrakt, that.contract_manager.kontrakt, kontrakt
                );
                if (Array.isArray(kontdop)) {
                    kontdop.map((data, index) => {
                        if (!isEmptyAll(data)) {
                            Object.keys(data).map((fieldname) => {
                                if (![undefined, null].includes(data[fieldname]) && that.state.saved_fields[tbl_kontdop].includes(fieldname)) {
                                    that.contract_manager.setFieldData(fieldname, data[fieldname], index + 1);
                                }
                            })
                        }
                        return true;
                    });
                }
                that.contract_manager.setState({modified: true});
            } finally {
                that.contract_manager.end_update((cm) => {cm.kondopchange()});
            }
            res();
        });
    }

    /* Сохранение данных расчета */
    save_data () {
        // ToDo: сохранять все товары. Табличные данные сохранять отдельно от однотоварных
        try {
            const kontrakt_to_save = filter_dict(this.contract_manager.kontrakt, this.state.saved_fields[tbl_kontrakt]);
            this.set_storage_values(tbl_kontrakt, kontrakt_to_save);
            this.set_storage_values(tbl_kontdop, this.contract_manager.kontdop.reduce((arr, kontdop, index) => {
                let to_save = filter_dict(kontdop.state.data, this.state.saved_fields[tbl_kontdop]);
                arr.push(to_save);
                return arr;
            }, []));
        } catch(err) {
            console.error('save_data', err);
        }
    }

    updatestatefrommanager(state) {
        this.setState({
            ...state,
            errors: {
                ...state.errors,
                ...this.state.errors
            }
        })
    }

    contractmanagerchanged (cm) {
        if (this.state.mounted) {
            this.updatestatefrommanager(cm.state);
        }
    }

    calcresultschange (r) {
        if (this.state.mounted) {
            this.updatestatefrommanager(r);
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