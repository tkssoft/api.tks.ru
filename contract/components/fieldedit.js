const React  = require('react');
const classNames = require('classnames')

const FieldEdit = (props) => {
    const { fieldname, displaylabel, datatype, errorClass, value, onChange, isclasses } = props
    return (
        <div className={classNames({
            "ccs-contract-FieldEdit": true,
            "form-group row align-items-sm-center": isclasses
            })}>
            <label htmlFor={`${fieldname}Edit`} className={classNames({
                "col-sm-4 ccs-contract-strong pt-1 text-nowrap": isclasses
                })}>{displaylabel}</label>
            <div className={classNames({
                'col-sm-8' : isclasses
                })}>
                <input type={datatype}
                        className={classNames({
                            "form-control": isclasses
                        })}
                        id={`${fieldname}Edit`}
                        name={fieldname}
                        value={value? value : ''}
                        onChange={onChange}
                />
            </div>
        </div>
    )
}

export {
    FieldEdit
}
