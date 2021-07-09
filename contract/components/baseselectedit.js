/* select */

const React = require('react');
const classNames = require('classnames');

const { ccs_class, ccs_contract } = require('../../common/ccs');

import { CT_SELECT, register_control } from './controlfactory';

const BaseSelectEdit = (props) =>  {
    return (
        <div className={classNames({
            [ccs_contract("input")]: true,
            [ccs_contract("select")]: true
        })}>
            <select id={props.id}
                    value={props.value}
                    onChange={props.onChange}
                    className={'form-control form-control-sm'}
            >
                {
                    Object.keys(props.data).map((key) => {
                        return (
                            <option key={key} value={key}>{props.data[key]}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}

register_control(CT_SELECT, BaseSelectEdit);

export {
    BaseSelectEdit
}