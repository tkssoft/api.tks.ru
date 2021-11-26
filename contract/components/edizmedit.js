/* Редактирование количества с разными единицами измерения */

const React  = require('react');
const classNames = require('classnames');

const { ContractNotEmptyNumericEdit, ContractNumericInput } = require('./basecontractedit');

const CT_EDIZMQTY = 'Количество';

const { ControlFactory, ContractControlCreation } = require('./controlfactory');

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
    return (
        <ContractNumericInput
            onInputGroup={doInputGroup.bind()}
            {...props}
        />
    )
}

const EdizmEdit = (props) => {
    const { kontdop } = props;
    const edizm_list = kontdop.get_edizm_list();
    return (
        <>
            {
                edizm_list.map((edi, index) => {
                    let numqty = index + 1;
                    let fieldname = kontdop.get_edizm_fieldname(edi)
                    let displayLabel = kontdop.get_edizm_displayLabel(edi, numqty)
                    let ediname = kontdop.get_edizm_name(edi)
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
        </>
    )
}

class EdizmEditFactory extends ContractControlCreation {

    type () {
        return CT_EDIZMQTY
    }

    create (props) {
        return <EdizmEdit {...props} />
    }

}

new ControlFactory().register_control(new EdizmEditFactory({}));

export {
    CT_EDIZMQTY,
    ContractEdizmInput,
    ContractCalcEdizmInput
}