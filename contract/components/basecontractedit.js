/* Базовый редактор */

const React  = require('react');
const classNames = require('classnames')

const { errorClass } = require('../../common/errors')
const { debug } = require('../../common/debug')
const { ccs_contract, ccs_class } = require('../../common/ccs')
const { isFunction } = require('../../common/utils')

/* Базовая конструкция с label и внутренним содержимым, куда передается onChange
   !!! children нужна функция !!!!
*/
class BaseContractEdit extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            value: BaseContractEdit.get_field_value(props)
        }
    }

    static get_field_value(props) {
        return props.manager.getFieldData(props.fieldname, props.g32)
    }

    is_readOnly() {
        return ![undefined, false].includes(this.props.readOnly)
    }

    set_field_value(value, cb) {
        if (!this.is_readOnly()) {
            if (!this.props.onValidate || this.props.onValidate(value)) {
                this.setState({value: value}, ()=>{
                    this.props.manager.setFieldData(this.props.fieldname, value, this.props.g32)
                    if (cb) {
                        cb(value)
                    }
                })
            } else {
                debug('set_field_value', this.props.fieldname, value, 'not valid')
            }
        }
    }

    onchange(e) {
        this.set_field_value(e.target.value, (value) => {
            if (this.props.onChange) {
                this.props.onChange(e)
            }
        })
    }

    onselect(value) {
        this.set_field_value(value)
        if (this.props.onSelect) {
            this.props.onSelect(value)
        }
    }

    render () {
        let cls = classNames({
            [this.props.className]: !!this.props.className,
            [ccs_class('form-group')]: true
        })
        let _value;
        if (this.is_readOnly()) {
            _value = BaseContractEdit.get_field_value(this.props)
        } else {
            _value = this.state.value
        }
        return (
            <div className={cls}>
                <div
                    className={classNames({
                        [ccs_contract("label")]: true
                    })}
                >
                    <label className={'strong text-nowrap'}>{this.props.displayLabel}</label>
                </div>
                { isFunction(this.props.children) ? this.props.children({
                    ...this.props,
                    onChange: this.onchange.bind(this),
                    onSelect: this.onselect.bind(this),
                    value: _value
                }) : this.props.children }
            </div>
        )
    }
}

/* Базовый input с указанием ошибок */
const BaseContractInput = (props) => {
    const { isclasses, fieldname, errors, onError, value, type } = props
    const errormsg = errors ? errors[fieldname] : ''
    const error = errormsg || (onError ? onError(value) : '')
    return (
        <>
            <div className={
                classNames({
                    [ccs_contract('input')]: true,
                })
            }>
                <input type={type || "text"}
                    className={classNames({
                        "form-control": isclasses,
                        [errorClass(error)]: isclasses}
                        )}
                    value={props.value || ""}
                    onChange={props.onChange}
                />
            </div>
            <div
                className={classNames({
                    [ccs_class("error")]: !!error,
                    [ccs_contract("status")]: true,
                })}
            >
                <small
                    className={classNames({
                        'text-danger' : isclasses && error,
                    })}
                >
                    {error || '\u00A0'}
                </small>
            </div>
        </>
    )
}

const ContractInput = (props) => {
    const { children } = props
    return <BaseContractEdit {...props}>
        {(prs) => {
            return (
                <>
                <BaseContractInput {...prs} />
                {children && (
                    <div
                        className={classNames({
                            [ccs_contract("button")]: true,
                        })}
                    >
                        { isFunction(children) ? children(prs) : children }
                    </div>
                )}
                </>
            )
        }}
    </BaseContractEdit>
}

const ContractNumericInput = (props) => {
    return (
        <ContractInput
            type="numeric"
            onValidate={(number) => {
                if ([undefined, null, '', NaN].includes(number)) {
                    return true
                }
                try {
                    if (parseFloat(number).toString() !== number.toString()) {
                        return false
                    }
                } catch (e) {
                    return false
                }
                return true
            }}
            {...props}
        />
    )
}

const ContractNotEmptyNumericEdit = (props) => {
    return (
        <ContractNumericInput
            onError={(number) => {
                try {
                    if ([undefined, null, '', NaN].includes(number) || (parseFloat(number).toString() !== number.toString())) {
                        return 'Введите значение'
                    }
                } catch (e) {
                    return 'Введите значение'
                }
                return ''
            }}
            {...props}
        />
    )
}

export {
    BaseContractEdit,
    BaseContractInput,
    ContractInput,
    ContractNumericInput,
    ContractNotEmptyNumericEdit
}