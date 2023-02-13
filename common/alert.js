import React from 'react';
import classNames from 'classnames';
import { ccs_class } from './ccs';

const Alert = ({ isclasses, type, children }) => {
    const cls = classNames({
        'alert': isclasses,
        'mb-0': isclasses,
        [`alert-${type}`]: isclasses,
    });
    return (
        <div className={classNames({[ccs_class('Info')]: true, 'row': isclasses})}>
            <div className={classNames({'col': isclasses})}>
                <div className={cls} role="alert">{children}</div>
            </div>
        </div>
    )
}

const AlertDanger = ({ isclasses, children }) => {
    return (<Alert isclasses={isclasses} type={'danger'}>{children}</Alert>);
}

export {
    Alert,
    AlertDanger
}

