/* bootstrap utils */

import React from 'react'

const new_design = (isclasses) => {
    return true
}

const Row = (props) => {
    const { isclasses, children } = props
    if (new_design(isclasses)) {
        return (
            <div className="row">
                {children}
            </div>
        )
    }
    return children
}

const Column = (props) => {
    const { isclasses, children } = props
    if (new_design(isclasses)) {
        return (
            <div className="col">
                {children}
            </div>
        )
    }
    return children
}

export {
    Row,
    Column
}