
const React  = require('react')
const classNames = require('classnames')
const { ccs_class } = require('./ccs')

const Errors = ({ errors, isclasses, toshow }) => {
    const show = toshow ? toshow.split(' ') : undefined
    return (
        <div className={ccs_class('formErrors')}>
            {Object.keys(errors).map((fieldName, i) => {
                var cls = classNames({
                    'alert': isclasses,
                    'alert-danger' : isclasses
                })
                if(errors[fieldName] && (errors[fieldName].length > 0) && (show === undefined || show.includes(fieldName))) {
                    return (
                        <div key={fieldName} className={cls} role="alert">{errors[fieldName]}</div>
                    )
                } else {
                    return ''
                }
            })}
        </div>
    )
}


const errorClass = (error) => {
    return (error.length === 0 ? '' : 'is-invalid')
};

export {
    Errors,
    errorClass
}