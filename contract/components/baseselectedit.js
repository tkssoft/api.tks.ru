/* select */

const React = require('react');
const classNames = require('classnames');

const { ccs_class, ccs_contract } = require('../../common/ccs');

const CT_SELECT = 'Список';
const { BaseContractEdit } = require('./basecontractedit');
const { ControlFactory, ContractControlCreation } = require('./controlfactory');

const BaseSelectEdit = (props) =>  {
    const { datasource, data, className, fieldname } = props;
    let _data = data || new ControlFactory().get_data(datasource);
    return (
        <div className={classNames({
            [ccs_contract("input")]: true,
            [ccs_contract("select")]: true,
        })}>
            <select id={props.id}
                    value={props.value}
                    onChange={props.onChange}
                    className={'form-control form-control-sm'}
            >
                {
                    Object.keys(_data).map((key) => {
                        return (
                            <option key={`option-${key}`} value={key}>{_data[key]}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}

const SelectEdit = (props) => {
    return (
        <BaseContractEdit
            {...props}
        >
            {(prs) => {
                return <BaseSelectEdit {...prs} />
            }}
        </BaseContractEdit>
    )
}


new ControlFactory()
    .register_control(new ContractControlCreation({
        type: CT_SELECT,
        onCreate: function (props) {
            return <SelectEdit {...props}/>
        }
    }))

export {
    CT_SELECT,
    BaseSelectEdit,
    SelectEdit
}