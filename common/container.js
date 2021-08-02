/* Базовый контейнер для приложений */

import React from 'react';
import classNames from 'classnames';

const ScrollContainer = (props) => {
    const { isclasses, children } = props

    const cls = classNames({
        'container': isclasses,
        'ccs-scroll-container': true,
    })

    return (
        <div className={cls}>
            { children }
        </div>
    )

}

export {
    ScrollContainer
}