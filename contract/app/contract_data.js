
/* Компоненты для заполнения данных в contract_manager */

const React  = require('react');

import classNames from 'classnames'
const { ValutaEdit, OksmtEdit } = require('../components/components')
const { ContractTypeEdit } = require('../components/contracttypeedit')
const { G33Edit } = require('../components/g33edit')
const { G45Edit } = require('../components/g45edit')
const { EdizmEdit } = require('../components/edizmedit')
const { StavkaEditor } = require('../components/stavkaeditor')


/* Данные по заголовку контракта */
const ContractData = (props) => {
    return (
        <div className="ccs-contract-ContractData">
            <ContractTypeEdit {...props} />
            <ValutaEdit {...props} />
            <OksmtEdit {...props} />
        </div>
    )
}

/* Данные по товару */
const ContractDopData = (props) => {
    let kontdop = props.manager.getSourceData((props.g32 || 1) - 1)
    const { isclasses } = props
    return (
        <div
            className={classNames({
                "kontdop ccs-contract-ContractDopData": true,
            })}
        >
            <G33Edit kontdop={kontdop} { ...props } />
            <G45Edit kontdop={kontdop} { ...props } />
            <EdizmEdit kontdop={kontdop} { ...props } />
            <StavkaEditor kontdop={kontdop} {...props} />
        </div>
    )
}

export {
    ContractData,
    ContractDopData
}