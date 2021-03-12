/* Список с навигацией клавишами по информации из таблицы */

import React from 'react'
const keys = require('../../common/keys')

import classNames from 'classnames'
import { isFunction } from '../../common/utils'
import { debug } from '../../common/debug';

class TableList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selected: 0
        }
    }

    componentDidMount() {
        document.addEventListener('keyup', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.handleKeyPress);
    }

    handleKeyPress = (e) => {
        const { selected } = this.state
        const { data } = this.props
        if (e.keyCode === keys.VK_RETURN) {
            this.buttonClick(selected);
            e.preventDefault();
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

    itemClick(selected, rec, e) {
        this.setState({
            selected
        });
    }

    getcls (cls, addcls) {
        return classNames({
            [this.props.classPrefix || '' + '-' + cls]: true,
            [addcls]: !!addcls && this.props.isclasses
        })
    }

    render () {
        const { onTitle, onItemLink, onContentItem, data, className, onHref } = this.props
        return (
            <div className={this.getcls("Window", className)}>

                { isFunction(onTitle) && (
                    <div className={this.getcls("Title")}>
                        {onTitle(this.props)}
                    </div>
                ) }

                <div className={this.getcls("Content", "list-group w-100")} role="tablist">
                    {data.map((rec, i) => {
                        const active = i === this.state.selected ? "active" : "";
                        const linkclass = active ? 'text-white' : 'text-link'
                        return (
                            <div
                                className={this.getcls("ContentItem", "list-group-item list-group-item-action " + active)}
                                key={i}
                                onClick={this.itemClick.bind(this, i, rec)}
                            >
                                {isFunction(onContentItem) && onContentItem(rec, i)}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export {
    TableList
}