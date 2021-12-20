import React from 'react';
import classNames from 'classnames';
import { ccs_class } from './ccs';

const Alert = ({ isclasses, type, children }) => {
    const cls = classNames({
        'alert': isclasses,
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

export {
    Alert
}

