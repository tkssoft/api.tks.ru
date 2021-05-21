
/* Компоненты для заполнения данных в contract_manager */

const React  = require('react');

import classNames from 'classnames'
const { ValutaEdit, OksmtEdit } = require('../components/components')
const { ContractTypeEdit } = require('../components/contracttypeedit')
const { G33Edit } = require('../components/g33edit')
const { G45Edit } = require('../components/g45edit')
const { EdizmEdit } = require('../components/edizmedit')
const { StavkaEditor } = require('../components/stavkaeditor')
import { isError } from "../../common/utils"
import { get_layout_config } from '../../common/bs'
import { ccs_contract } from '../../common/ccs'
import { Row } from '../../common/bs'


/* Данные по заголовку контракта */
const ContractData = (props) => {
    const { isclasses } = props
    const cls = classNames({
        [ccs_contract('ContractData')]: true,
        'row': isclasses
    })
    return (
        <div className={cls}>
            <ContractTypeEdit layout={get_layout_config('-sm', '-sm-4', '-sm-8')} {...props} />
            <ValutaEdit layout={get_layout_config('-sm', '-sm-4', '-sm-8')} {...props} />
            <OksmtEdit layout={get_layout_config('-sm', '-sm-4', '-sm-8')} {...props} />
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
                "kontdop": true,
                [ccs_contract('ContractDopData')]: true,
                'row': isclasses,
            })}
        >
            <G33Edit
                kontdop={kontdop}
                orientation='horz'
                layout={get_layout_config('-sm', '-sm-2', '-sm-3', '-sm-7')}
                { ...props }
            />
            {!isError(kontdop.state.errors.G33) && (
                <>

                    <G45Edit
                        kontdop={kontdop}
                        layout={get_layout_config('-sm', '-sm-4', '-sm-4', '-sm-4')}
                        { ...props }
                    />
                    <EdizmEdit
                        kontdop={kontdop}
                        layout={get_layout_config('-sm', '-sm-4', '-sm-4', '-sm-4')}
                        { ...props }
                    />
                    {props.onDisplayCalcFields && (
                        props.onDisplayCalcFields(props)
                    )}
                    <StavkaEditor
                        kontdop={kontdop}
                        {...props}
                    />
                </>
            )}
        </div>
    )
}

export {
    ContractData,
    ContractDopData
}