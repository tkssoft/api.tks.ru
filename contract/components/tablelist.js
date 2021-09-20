/* Список с навигацией клавишами по информации из таблицы */

import React from 'react'
const keys = require('../../common/keys')

import classNames from 'classnames'
import { isFunction } from '../../common/utils'
import { debug } from '../../common/debug'
import NativeListener from 'react-native-listener'


const  getcls = (props, cls, addcls) => {
    const { classPrefix, isclasses } = props
    return classNames({
        [classPrefix + '-' + cls]: true,
        [addcls]: !!addcls && isclasses
    })
}

class TableList extends React.Component {
    constructor (props) {
        super(props)
        this.selected = React.createRef()
        this.list = React.createRef()
        this.state = {
            selected: this.props.itemindex !== undefined ? parseInt(this.props.itemindex) : 0
        }
    }

    focus() {
        if (this.list.current && !this.props.nofocus) {
            this.list.current.focus()
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selected !== this.state.selected) {
            if (this.selected.current !== null) {
                if (this.props.onListChange) {
                    this.props.onListChange(this.state.selected)
                }
                if (this.list.current !== null) {
                    let listrect = this.list.current.getBoundingClientRect();
                    let currect = this.selected.current.getBoundingClientRect();
                    if (currect.bottom <= listrect.bottom && currect.top >= listrect.top) {
                        return
                    }
                }
                if (prevState.selected < this.state.selected) {
                    this.selected.current.scrollIntoView({block: "end", behavior: "instant"});
                } else {
                    this.selected.current.scrollIntoView({block: "start", behavior: "instant"});
                }
            }
        }
    }

    handleKeyPress = (e) => {
        const { selected } = this.state
        const { data } = this.props
        if (e.keyCode === keys.VK_RETURN) {
            this.buttonClick(selected, data[selected]);
            e.preventDefault()
        } else if (e.keyCode === keys.VK_DOWN) {
            // Стрелка вниз
            if (selected !== data.length - 1) {
                this.setState({selected: selected + 1});
            }
            e.preventDefault();
        } else if (e.keyCode === keys.VK_UP) {
            // Стрелка вверх
            if (selected > 0) {
                this.setState({selected: selected - 1})
            }
            e.preventDefault();
        }
    };

    buttonClick(selected, rec, e) {
        const { onSelect } = this.props
        if (onSelect) {
            onSelect(rec, selected)
        }
    }

    itemClick(selected, rec, e) {
        const { onChange } = this.props
        this.setState({
            selected
        }, ()=>{
            if (onChange) {
                onChange(rec, selected)
            }
        });
    }

    render () {
        const { onTitle, onItemLink, onContentItem, data, className, onHref } = this.props
        return (
            <NativeListener stopKeyDown onKeyDown={this.handleKeyPress.bind(this)}>
            <div className={getcls(this.props, "Window", className)}>

                { isFunction(onTitle) && (
                    <div className={getcls(this.props, "Title")}>
                        {onTitle(this.props)}
                    </div>
                ) }

                <div className={getcls(this.props, "Content", "list-group w-100")} tabIndex={-1} role="tablist" ref={this.list}>
                    {data.map((rec, i) => {
                        const active = i === this.state.selected ? "active" : "";
                        const linkclass = active ? 'text-white' : 'text-link'
                        return (
                            <div
                                className={getcls(this.props, "ContentItem", "list-group-item list-group-item-action " + active)}
                                key={i}
                                onClick={this.itemClick.bind(this, i, rec)}
                                onDoubleClick={this.buttonClick.bind(this, i, rec)}
                                ref={active ? this.selected : ""}
                            >
                                {isFunction(onContentItem) && onContentItem(rec, i)}
                            </div>
                        )
                    })}
                </div>
            </div>
            </NativeListener>
        )
    }
}

const ArrayList = (props) => {
    const { className, onContentItem, data } = props
    const cls = classNames({
        [className]: !!className,
        [getcls(props, "Content", "list-group w-100")]: true
    })
    return (
        <ul className={cls} role="tablist">
        {data.map((rec, i) => {
            return (
                <li
                    className={getcls(props, "ContentItem", "list-group-item")}
                    key={i}
                >
                    {isFunction(onContentItem) && onContentItem(rec, i)}
                </li>
            )
        })}
        </ul>
    )
}

export {
    TableList,
    ArrayList
}