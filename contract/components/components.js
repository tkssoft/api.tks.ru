
const React  = require('react');
const classNames = require('classnames');

const nsi = require('../../common/nsi');
const { ccs_class, ccs_contract } = require('../../common/ccs');
const { BaseContractEdit } = require('./basecontractedit');

const { ControlFactory, ContractControlCreation } = require('./controlfactory');

const CT_VALUTA = 'СписокВалют';
const CT_OKSMT = 'СписокСтран';

const oksmt = nsi.oksmt();
const oksmt_codes = Object.keys(oksmt).sort((a, b) => {
    if (a === b) {
        return 0;
    }
    if (a === '000' && b !== '000') {
        return -1;
    }
    if (a !== '000' && b === '000') {
        return 1;
    }
    if (oksmt[a].KRNAIM > oksmt[b].KRNAIM) {
        return 1;
    }
    if (oksmt[a].KRNAIM < oksmt[b].KRNAIM) {
        return -1;
    }
    return 0;
});

const valname = nsi.valname();
const valname_codes = Object.keys(valname).sort((a, b) => {
    if (valname[a].KRNAIM > valname[b].KRNAIM) {
        return 1;
    }
    if (valname[a].KRNAIM < valname[b].KRNAIM) {
        return -1;
    }
    return 0;
})

const ValutaSelect = (props) => {
    return (
        <div className={classNames({
            [ccs_class("form-item")]: true,
            [ccs_contract("select")]: true
        })}>
            <select
                className={classNames({
                    "form-control form-control-sm": true,
                })}
                onChange={(e) => props.onChange(e)}
                value={props.value}
            >
                {valname_codes.map((key, i) => {
                    return (
                        <option key={key} value={key}>{valname[key].KRNAIM}</option>
                    )
                })}
            </select>
        </div>
    )
}


const OksmtSelect = (props) => {
    return (
        <div className={classNames({
            [ccs_class("form-item")]: true,
            [ccs_contract("select")]: true
        })}>
            <select
                className={classNames({
                    "form-control form-control-sm": true,
                })}
                onChange={(e) => props.onChange(e)}
                value={props.value}
            >
                {oksmt_codes.map((key, i) => {
                    return (
                        <option key={key} value={key}>{oksmt[key].KRNAIM}</option>
                    )
                })}
            </select>
        </div>
    )
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