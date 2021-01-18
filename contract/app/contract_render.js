/* Структура html элементов */

import React from 'react'
import classNames from 'classnames'

const ContractAppRender = (props) => {
    const { isclasses, onTitle, onContent, onBottom } = props
    return (
        <div
            className={classNames({
                "ccs-contract": true
            })}
        >
            {/* Данные в заголовке */}
            <div
                className={classNames({
                    "contractapp-title": true,
                    "p-3": isclasses
                })}
            >
                { onTitle && onTitle(props) }
            </div>
            <div className="contractapp-content">
                { onContent && onContent(props) }
            </div>
            {/* Данные внизу страницы */}
            <div
                className={
                    classNames({
                        "contractapp-bottom": true,
                        "p-3": isclasses
                    })
                }
            >
                { onBottom && onBottom(props) }
            </div>
        </div>
    )
}

export {
    ContractAppRender
}