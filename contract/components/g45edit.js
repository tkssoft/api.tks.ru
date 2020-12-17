/* Редактирование таможенной стоимости */

const React = require('react')
const { ContractNotEmptyNumericEdit } = require('./basecontractedit')

const G45Edit = (props) => {
    const { displayLabel, fieldname, kontdop } = props
    return <ContractNotEmptyNumericEdit
                displayLabel={displayLabel || "Стоимость"}
                fieldname={fieldname || "G45"}
                errors={kontdop.state.errors}
                {...props}
            />
}

export {
    G45Edit
}