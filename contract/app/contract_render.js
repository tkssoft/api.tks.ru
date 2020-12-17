/* Структура html элементов */

import React from 'react'

const ContractAppRender = (props) => {
    const { isclasses, onTitle, onContent, onBottom } = props
    return (
        <div
            className={classNames({
                "contractapp": true,
                "h-100": isclasses
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