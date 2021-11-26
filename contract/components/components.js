
const React  = require('react');
const classNames = require('classnames');

const nsi = require('../../common/nsi');
const { ccs_class, ccs_contract } = require('../../common/ccs');
const { BaseContractEdit } = require('./basecontractedit');

const { ControlFactory, ContractControlCreation } = require('./controlfactory');

const CT_VALUTA = 'СписокВалют';
const CT_OKSMT = 'СписокСтран';

class ValutaSelect extends React.Component {
    constructor (props) {
        super(props);
        this.values = nsi.valname();
        this.state = {
            value: props.value
        }
    }

    dovaluechange = (e) => {
        this.setState({value: e.target.value});
        this.props.onChange(e);
    };

    render () {
        return (
            <div className={classNames({
                [ccs_class("form-item")]: true,
                [ccs_contract("select")]: true
            })}>
                <select
                    className={classNames({
                        [this.props.className]: !!this.props.className,
                        "form-control form-control-sm": true,
                    })}
                    onChange={this.dovaluechange}
                    value={this.state.value}
                >
                    {Object.keys(this.values).sort((a, b) => {
                        if (this.values[a].KRNAIM > this.values[b].KRNAIM) {
                            return 1
                        }
                        if (this.values[a].KRNAIM < this.values[b].KRNAIM) {
                            return -1
                        }
                        return 0
                    }).map((key, i) => {
                        return (
                            <option key={key} value={key}>{this.values[key].KRNAIM}</option>
                        )
                    })}
                </select>
            </div>
        )
    }
}


class OksmtSelect extends React.Component {
    constructor (props) {
        super(props);
        this.values = nsi.oksmt();
        this.state = {
            value: props.value
        }
    }

    dovaluechange = (e) => {
        this.setState({value: e.target.value});
        this.props.onChange(e);
    };

    render () {
        return (
            <div className={classNames({
                [ccs_class("form-item")]: true,
                [ccs_contract("select")]: true
            })}>
                <select
                    className={classNames({
                        [this.props.className]: !!this.props.className,
                        "form-control form-control-sm": true,
                    })}
                    onChange={this.dovaluechange}
                    value={this.state.value}
                >
                    {Object.keys(this.values).sort((a, b) => {
                        if (a === b) {
                            return 0
                        }
                        if (a === '000' && b !== '000') {
                            return -1
                        }
                        if (a !== '000' && b === '000') {
                            return 1
                        }
                        if (this.values[a].KRNAIM > this.values[b].KRNAIM) {
                            return 1
                        }
                        if (this.values[a].KRNAIM < this.values[b].KRNAIM) {
                            return -1
                        }
                        return 0
                    }).map((key, i) => {
                        return (
                            <option key={key} value={key}>{this.values[key].KRNAIM}</option>
                        )
                    })}
                </select>
            </div>
        )
    }
}

const ValutaEdit = (props) => {
    const { fieldname, displayLabel } = props
    return (
        <BaseContractEdit
            fieldname={fieldname || "G221"}
            displayLabel={displayLabel || "Валюта расчета"}
            {...props}
        >
            {(prs) => {
                return <ValutaSelect {...prs} />
            }}
        </BaseContractEdit>
    )
}

const OksmtEdit = (props) => {
    const { fieldname, displayLabel } = props
    return (
        <BaseContractEdit
            fieldname={fieldname || "G34"}
            displayLabel={displayLabel || "Страна происхождения"}
            {...props}
        >
            {(prs) => {
                return <OksmtSelect {...prs} />
            }}
        </BaseContractEdit>
    )
}

class ValutaFactory extends ContractControlCreation {

    type () {
        return CT_VALUTA;
    }

    create (props) {
        return <ValutaEdit {...props} />
    }

}

class OksmtFactory extends ContractControlCreation {

    type () {
        return CT_OKSMT;
    }

    create (props) {
        return <OksmtEdit {...props} />
    }

}

new ControlFactory()
    .register_control(new ValutaFactory({}))
    .register_control(new OksmtFactory({}))
    ;

export {
    CT_VALUTA,
    CT_OKSMT
}