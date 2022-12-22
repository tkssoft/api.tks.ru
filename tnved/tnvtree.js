/*Генерация дерева ТН ВЭД*/

const React  = require('react');
const { debug } = require('../common/debug');
const keys = require('../common/keys');
const { get_api_tks_ru } = require('../common/consts');

const format_id = (nodeid) => ('00000000' + nodeid.toString()).slice(-8);
const clientid = encodeURIComponent(calc_tks_ru_license.split('\n').join(''));


const get_tree_url = (nodeid) => `${get_api_tks_ru()}/tree.json/json/${clientid}/${nodeid}.json`;
const get_code_url = (code) => `${get_api_tks_ru()}/tree.json/json/${clientid}/search/?code=${code}`;

import classNames from 'classnames';
import { ccs_class, ccs_contract } from '../common/ccs';


const LASTNEXTID = 200000000;


const formatdate = (d) => {
    return new Date(d).toLocaleDateString('ru-RU');
}


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
}


const TreeItem = (props) => {
    const { CODE, TEXT } = props;
    if (CODE !== null) {
        let clsname = 'ccs-contract-code-' + CODE.length;
        return (
            <div className={'ccs-contract-treeitem w-100'}>
                <div className={'ccs-contract-treecode'}><span className={clsname}>{CODE}</span></div>
                <div className={'ccs-contract-treetext ccs-contract-text_with_code w-100'}>
                    <div>{TEXT}</div>
                    <DateWarning {...props}/>
                </div>
            </div>
        );
    } else {
        return (
            <div className={'ccs-contract-treeitem'}>
                <div className={'ccs-contract-treetext ccs-contract-text_only'}>{TEXT}</div>
            </div>
        );
    }
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
            initid: props.initid || 10,
            updatecount: 0,
        };
        this.bindedHandle = this.handleKeyPress.bind(this)
    }

    setInitId (initid) {
        this.setState({
            initid: initid || 10,
            items: []
        }, () => {
            this.insertRoot()
        })
    }

    insertAfterIndex = (index) => {
        const node = this.state.items[index];
        this.insertData(node.ID, index + 1, node.level + 1, node.nextid, index + 1);
    };

    removeAfterIndex = (index) => {
        const node = this.state.items[index];
        this.removeData(node.ID, node.nextid, index);
    };

    begin_update = (cb) => {
        this.setState({updatecount : this.state.updatecount + 1}, () => {
            if (cb !== undefined) {
                cb()
            }
        })
    }

    end_update = (cb) => {
        this.setState({updatecount : Math.max(this.state.updatecount - 1, 0)}, () => {
            if (!this.state.updatecount) {
                this.setSelected(this.state.selected)
                if (cb !== undefined) {
                    cb()
                }
            }
        })
    }

    setSelected (selected) {
        this.setState({selected}, () => {
            if (this.props.onChange) {
                const node = this.state.items[selected]
                this.props.onChange(node)
            }
        })
    }

    handleKeyPress = (e) => {
        if (this.state.updatecount === 0) {
            if (e.keyCode === keys.VK_BACK) {
                // Закрываем дерево на один уровень
            } else if (e.keyCode === keys.VK_RETURN) {
                this.itemClick(this.state.selected, null);
                e.preventDefault();
            } else if (e.keyCode === keys.VK_DOWN) {
                // Стрелка вниз
                if (this.state.selected !== this.state.items.length - 1) {
                    this.setSelected(this.state.selected + 1)
                }
                e.preventDefault();
            } else if (e.keyCode === keys.VK_UP) {
                // Стрелка вверх
                if (this.state.selected > 0) {
                    this.setSelected(this.state.selected - 1)
                }
                e.preventDefault();
            }
        }
    };

    insertData = (id, index, level, nextid, selected) => {
        let that = this
        this.begin_update(() => {
            this.loadData(format_id(id)).then((data) => {
                let rest = that.state.items.slice(index, that.state.items.length);
                let prior = null;
                let next = null;
                let sel = selected;
                let nextindex = 0;
                let found = false;
                that.setState({
                    items: data.reduce((obj, item) => {
                        if (prior !== null) {
                            prior.nextid = item.ID;
                            if (next !== null && that.state.initid > prior.nextid) {
                                next = null;
                            }
                        }
                        prior = {...item, parentid: id, level: level, nextid: nextid};
                        nextindex = obj.push(prior);
                        if (id !== that.state.initid) {
                            if (prior.ID === that.state.initid) {
                                sel = nextindex - 1;
                                found = true;
                            } else if (that.state.initid > prior.ID && that.state.initid < prior.nextid) {
                                next = {
                                    ...prior,
                                    parentindex: nextindex
                                }
                            }
                        }
                        return obj
                    }, that.state.items.slice(0, index)).concat(rest),
                    selected: sel
                }, () => {
                    if (next !== null && !found) {
                        that.insertData(next.ID, next.parentindex, next.level + 1, next.nextid, next.parentindex);
                    } else {
                        const node = that.state.items[that.state.selected];
                    }
                })
            }).then(() => {that.end_update()}).catch(() => {that.end_update()})
        })
    };

    removeData = (startid, endid, index) => {
        let that = this
        this.begin_update(() => {
            that.setState({
                items: that.state.items.filter((item) => {
                    return !(item.ID > startid && item.ID < endid)
                }),
                selected: index
            }, () => {this.end_update()})
        })
    };

    opened = (node, index) => {
        if (index >= this.state.items.length - 1) {
            return false
        }
        return node.ID === this.state.items[index + 1].parentid;
    };

    insertRoot() {
        this.insertData(10, 0, 0, LASTNEXTID, 0);
    }

    componentDidMount() {
        window.addEventListener(this.eventname, this.bindedHandle);
        if (![undefined, ''].includes(this.props.code)) {
            this.getCodeID(this.props.code).then((data) => {
                this.setInitId(data.length > 0 ? data[0].ID : this.state.initid)
            })
        } else {
            this.insertRoot()
        }
    }

    componentWillUnmount() {
        window.removeEventListener(this.eventname, this.bindedHandle);
    }

    getBottomScrollMargin() {
        const { bottomScrollMargin=0 } = this.props
        return bottomScrollMargin
    }

    getTopScrollMargin() {
        const { topScrollMargin=0 } = this.props
        return topScrollMargin
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.updatecount) {
            // все компоненты обновлены
            if (this.selected.current !== null) {
                if (this.list.current !== null) {
                    let rootelement = this.list.current.parentElement.parentElement
                    let rootrect = rootelement.getBoundingClientRect();
                    let currect = this.selected.current.getBoundingClientRect();
                    const rbottom = Math.min(window.innerHeight - this.getBottomScrollMargin(), rootrect.bottom)
                    const rtop = Math.max(this.getTopScrollMargin(), rootrect.top)
                    if (currect.bottom <= rbottom && currect.top >= rtop) {
                        return
                    }
                };
                if (prevState.selected < this.state.selected) {
                    this.selected.current.scrollIntoView({block: "end", behavior: "instant"});
                } else {
                    this.selected.current.scrollIntoView({block: "start", behavior: "instant"});
                }
            }
        }
    }

    loadData = (nodeid) => {
        const url = get_tree_url(nodeid);
        const starttime = Date.now();
        return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(response.statusText)
                }
            })
            .then((data)=>{
                //debug(`fetch time is: ${(Date.now() - starttime) / 1000} sec`)
                return data
            })
    };

    getCodeID = (code) => {
        const url = get_code_url(code);
        return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(response.statusText)
                }
            })
    };

    itemClick(i, e) {
        const node = this.state.items[i];
        if (node.CODE === null || node.CODE.length !== 10) {
            if (this.state.updatecount === 0) {
                if (this.opened(node, i)) {
                    this.removeData(node.ID, node.nextid, i);
                } else {
                    this.insertData(node.ID, i + 1, node.level + 1, node.nextid, e===null? i + 1: i);
                }
            }
        } else if (node.CODE.length === 10) {
            if (this.props.onSelect) {
                this.props.onSelect(node.CODE, node.TEXT);
                if (this.props.onAfterSelect) {
                    this.props.onAfterSelect()
                }
            } else {
                this.setSelected(i)
            }
        }
    }

    itemDoubleClick(i, e) {
    }

    render () {

        const { isclasses, className } = this.props

        const cls = classNames({
            'list-group': isclasses,
            [ccs_class('TnvTree')]: true,
            [className]: !!className
        })

        return (
            <div className={cls} role="tablist" ref={this.list} >
                {this.state.items.map((item, i) => {
                    const { ID, level } = item;
                    const active = i === this.state.selected ? "active" : "";
                    let style = {};
                    if (level > 0) {
                        style.paddingLeft = `${level*3}em`
                    }
                    return (
                        <a className={"list-group-item list-group-item-action " + active}
                           key={ID}
                           style={style}
                           href="#"
                           onClick={this.itemClick.bind(this, i)}
                           ref={active ? this.selected : ""}
                        >
                            <div className={"row"}>
                                <TreeItem {...this.props} {...item} />
                            </div>
                        </a>
                    )
                })}
            </div>
        )

    };

}

module.exports = TnvTree;
