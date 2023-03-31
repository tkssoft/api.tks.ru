/* goods api */

const React  = require('react');
const { debug } = require('../common/debug');
const { get_api_tks_ru } = require('../common/consts');
const { List } = require('../common/list');
const { SearchForm } = require('./searchform');
import { Row } from '../common/bs';
import classNames from 'classnames';


const fetch_url = (url) => {
    return fetch(url).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            let err = new Error(response.statusText);
            err.code = response.status;
            throw err
        }
    })
}


/*
* Информация по наименованию с группировкой по кодам без разбивки по страницам
* */
const fetch_goods_codes = (g312) => {
    debug('fetch_goods_codes', g312);
    const clientid = encodeURIComponent(calc_tks_ru_license.split('\n').join(''));
    const name = encodeURI(g312);
    const url = `${get_api_tks_ru()}/goods.json/json/${clientid}/?searchstr=${name}&group=code`;
    return fetch_url(url);
}

/*
* Информация по наименованию и коду без разбивки по страницам
* */
const fetch_goods_code = (g312, code) => {
    debug('fetch_goods_code', g312, code);
    const clientid = encodeURIComponent(calc_tks_ru_license.split('\n').join(''));
    const name = encodeURI(g312);
    const url = `${get_api_tks_ru()}/goods.json/json/${clientid}/?searchstr=${name}&code=${code}`
    return fetch_url(url);
}


const format_code = (code) => {
    const group = code.substr(0, 4);
    const subgroup = code.substr(4, 2);
    const acode = code.substr(6, 3);
    const subcode = code.substr(9, 1);
    return `${group} ${subgroup} ${acode} ${subcode}`
}

const mark_word = (name, word) => {
    let query = new RegExp("(" + word + ")", "gim");
    return name.replace(query, "<mark>$1</mark>");
}

const format_search = (n, text, groupitem) => {
    let name = this.modify_name(n)
    if (groupitem) {
        return name
    }
    let a = text.split(/\s+/)
    return a.reduce((name, word) => {
        return mark_word(name, word)
    }, name)
}

const GoodsResults = (props) => {
    const { G312 } = props;
    return (
        <GoodsResultList {...props} onItem={(item, i, active) => {
            const {CODE, KR_NAIM, CNT, loading, groupitem, opened} = item;
            const active = active ? "active" : "";
            const classname = groupitem ? 'ccs-contract-goodsitem-groupitem' : 'ccs-contract-goodsitem-codeitem';
            const linkclass = active ? 'text-white' : 'ccs-contract-text-link';
            {groupitem ? (
                <a
                    href="#"
                    className={'ccs-contract-strong ccs-contract-goodsitem-code text-nowrap ' + linkclass}
                >
                    {format_code(CODE)}
                </a>
            ): (
                <div className={'ccs-contract-strong ccs-contract-goodsitem-code text-nowrap '}>&nbsp;</div>
            )}
            <div className="ccs-contract-goodsitem-name "
                 dangerouslySetInnerHTML={{__html: format_search(KR_NAIM, G312, groupitem)}}>
            </div>
            {groupitem ? (
                <a href="#" className={'ccs-contract-strong ccs-contract-goodsitem-cnt ccs-contract-leftjustified ' + linkclass}
                   onClick={this.openButtonClick.bind(this, i, opened)}
                >{this.calc_prob(CNT, this.state.groupitemcount)}</a>
            ): (
                <div className={'ccs-contract-strong ccs-contract-goodsitem-cnt ccs-contract-leftjustified '}>&nbsp;</div>
            )}

        }}/>
    )
}


class GoodsResultList extends List {

    fetchData = (g312, pageno) => {
        return fetch_goods_codes(g312)
    }

    loadData = (pageno, cb, removelast) => {
        if (this.state.G312.length === 0) {
            this.setState({
                loading: false,
                page: 1,
                data: [],
                hm: 0,
                groupitemcount: 0
            }, cb())
        } else {
            return this.fetchData(this.state.G312, pageno).then((data) => {
                let newdata = removelast? [...this.state.data.slice(0, -1)]: [...this.state.data];
                let groupitemcount = 0;
                if (data.data !== undefined) {
                    newdata = data.data.reduce((arr, rec, index) => {
                        arr.push({
                            ...rec,
                            opened: false,
                            groupitem: true,
                            parentindex: index
                        })
                        groupitemcount = groupitemcount + rec.CNT
                        return arr
                    }, newdata)
                }
                this.setState({
                    ...data,
                    page: data.page === undefined ? 1 : parseInt(data.page),
                    data: newdata,
                    groupitemcount: groupitemcount,
                }, () => {
                    cb()
                })
            })
        }
    }

    get_recordcount = (state) => {
        if (state.hm) {
            return state.hm
        } else {
            if (state.data !== undefined && state.data.length > 0) {
                return state.data.length
            }
        }
        return 0
    }

    processing (params) {
        if (this.props.onProcessing) {
            this.props.onProcessing(params);
        }
    }

    stateUpdated(props, state, source) {
        const { pending, loading, skipitems, itemindex } = this.state;
        const hm = this.get_recordcount(this.state);
        if (state.loading !== this.state.loading || this.get_recordcount(state) !== hm) {
            this.processing({
                loading: loading,
                hm: hm
            })
        }
        if (pending || props.G312 !== this.state.G312) {
            this.setState({pending: false, loading: true, data: []}, () => {
                this.loadData(1, ()=> {
                    this.setState({
                        loading: false,
                        itemindex: 0
                    }, () => {
                    })
                })
            })
        } else if (itemindex && itemindex >= hm) {
            this.setState({itemindex: hm - 1})
        } else if (!loading && skipitems) {
            if (skipitems !== 0) {
                let newindex = itemindex + skipitems;
                if (newindex < 0) {
                    newindex = 0
                } else if (newindex >= this.state.data.length) {
                    newindex = this.state.data.length - 1
                }
                this.setState({skipitems: 0, itemindex: newindex})
            }
        }
    }

    handleKeyPress = (e) => {
        if (e.keyCode === keys.VK_RETURN) {
            let rec = this.state.data[this.state.itemindex]
            if (rec) {
                if (rec.codeitem) {
                    this.buttonClick(this.state.itemindex, null);
                    e.preventDefault();
                } else if (rec.groupitem) {
                    if (rec.opened) {
                        this.collapseItem(this.state.itemindex)
                        e.preventDefault();
                    } else {
                        this.expandItem(this.state.itemindex);
                        e.preventDefault();
                    }
                }
            }
        } else if (e.keyCode === keys.VK_DOWN) {
            // Стрелка вниз
            this.setState({skipitems: 1});
            e.preventDefault();
        } else if (e.keyCode === keys.VK_UP) {
            // Стрелка вверх
            this.setState({skipitems: -1});
            e.preventDefault();
        } else if (e.keyCode === keys.VK_NEXT) {
            // Стрелка вниз
            this.setState({skipitems: 10});
            e.preventDefault();
        } else if (e.keyCode === keys.VK_PRIOR) {
            // Стрелка вверх
            this.setState({skipitems: -10});
            e.preventDefault();
        } else if (e.keyCode === keys.VK_RIGHT && e.ctrlKey) {
            this.expandItem(this.state.itemindex);
            e.preventDefault();
        } else if (e.keyCode === keys.VK_LEFT && e.ctrlKey) {
            this.collapseItem(this.state.itemindex)
            e.preventDefault();
        } else if (e.keyCode === keys.VK_BACK && e.ctrlKey) {
            this.collapseItem(this.state.itemindex)
            e.preventDefault();
        }
    };

    insertGroupData = (itemindex, parentindex, pageno, code, cb) => {
        const d = this.state.data
        fetch_goods_code(this.state.G312, code).then((data) => {
            if (data.data !== undefined) {
                let first = d.slice(0, itemindex)
                let rest = d.slice(itemindex + 1, d.length)
                first[itemindex - 1].opened = true
                let newdata = data.data.reduce((arr, rec) => {
                    arr.push({
                        ...rec,
                        codeitem: true,
                        parentindex: parentindex
                    })
                    return arr
                }, first).concat(rest)
                this.setState({
                    data: newdata,
                    itemindex: itemindex
                }, cb)
            }
        })
    }

    insertItem = (i, parentindex, cb) => {
        const d = this.state.data
        const data = [{
            loading: true,
            codeitem: true
        }]
        let rest = d.slice(i + 1, d.length)
        let newdata = data.reduce((arr, rec) => {
            arr.push({
                ...rec,
                codeitem: true,
                parentindex: parentindex
            })
            return arr
        }, d.slice(0, i + 1)).concat(rest)
        this.setState({
            data: newdata,
            itemindex: i + 1
        }, cb)
    }

    expandItem = (i, cb) => {
        const rec = this.state.data[i];
        if (!rec.codeitem && !rec.opened) {
            const code = rec.CODE;
            this.insertItem(i, i, () => {
                this.insertGroupData(i + 1, i, 1, code, cb)
            })
        }
    }

    collapseItem = (i, cb) => {
        const rec = this.state.data[i];
        const parentindex = rec.parentindex
        let data = this.state.data.reduce((arr, rec) => {
            if (rec.groupitem) {
                arr.push({
                    ...rec,
                    opened: false
                })
            }
            return arr
        }, [])
        this.setState({
            data: data,
            itemindex: parentindex
        }, cb)
    }

    modify_name = (name) => {
        let query = new RegExp("([\.\,\;\:\-])", "gim");
        return name.replace(query, "$1 ");
    }

    round(value) {
        return Math.round((value + 0.00001) * 100) / 100
    }

    calc_prob(cnt, total) {
        let r = this.round(100* cnt / total)
        if (r === 0) {
            return 'низкая'
        }
        return r.toFixed(2)
    }

    render () {
        return (
            <>
                {this.props.onInfo && this.props.onInfo(this.props)}
                <div className={"list-group ccs-contract-goodsrow ccs-contract-goodscontent w-100"} role="tablist" ref={this.list} onClick={() => {}}>
                    {this.state.data.map((item, i) => {
                        return (
                            <div className={"list-group-item list-group-item-action ccs-contract-goods-list-group-item no-border" + active + ' ccs-contract-goodsitem ' + classname}
                               key={i}
                               href="#"
                               onClick={this.itemClick.bind(this, i)}
                               onDoubleClick={this.buttonClick.bind(this, i)}
                               ref={active ? this.selected : ""}
                            >
                                {!loading ?
                                    (
                                        <>
                                        </>
                                    ) : (
                                        <div className={'ccs-contract-goodsitem-loading'}>
                                            <Loading className={'ccs-contract-goods-loading'} type={"cylon"} color={"black"}/>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }
}


const GoodsSearchForm = (props) => {
    const { onSearchResults } = props;
    return (
        <SearchForm
            onSearch={(search) => {
                fetch_goods_codes(search).then((data) => {
                    onSearchResults(search, data);
                })
            }}
            {...props}
        />
    )
}


const GoodsSelect = (props) => {
    const { isclasses } = props;
    const [data, setData] = useState({
        data: [],
        G312: ''
    });
    const cls = classNames({
        'ccs-contract-goodsbox': true,
        'container-fluid': isclasses
    });

    const treecls = classNames({
        'col' : isclasses
    });

    return (
        <div className={cls}>
            <Row className="row position-sticky top-0 z-5 background-color-light">
                <div className="col-md">
                    <GoodsSearchForm
                        onSearchResults={(search, data) => {
                            setData({
                                data: data,
                                G312: search
                            });
                        }}
                    />
                </div>
            </Row>
            <Row className='scrollroot' {...props}>
                <GoodsResults G312={data.G312} items={data.data} />
            </Row>
        </div>
    )
}

class GoodsSelect1 extends React.Component {

    constructor (props) {
        super(props);
        this.timeout = 0;
        this.delay = 1000;
        this.state = {
            G312 : '',
            search_string: '',
            pending : false,
            delayed : false,
            loading : false,
            hm: 0,
        }
    }

    doG312change = (e) => {
        this.setState({G312 : e.target.value}, () => {
            this.setDelayedState({search_string: this.state.G312})
        })

    };

    setDelayedState(state) {
        const { timeout } = this;
        if (timeout) {
            clearTimeout(timeout);
        }
        this.timeout = setTimeout(() => {
            this.setState({
                ...state,
            })
        }, this.delay)
    }

    processing = (state) => {
        this.setState({...state})
    }

    render () {
        console.log(this.props.onInfo);
        return (
            <div className={'ccs-contract-goodsbox'}>
                <GoodsResult
                    G312={this.state.search_string}
                    onSelect={this.props.onSelect}
                    onAfterSelect={this.props.onAfterSelect}
                    onProcessing={this.processing}
                    onInfo={this.props.onInfo}
                />
            </div>
        )
    }
}


export {
    GoodsSelect,
    GoodsResult
}