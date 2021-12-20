/* Редактирование типа контракта */

const React  = require('react');

const { BaseContractEdit } = require('./basecontractedit');
const { BaseSelectEdit } = require('./baseselectedit');
const { calctype } = require('../../common/consts');

const { ControlFactory, ContractControlCreation } = require('./controlfactory');

const CT_TYPEEDIT = 'ТипРасчетов';
const CT_TYPEEDIT_DATA = 'СписокТиповРасчетов';

const ContractTypeEdit = (props) => {
    const { fieldname, displayLabel } = props;
    return (
        <BaseContractEdit
            fieldname={fieldname || "TYPE"}
            displayLabel={displayLabel || "Тип расчета"}
            {...props}
        >
            {(prs) => {
                return <BaseSelectEdit data={calctype()} {...prs} />
            }}
        </BaseContractEdit>
    )
}

class ContractTypeEditFactory extends ContractControlCreation {
    type () {
        return CT_TYPEEDIT
    }

    create ( props ) {
        return <ContractTypeEdit {...props} />
    }
}


new ControlFactory()
    .register_control(new ContractTypeEditFactory({}))
    .register_datasource(CT_TYPEEDIT_DATA, calctype());


export {
    CT_TYPEEDIT,
    CT_TYPEEDIT_DATA
}
