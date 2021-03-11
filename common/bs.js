/* bootstrap utils */

import React from 'react'
import classNames from 'classnames'

const getcls = (cls, props) => {
    const { isclasses } = props
    return classNames({
        [cls]: isclasses
    })
}

const getcol = (props, cond) => {
    if (cond) {
        return getcls('col-sm', props)
    }
    return ''
}

const getcold = (props, cond, part) => {
    const { layout } = props
    if (layout) {
        if (part in layout) {
            return {
                ['col' + layout[part]]: cond
            }
        }
    }
    return {}
}

const Row = (props) => {
    const { children } = props
    return (
        <div className={getcls('row', props)}>
            {children}
        </div>
    )
}

const IifRow = (props) => {
    const { iif, children } = props
    if (iif) {
        return (
            <div className={getcls('row', props)}>
                {children}
            </div>
        )
    }
    return children
}

const HorzRow = (props) => {
    if (is_horz(props)) {
        return (
            <Row {...props}>
                {props.children}
            </Row>
        )
    }
    return props.children
}

const vert = 'vert'
const horz = 'horz'

const is_vert = (props) => {
    return props.orientation === vert
}

const is_horz = (props) => {
    return props.orientation === horz
}


const Column = (props) => {
    const { isclasses, children } = props
    if (is_horz(props)) {
        return (
            <div className={getcol(props)}>
                {children}
            </div>
        )
    }
    return children
}

export {
    Row,
    Column,
    getcls,
    getcold,
    is_horz,
    is_vert,
    HorzRow,
    IifRow
}