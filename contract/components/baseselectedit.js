/* select */

const React = require('react');
const classNames = require('classnames');

const { ccs_class, ccs_contract } = require('../../common/ccs');

const CT_SELECT = 'Список';
const { ControlFactory, ContractControlCreation } = require('./controlfactory');

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

new ControlFactory()
    .register_control(new ContractControlCreation({
        type: CT_SELECT,
        onCreate: function (props) {
            return <BaseSelectEdit {...props}/>
        }
    }))

export {
    CT_SELECT
}