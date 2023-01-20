/* Примерное приложение с деревом ТН ВЭД и показом ставок / признаков по выбранному коду */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { Row } from '../../common/bs';
import TnvTree from '../tnvtree';
import { isEmptyAll, isEmpty } from '../../common/utils';
import { useEventListener } from '../../common/hooks';
import { ShowSt } from '../showst';
import { getTreeData } from '../tnved_search';
import { tnved_manager } from '../tnved_manager';

import { HeightObserver } from '../../common/mimic';

const ShowStWindow = (props) => {
    const { code, data, isclasses, windowclassName, typ=0 } = props
    return (
        <div className="ccs-codeinfo">
            {code.length < 10 && (
                <div>Для просмотра информации по коду, выберете полный код</div>
            )}
            {code.length === 10 && !isEmptyAll(data) && (
                <ShowSt
                    typ={typ}
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
                    windowclassName={windowclassName}
                />
            )}
        </div>
    )
}

const event_searchresults = 'tnvsearchresults';

const fire_result_event = (data) => {
    let tnvsearchresults = new CustomEvent(event_searchresults, {
        detail: {
            results: data,
        }
    });
    document.dispatchEvent(tnvsearchresults);
};


function FocusedInput(props) {
    const ref = useRef();
    const [hasFocus, setFocus] = useState(false);

    useEffect(() => {
        if (document.hasFocus() && ref.current.contains(document.activeElement)) {
            setFocus(true);
        }
    }, []);

    return (
        <input
            {...props}
            ref={ref}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
        />
    );
};


const TnvSearchForm = (props) => {

    const { isclasses, onSearchResults, code } = props
    const [ value, setValue ] = useState(code || '')
    const [ search, setSearch ] = useState('')

    useEffect(() => {
        if (search) {
            console.log('setSearch', search);
            getTreeData(search).then((data) => {
                if (onSearchResults) {
                    onSearchResults(data)
                } else {
                    fire_result_event(data)
                }
            })
        }
    }, [search]);

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setSearch(value);
        }
    };

    return (
        <form className="mt-2 mt-md-0 form-inline mb-md-0">
            <input
                className="form-control-sm mr-sm-2"
                type="text"
                placeholder="Введите код..."
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
                onKeyDown={ handleEnter }
            />
            <button
                className="btn btn-sm btn-outline-success my-2 my-sm-0"
                onClick={(e) => {
                    e.preventDefault();
                    setSearch(value);
                }}
            >
                Поиск
            </button>
        </form>
    )
}


const NavMenu = (props) => {
    return (
        <nav className="navbar navbar-expand-sm header navbar-light">
            <a className="navbar-brand" href="#">ТКС СОФТ</a>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#appNavbar"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="appNavbar">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <TnvSearchForm />
                    </li>
                </ul>
            </div>
        </nav>
    );
}

const TnvedApp = (props) => {

    const { isclasses, manager, search, header_css, footer_css } = props

    if (!manager) {
        manager = new tnved_manager({})
    }

    const cls = classNames({
        'ccs-tnvedapp': true,
        'container': isclasses
    })

    const [ current, setCurrent ] = useState()
    const [ data, setData ] = useState({})

    const tree = useRef(null)

    const notvalid = isEmptyAll(current) || isEmptyAll(current.CODE) || (current.CODE.length !== 10)
    const code = notvalid ? '' : current.CODE

    const searchresults_handler = useCallback(
        (customevent) => {
            const result = customevent.detail.results;
            console.log('searchresults_handler', result);
            if (result.length > 0) {
                const first = result[0];
                tree.current.setInitId(first.ID);
            } else {
                // ToDo: сделать модульное окно с инфомацией об ошибке.
                alert('Внимание! Информация по коду не найдена.');
            }
        },
        [ setCurrent ]
    );

    useEffect(() => {
        if (code && data.CODE !== code) {
            manager.getData(code).then((data) => {
                setData(data)
            })
        }
    })

    useEventListener(event_searchresults, searchresults_handler, document);

    return (
        <>
        {search && (<NavMenu />)}
        <div className={cls}>
            <Row className='scrollroot' {...props}>
                <div className="col-sm-8">
                    <HeightObserver element_css={header_css}/>
                    <TnvTree
                        className="ccs-scroll-container"
                        onChange={(node) => {
                            setCurrent(node)
                        }}
                        initid={2074000 || 10}
                        ref={tree}
                        topScrollMargin={160}
                        bottomScrollMargin={160}
                        {...props}
                    />
                    <HeightObserver element_css={footer_css}/>
                </div>
                <div className="col-sm-4">
                    <ShowStWindow
                        typ='1'
                        code={code}
                        data={data}
                        windowclassName={'tnvedapp-prim-window'}
                        {...props}
                    />
                </div>
            </Row>
        </div>

        </>
    )
}

export {

    TnvedApp,
    TnvSearchForm

}