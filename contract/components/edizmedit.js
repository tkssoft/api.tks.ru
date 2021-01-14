/* Редактирование количества с разными единицами измерения */

const React  = require('react');
const classNames = require('classnames')

const { ContractNotEmptyNumericEdit } = require('./basecontractedit')

const ContractEdizmInput = (props) => {
    const { ediname } = props
    return (
        <ContractNotEmptyNumericEdit {...props}>
            {(prs) => {
                const { isclasses } = prs
                return (
                    <div
                        className={classNames({
                            "pt-2 px-2 ccs-contract-strong": isclasses
                        })}
                    >
                        {ediname}
                    </div>
                )
            }}
        </ContractNotEmptyNumericEdit>
    )
}

const EdizmEdit = (props) => {
    const { kontdop } = props
    const edizm_list = kontdop.get_edizm_list()
    return (
        <div className="ccs-contract-EdizmEdit">
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
        </div>
    )
}

export {
    EdizmEdit,
    ContractEdizmInput
}