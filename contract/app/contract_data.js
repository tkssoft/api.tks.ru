
/* Компоненты для заполнения данных в contract_manager */

const React  = require('react');

import classNames from 'classnames';
const { CT_VALUTA, CT_OKSMT } = require('../components/components');
const { CT_TYPEEDIT } = require('../components/contracttypeedit');
const { G33Edit } = require('../components/g33edit');
const { G45Edit } = require('../components/g45edit');
const { EdizmEdit } = require('../components/edizmedit');
const { StavkaEditor } = require('../components/stavkaeditor');
import { isError } from "../../common/utils";
import { get_layout_config } from '../../common/bs';
import { ccs_contract } from '../../common/ccs';
import { Row } from '../../common/bs';

const { ControlFactory } = require('../components/controlfactory');


/* Данные по заголовку контракта */
const ContractData = (props) => {
    const { isclasses } = props;
    const cls = classNames({
        [ccs_contract('ContractData')]: true,
    });

    const fieldconfig = [
        {
            edittype: CT_TYPEEDIT,
        },
        {
            edittype: CT_VALUTA,
        },
        {
            edittype: CT_OKSMT,
        }
    ];

    const factory = new ControlFactory();
    return (
        <div className={cls}>
            <div className="row">
                {fieldconfig.map((field) => factory.create({
                    key: field.edittype,
                    layout: get_layout_config('-sm', '-sm-4', '-sm-8'),
                    ...field,
                    ...props
                }))}
            </div>
        </div>
    )
}

/* Данные по товару */
const ContractDopData = (props) => {
    let kontdop = props.manager.getSourceData((props.g32 || 1) - 1)
    const { isclasses } = props
    if (!kontdop) {
        return <></>
    }
    return (
        <div
            className={classNames({
                "kontdop": true,
                [ccs_contract('ContractDopData')]: true,
            })}
        >
            <Row isclasses={isclasses}>
                <G33Edit
                    kontdop={kontdop}
                    orientation='horz'
                    layout={get_layout_config('-sm', '-sm-2', '-sm-3', '-sm-7')}
                    { ...props }
                />
            </Row>
            {!isError(kontdop.state.errors.G33) && (
                <>
                    <Row isclasses={isclasses}>
                        <G45Edit
                            kontdop={kontdop}
                            layout={get_layout_config('-sm', '-sm-4', '-sm-4', '-sm-4')}
                            { ...props }
                        />
                    </Row>
                    <Row isclasses={isclasses}>
                        <EdizmEdit
                            kontdop={kontdop}
                            layout={get_layout_config('-sm', '-sm-4', '-sm-4', '-sm-4')}
                            { ...props }
                        />
                    </Row>
                    {props.onDisplayCalcFields && (
                        props.onDisplayCalcFields(props)
                    )}
                    <Row>
                        <StavkaEditor
                            kontdop={kontdop}
                            {...props}
                        />
                    </Row>
                </>
            )}
        </div>
    )
}

export {
    ContractData,
    ContractDopData
}