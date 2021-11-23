
const React  = require('react')
const classNames = require('classnames')
const { ccs_class } = require('./ccs')
const { isError } = require('../common/utils')

const Errors = ({ errors, isclasses, toshow }) => {
    const show = toshow ? toshow.split(' ') : undefined;
    return (
        <div className={classNames({[ccs_class('formErrors')]: true, 'row': isclasses})}>
            <div className={classNames({'col': isclasses})}>
            {Object.keys(errors).map((fieldName, i) => {
                var cls = classNames({
                    'alert': isclasses,
                    'alert-danger' : isclasses,
                });
                if(errors[fieldName] && (errors[fieldName].length > 0) && (show === undefined || show.includes(fieldName))) {
                    return (
                        <div key={fieldName} className={cls} role="alert">{errors[fieldName]}</div>
                    )
                } else {
                    return ''
                }
            })}
            </div>
        </div>
    )
}

const errorClass = (error) => {
    return (isError(error) ? 'is-invalid' : '')
};

export {
    Errors,
    errorClass
}