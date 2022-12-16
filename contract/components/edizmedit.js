/* Редактирование количества с разными единицами измерения */

const React  = require('react');
const classNames = require('classnames');
const debug = require('../../common/debug').debug;

const { ContractNotEmptyNumericEdit, ContractNumericInput } = require('./basecontractedit');

const CT_EDIZMQTY = 'КоличествоПоКоду';
const CT_REQUIREDQTY = 'КоличествоНеПустое';
const CT_QTY = 'Количество';

const { ControlFactory } = require('./controlfactory');

const doInputGroup = (props) => {
    const { isclasses, ediname } = props;
    return (
        <div
            className={classNames({
                "pl-2": isclasses
            })}
        >
            {ediname}
        </div>
    )
}

const ContractEdizmInput = (props) => {
    return (
        <ContractNotEmptyNumericEdit
            onInputGroup={doInputGroup.bind()}
            {...props}
        />
    )
}

const ContractCalcEdizmInput = (props) => {
    const { fieldname, manager, g32 } = props;
    return (
        <ContractNumericInput
            onInputGroup={doInputGroup.bind()}
            {...props}
        />
    )
}

const EdizmEdit = (props) => {
    const { kontdop, manager } = props;
    const edizm_list = manager.get_edizm_list(kontdop.state.data, false);
    debug("EdizmEdit", edizm_list);
    return edizm_list.map((edi, index) => {
        let numqty = index + 1;
        let fieldname = manager.get_edizm_fieldname(edi, kontdop.getEdi2());
        let displayLabel = manager.get_edizm_displayLabel(edi, numqty)
        let ediname = manager.get_edizm_name(edi)
        return (
            <ContractEdizmInput
                key={edi}
                edi={edi}
                ediname={ediname}
                displayLabel={displayLabel}
                fieldname={fieldname}
                errors={kontdop.state.errors}
                {...props}
            />
        )
    })
}

new ControlFactory().register({
    type: CT_EDIZMQTY,
    onCreate: (props) => <EdizmEdit {...props} />
}).register({
    type: CT_QTY,
    onCreate: (props) => <ContractCalcEdizmInput {...props} />
}).register({
    type: CT_REQUIREDQTY,
    onCreate: (props) => <ContractEdizmInput {...props} />
})

export {
    CT_EDIZMQTY,
    CT_REQUIREDQTY,
    CT_QTY,
    EdizmEdit,
    ContractEdizmInput,
    ContractCalcEdizmInput
}