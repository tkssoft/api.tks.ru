/* Редактирование таможенной стоимости */

const React = require('react');
const { ContractNotEmptyNumericEdit } = require('./basecontractedit');
const { ControlFactory } = require('./controlfactory')

const CT_COST = 'Стоимость';

const G45Edit = (props) => {
    const { displayLabel, fieldname, kontdop } = props
    return <ContractNotEmptyNumericEdit
                displayLabel={displayLabel || "Стоимость"}
                fieldname={fieldname || "G45"}
                errors={kontdop.state.errors}
                {...props}
            />
}

new ControlFactory().register({
    type: CT_COST,
    onCreate : (props) => <G45Edit {...props}/>
})

export {
    G45Edit,
    CT_COST
}