
import React from "react";
const { scrollIntoView } = require('./scrollview');

class List extends React.Component {

    constructor (props) {
        super(props);
        this.eventname = this.props.is_up === true ? 'keyup' : 'keydown';
        this.selected = React.createRef();
        this.list = React.createRef();
        this.state = {
            items: [],
            selected: 0,
            // Признак, что дерево открыто в центре
            center: false,
        };
        this.bindedHandle = this.handleKeyPress.bind(this)
    }

    setSelected (selected) {
        this.setState({selected}, () => {
            if (this.props.onChange) {
                const node = this.state.items[selected];
                this.props.onChange(node);
            }
        });
    }

    scroll (delta) {
        const container = this.get_container();
        if (container) {
            container.scrollTop += delta;
        }
    }

    handleKeyPress = (e) => {
        if (e.keyCode === keys.VK_BACK) {
            // Закрываем дерево на один уровень
        } else if (e.keyCode === keys.VK_RETURN) {
            e.preventDefault();
            this.itemClick(this.state.selected, null);
        } else if (e.keyCode === keys.VK_DOWN) {
            // Стрелка вниз
            e.preventDefault();
            if (this.state.selected < this.state.items.length - 1) {
                this.setSelected(this.state.selected + 1);
            } else {
                this.scroll(50);
            }
        } else if (e.keyCode === keys.VK_UP) {
            // Стрелка вверх
            e.preventDefault();
            if (this.state.selected > 0) {
                this.setSelected(this.state.selected - 1);
            } else {
                this.scroll(-50);
            }
        }
    }

    componentDidMount() {
        window.addEventListener(this.eventname, this.bindedHandle);
        return insertCode(this.props.code)
            .then((items) => {
                this.setState({
                    items,
                    selected: this.get_index_by_code(items, this.props.code)
                })
            });
    }

    componentWillUnmount() {
        window.removeEventListener(this.eventname, this.bindedHandle);
    }

    getBottomScrollMargin() {
        const { bottomScrollMargin=0 } = this.props;
        return bottomScrollMargin;
    }

    getTopScrollMargin() {
        const { topScrollMargin=0 } = this.props;
        return topScrollMargin;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        const container = document.body;
        return container.scrollTop;
    }

    get_container() {
        return this.props.container?.current || document.body;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot !== null) {
            const container = document.body;
            container.scrollTop = snapshot;
        };
        if (prevState.selected !== this.state.selected) {
            this.setSelected(this.state.selected);
        };
        // все компоненты обновлены
        if (this.selected.current !== null) {
            let relative = false;
            if (this.props.container !== undefined) {
                relative = true;
            }
            const container = this.get_container();
            scrollIntoView(
                this.selected.current,
                container,
                this.getTopScrollMargin(),
                this.getBottomScrollMargin(),
                relative,
                this.state.center
            );
        }
    }

    doItemClick(node) {

    }

    itemClick(i, e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const node = this.state.items[i];
        this.doItemClick(node);
    }

    render () {

        const { isclasses, className, onToolbar } = this.props

        const cls = classNames({
            'list-group': isclasses,
            [className]: !!className
        });

        return (
            <>
            {onToolbar && onToolbar(this.props)}
            <div className={cls} role="tablist" ref={this.list} >
                {this.state.items.map((item, i) => {
                    const active = i === this.state.selected ? "active" : '';
                    return this.props.onItem(item, i, active);
                })}
            </div>
            </>
        )

    };

}

export {
    List
}