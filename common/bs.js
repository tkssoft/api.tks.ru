/* bootstrap utils */

import React from 'react'
import classNames from 'classnames'

const getcls = (cls, props) => {
    const { isclasses, className } = props
    return classNames({
        [cls]: isclasses,
        [className]: !!className
    })
}

const getcol = (props, cond) => {
    if (cond) {
        return getcls('col-sm', props)
    }
    return ''
}

const getcold = (props, cond, part) => {
    const { layout } = props;
    if (layout) {
        if ((part in layout) && layout[part]) {
            return {
                ['col' + layout[part]]: cond
            }
        }
    }
    return {}
}

const Row = (props) => {
    const { children, alignCenter } = props
    const cls = classNames({
        'row': true,
        'align-items-center': alignCenter
    })
    return (
        <div className={getcls(cls, props)}>
            {children}
        </div>
    )
}

const IfRow = (props) => {
    const { iif, children, type, alignCenter } = props
    if (iif) {
        const cls = classNames({
            'row': true,
            'align-items-center': alignCenter
        })
        return (
            <div className={getcls(cls, props)}>
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

const get_layout_config = (group, label, input, button) => {
    return {
        group, label, input, button
    }
}

export {
    Row,
    Column,
    getcls,
    getcold,
    is_horz,
    is_vert,
    HorzRow,
    IfRow,
    get_layout_config
}