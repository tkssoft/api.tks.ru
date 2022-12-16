/* Базовый редактор */

const React  = require('react');
const classNames = require('classnames');

const { errorClass } = require('../../common/errors');
const { debug } = require('../../common/debug');
const { ccs_contract, ccs_class } = require('../../common/ccs');
const { isFunction } = require('../../common/utils');
const { HorzRow, Column, getcold, is_horz, IfRow } = require('../../common/bs');

const { ControlFactory, ContractControlCreation, CT_CONTRACTINPUT } = require('./controlfactory');

const FormLabel = (props) => {
    const { type, isclasses } = props
    const checkbox = type === 'checkbox'
    return (
        <label className={classNames({
            [ccs_contract("label")]: true,
            'form-check-label form-check-label-sm': checkbox && isclasses,
            'col-form-label col-form-label-sm': !checkbox && isclasses,
            ...getcold(props, is_horz(props) && !checkbox, 'label')
        })}>
            {props.displayLabel}
        </label>
    )
}

/* Базовая конструкция с label и внутренним содержимым, куда передается onChange
   !!! children нужна функция !!!!
*/
class BaseContractEdit extends React.Component {

    constructor (props) {
        super(props);
        this.inputref = React.createRef();
        this.selection = {
            start: false,
            end: false
        };
    }

    componentDidUpdate() {

        // Восстанавливаем выделение после обновления.
        if (this.inputref.current) {
            const { selectionStart, selectionEnd } = this.inputref.current;
            const update = (this.selection.start !== false && this.selection.start !== selectionStart)
            || (this.selection.end !== false && this.selection.end !== selectionEnd);

            if (update) {
                this.inputref.current.selectionStart = this.selection.start;
                this.inputref.current.selectionEnd = this.selection.end;
            }

        }

    }

    get_field_value(props) {
        return props.value === undefined ?
            props.manager.getFieldData(props.fieldname, props.g32) :
            props.value
    }

    is_readOnly() {
        return ![undefined, false].includes(this.props.readOnly);
    }

    set_field_value(value, cb) {
        if (!this.is_readOnly()) {
            if (!this.props.onValidate || this.props.onValidate(value)) {
                this.setState({ value }, ()=>{
                    this.props.manager.setFieldData(this.props.fieldname, value, this.props.g32);
                    if (cb) {
                        cb(value);
                    }
                })
            } else {
                debug('set_field_value', this.props.fieldname, value, 'not valid');
            }
        }
    }

    onchange(e) {
        const input = this.inputref.current;
        if (input) {
            this.selection = {
                start: input.selectionStart,
                end: input.selectionEnd
            };
        }
        this.set_field_value(this.props.type === 'checkbox' ? e.target.checked : e.target.value, (value) => {
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
        const { formgroup, isclasses, type, debug } = this.props;
        if (debug) {
            //console.log('value', this.state.value);
        }
        let fieldconfig = this.props.manager.get_field_config(this.props)
        const checkbox = type === 'checkbox'
        /* Возможность не показывать поле  */
        if (![undefined, true].includes(fieldconfig.visible)) {
            return null;
        }
        let cls = classNames({
            [this.props.className]: !!this.props.className,
            [this.props.classNamePrefix]: !!this.props.classNamePrefix,
            [ccs_class('form-group')]: [undefined, true].includes(formgroup),
            'form-group': isclasses && [undefined, true].includes(formgroup),
            'form-check': isclasses && checkbox,
            ...getcold(this.props, !checkbox, 'group')
        })
        return (
            <div className={cls}>
                <IfRow iif={is_horz(this.props) && !checkbox} alignCenter={checkbox} {...this.props}>
                    { !checkbox && (<FormLabel {...this.props}/>) }
                    { isFunction(this.props.children) ? this.props.children({
                        ...this.props,
                        onChange: this.onchange.bind(this),
                        onSelect: this.onselect.bind(this),
                        value: this.get_field_value(this.props),
                        inputref: this.inputref
                    }) : this.props.children }
                </IfRow>
            </div>
        )
    }
}

const get_input_className = (props) => {
    const { type, isclasses } = props;
    const checkbox = type === 'checkbox';
    return classNames({
        [ccs_class('input')]: true,
        'w-100': isclasses,
        ...getcold(props, is_horz(props) && !checkbox, 'input')
    })
}

/* Базовый input с указанием ошибок */
const BaseContractInput = (props) => {
    const { isclasses, fieldname, errors, onError, value, type, status, onInputGroup, inputref } = props
    const errormsg = errors ? errors[fieldname] : ''
    const error = errormsg || (onError ? onError(value) : '')
    var p = {}
    var fcontrol = true
    const checkbox = type === 'checkbox'
    switch (type) {
        case 'checkbox':
            // ToDo: вынести undefined в параметры для значения по умолчанию.
            p.checked = [true, undefined].includes(value);
            fcontrol = false;
            break;
        default:
            p.value = value || '';
            break;
    }
    const cls = get_input_className(props);
    if (props.debug) {
        debug('BaseContractInput', fieldname, value);
    }
    return (
        <div className={cls}>
            <div className="input-group">
                <input type={type || "text"}
                    className={classNames({
                        ["form-control form-control-sm"]: fcontrol && isclasses,
                        ["form-check-input"]: !fcontrol && isclasses,
                        [errorClass(error)]: isclasses}
                        )}
                    onChange={props.onChange}
                    ref={inputref}
                    {...p}
                />
                { type === 'checkbox' && (<FormLabel {...props} />) }
                { onInputGroup !== undefined && (
                    <div className="input-group-append">
                        { onInputGroup(props) }
                    </div>
                )}
            </div>
            {[undefined, true].includes(status) && (
                <small
                    className={classNames({
                        'text-danger' : isclasses && error,
                    })}
                >
                    {error || '\u00A0'}
                </small>
            )}
        </div>
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
                                ...getcold(prs, is_horz(prs), 'button')
                            })}
                        >
                            { isFunction(children) ? children(
                                    {...prs, formgroup: false}
                                ) : children }
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

const CT_NUMERICINPUT = 'Число';
const CT_NOTNULLNUMERIC = 'НеПустоеЧисло';

new ControlFactory()
    .register_control(new ContractControlCreation({
        type: CT_CONTRACTINPUT,
        onCreate: function (props) {
            return <ContractInput {...props} />
        }
    }))
    .register_control(new ContractControlCreation({
        type: CT_NUMERICINPUT,
        onCreate: function (props) {
            return <ContractNumericInput {...props} />
        }
    }))
    .register_control(new ContractControlCreation({
        type: CT_NOTNULLNUMERIC,
        onCreate: function (props) {
            return <ContractNotEmptyNumericEdit {...props} />
        }
    }))


export {
    BaseContractEdit,
    BaseContractInput,
    ContractInput,
    ContractNumericInput,
    ContractNotEmptyNumericEdit,
    CT_CONTRACTINPUT,
    CT_NUMERICINPUT,
    CT_NOTNULLNUMERIC,
    get_input_className
}