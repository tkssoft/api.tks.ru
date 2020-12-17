/* Редактирование типа контракта */

const React  = require('react');

const { BaseContractEdit } = require('./basecontractedit')
const { BaseSelectEdit } = require('./baseselectedit')
const { calctype } = require('../../common/consts')

const ContractTypeEdit = (props) => {
    const { fieldname, displayLabel } = props
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

export {
    ContractTypeEdit
}
