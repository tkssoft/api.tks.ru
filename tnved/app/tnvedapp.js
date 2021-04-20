/* Примерное приложение с деревом ТН ВЭД и показом ставок / признаков по выбранному коду */


import React from 'react'
import classNames from 'classnames'

const TnvedApp = (props) => {

    const { isclasses } = props

    const cls = classNames({
        'ccs-tnvedapp': true    
    })

    return (
        <div className={cls}>
        </div>
    )

}

export {

    TnvedApp

}