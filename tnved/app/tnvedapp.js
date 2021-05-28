/* Примерное приложение с деревом ТН ВЭД и показом ставок / признаков по выбранному коду */

import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { Row } from '../../common/bs'
import TnvTree from '../tnvtree'
import { isEmptyAll, isEmpty } from '../../common/utils'
import { ShowSt } from '../showst'
import { getTreeData } from '../tnved_search'

const ShowStWindow = (props) => {
    const { code, data, isclasses } = props
    return (
        <div className="ccs-codeinfo">
            {code.length < 10 && (
                <div>Для просмотра информации по коду, выберете полный код</div>
            )}
            {code.length === 10 && !isEmptyAll(data) && (
                <ShowSt
                    typ={0}
                    data={data.TNVED}
                    tnved={data}
                    G33={code}
                    G312={data.KR_NAIM}
                    G34={'643'}
                    skipName={false}
                    skipIfEmpty={false}
                    prButtonLabel='Варианты'
                    isclasses={isclasses}
                    expertmode={true}
                />
            )}
        </div>
    )
}

const NavToolbar = (props) => {

    const { isclasses, onSearchResults } = props
    const [ value, setValue ] = useState('')
    const [ search, setSearch ] = useState('')

    useEffect(() => {
        if (search) {
            getTreeData(search).then((data) => {
                console.log(data)
                onSearchResults(data)
            })
        }
    }, [search])

    return (
        <div className="header title toolbar">
            <div className="searchbox form-group">
                <input
                    className="form-control-sm"
                    value={value}
                    type="text"
                    placeholder="Введите текст..."
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                />
                <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                        setSearch(value)
                    }}
                >
                        Поиск
                </button>
            </div>
        </div>
    )
}

const TnvedApp = (props) => {

    const { isclasses, manager } = props

    const cls = classNames({
        'ccs-tnvedapp': true,
        'main': true,
        'container': isclasses
    })

    const [ current, setCurrent ] = useState()
    const [ data, setData ] = useState({})

    const tree = useRef(null)

    const notvalid = isEmptyAll(current) || isEmptyAll(current.CODE) || (current.CODE.length !== 10)
    const code = notvalid ? '' : current.CODE

    useEffect(() => {
        if (code && data.CODE !== code) {
            manager.getData(code).then((data) => {
                setData(data)
            })
        }
    })

    return (
        <>
            <NavToolbar
                onSearchResults={(result) => {
                    if (result.length > 0) {
                        const first = result[0]
                        tree.current.setInitId(first.ID)
                    }
                }}
                {...props}
            />
            <div className={cls}>
                <Row className='' {...props}>
                    <div className="col-sm-8">
                        <TnvTree
                            className=""
                            onChange={(node) => {
                                setCurrent(node)
                            }}
                            bottomScrollMargin={100}
                            topScrollMargin={60}
                            initid={2074000 || 10}
                            ref={tree}
                            {...props}
                        />
                    </div>
                    <div className="col-sm-4">
                        <ShowStWindow
                            code={code}
                            data={data}
                            {...props}
                        />
                    </div>
                </Row>
            </div>
        </>
    )
}

export {

    TnvedApp

}