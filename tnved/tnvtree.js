/*
    Генерация дерева ТН ВЭД
*/

const React  = require('react');
const { debug } = require('../common/debug');
const { scrollIntoView } = require('../common/scrollview');
const keys = require('../common/keys');
import classNames from 'classnames';
import { ccs_class, ccs_contract } from '../common/ccs';
import { isNullStr } from '../common/utils';
import { IconCaretRightFill, IconCaretDownFill } from '../common/icons';
import { insertData, removeData, insertRoot, insertCode, DEFAULTID, LASTNEXTID } from './tnvtree_manager';


const formatdate = (d) => {
    return new Date(d).toLocaleDateString('ru-RU');
};


// Предупреждение о сроке действия кода
const DateWarning = ({ DBEGIN, DEND, isclasses }) => {
    const cls = classNames({
        [ccs_contract('treedate')]: true,
        'alert-danger': isclasses
    })
    let dates = [];
    if (DBEGIN) {
        dates.push(<span>с {formatdate(DBEGIN)}</span>);
    }
    if (DEND) {
        dates.push(<span>по {formatdate(DEND)}</span>);
    }
    if (dates.length > 0) {
        return (<div className={cls}>Код действует: {dates}.</div>);
    }
    return null;
};


const TreeItem = (props) => {
    let { CODE, TEXT, level, onCodeRender, onClick, activeRef, opened } = props;
    const cls = classNames(
        ccs_contract('treeitem'),
        ccs_contract('level-' + level),
        'list-group-item',
        'list-group-item-action',
        'no-border',
        'cursor-pointer',
        'display-flex align-start',
        {
            'active': props.active,
            'opened': opened
        }
    );
    // Разделение кода и текста
    const re = /^(РАЗДЕЛ.*)\.(.*)$/;
    const r = re.exec(TEXT);
    let clen = CODE.length;
    let is_part = false;
    if (r) {
        CODE = CODE || r[1];
        TEXT = r[2];
        clen = 0;
        is_part = true;
    };
    let clsname = 'text-bold ccs-contract-code-' + clen;
    let p = {};
    if (activeRef) {
        p.ref = activeRef;
    }
    return (
        <a className={cls} onClick={onClick} {...p}>
            {!isNullStr(CODE) ? (
                <>
                    <div className={classNames(ccs_contract('treecode'), clsname)}>
                        {CODE}
                    </div>
                    <div className={classNames(ccs_contract('treetext'), ccs_contract('text_with_code'), '')}>
                        <div>{TEXT}</div>
                        <DateWarning {...props}/>
                    </div>
                    {onCodeRender && onCodeRender(CODE, TEXT)}
                </>
            ) : (
                <div
                    className={
                        classNames(
                            ccs_contract('treetext'),
                            ccs_contract('text_only'),
                            {[ccs_contract('treebook')] : !is_part}
                        )
                    }
                >
                    {TEXT}
                </div>
            )}
        </a>
    );
};


class TnvTree extends React.Component {

    constructor (props) {
        super(props);
        this.eventname = this.props.is_up === true ? 'keyup' : 'keydown';
        this.selected = React.createRef();
        this.list = React.createRef();
        this.state = {
            items: [],
            selected: 0,
        };
        this.bindedHandle = this.handleKeyPress.bind(this)
    }

    setInitId (initid) {
        return this.insertRoot(initid).then(() => {
            console.log('focus');
            if (this.seleted.current) {
                this.selected.current.focus();
            }
        });
    }

    setSelected (selected) {
        this.setState({selected}, () => {
            if (this.props.onChange) {
                const node = this.state.items[selected];
                this.props.onChange(node);
            }
        });
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
            if (this.state.selected !== this.state.items.length - 1) {
                this.setSelected(this.state.selected + 1);
            }
        } else if (e.keyCode === keys.VK_UP) {
            // Стрелка вверх
            e.preventDefault();
            if (this.state.selected > 0) {
                this.setSelected(this.state.selected - 1);
            }
        }
    }

    opened = (node, index) => {
        if (index >= this.state.items.length - 1) {
            return false
        }
        return node.ID === this.state.items[index + 1].parentid;
    }

    get_index_by_code = (items, code) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].CODE === code) {
                return i;
            }
        };
        return 0;
    }

    get_index_by_id = (items, id) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].ID == id) {
                return i;
            }
        }
        return 0;
    }

    insertRoot(initid) {
        return insertRoot(initid)
            .then((items) => {
                this.setState({
                    items,
                    selected: this.get_index_by_id(items, initid)
                })
            });
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
            const container = this.props.container?.current || document.body;
            scrollIntoView(
                this.selected.current,
                container,
                this.getTopScrollMargin(),
                this.getBottomScrollMargin(),
                relative
            );
        }
    }

    itemClick(i, e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const node = this.state.items[i];
        if (node.CODE === null || node.CODE.length !== 10) {
            let p = null;
            let selected = 0;
            if (this.opened(node, i)) {
                p = removeData(this.state.items, node.ID, node.nextid);
                selected = i;
            } else {
                p = insertData(this.state.items, node.ID, i + 1, node.level + 1, node.nextid);
                selected = e===null? i + 1: i;
            };
            if (p) {
                p.then((items) => {
                    this.setState({
                        items,
                        selected
                    })
                });
            }
        } else if (node.CODE.length === 10) {
            if (this.props.onSelect) {
                this.props.onSelect(node.CODE, node.TEXT);
                if (this.props.onAfterSelect) {
                    this.props.onAfterSelect();
                }
            } else {
                this.setSelected(i);
            }
        }
    }

    render () {

        const { isclasses, className, onToolbar } = this.props

        const cls = classNames({
            'list-group': isclasses,
            [ccs_class('TnvTree')]: true,
            [className]: !!className
        })

        return (
            <>
            {onToolbar && onToolbar(this.props)}
            <div className={cls} role="tablist" ref={this.list} >
                {this.state.items.map((item, i) => {
                    const { ID, level } = item;
                    const active = i === this.state.selected ? "active" : '';
                    return (
                        <TreeItem
                            key={ID}
                            active={active}
                            onClick={this.itemClick.bind(this, i)}
                            activeRef={active ? this.selected : null}
                            opened={this.opened(item, i)}
                            {...this.props}
                            {...item}
                        />
                    )
                })}
            </div>
            </>
        )

    };

}

export {
    TnvTree
};
