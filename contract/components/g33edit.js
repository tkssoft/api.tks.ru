/* Редактирование кода ТН ВЭД */

const React = require('react')
const classNames = require('classnames')

const { ModalButton, ModalWindow } = require('../../common/modalbutton')
const { ContractInput } = require('./basecontractedit')
const TnvTree = require('../../tnved/tnvtree')
const { GoodsSelect } = require('../../tnved/goods')
const { ccs_contract } = require('../../common/ccs')


const is_show_window = (b) => {
    return [true, undefined].includes(b)
}


const G33EditButtons = (props) => {
    const g33ref = React.createRef()
    const goodsref = React.createRef()
    const { isclasses, show_tnved_button, show_goods_button } = props
    return (<>
        {is_show_window(show_tnved_button) && (
            <ModalButton
                buttonLabel={"Выбрать"}
                ref={g33ref}
                className={classNames({
                    [ccs_contract('tnved-button')]: true
                })}
                title={"Товарная номенклатура ВЭД"}
                isclasses={isclasses}
            >
                <TnvTree
                    onSelect={props.onSelect}
                    onAfterSelect={() => {
                        g33ref.current.handleToggleModal()
                    }}
                    code={props.value}
                />
            </ModalButton>
        )}
        {is_show_window(show_goods_button) && (
            <ModalButton
                buttonLabel={"Подобрать по наименованию"}
                ref={goodsref}
                className={classNames({
                    [ccs_contract('goods-button')]: true
                })}
                title={"Подбор кода ТН ВЭД по наименованию. Примеры декларирования"}
                isclasses={isclasses}
            >
                <GoodsSelect
                    onSelect={props.onSelect}
                    onAfterSelect={() => {
                        goodsref.current.handleToggleModal()
                    }}
                />
            </ModalButton>
        )}
    </>)
}


const G33Edit = (props) => {
    const { fieldname, displayLabel, kontdop } = props
    return (
        <ContractInput
            fieldname={fieldname || "G33"}
            displayLabel={displayLabel || "Код товара"}
            errors={kontdop.state.errors}
            onValidate={(value) => {
                if (!value || (value.length < 11)) {
                    return true
                }
                return false
            }}
            onError={(value) => {
                if ([undefined, null, ''].includes(value) || value.length < 10) {
                    return 'Введите код товара'
                }
                return ''
            }}
            {...props}
        >
            {(prs) => {return <G33EditButtons {...prs}/>}}
        </ContractInput>
    )
}

export {
    G33Edit
}