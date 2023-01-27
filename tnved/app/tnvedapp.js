/* Примерное приложение с деревом ТН ВЭД и показом ставок / признаков по выбранному коду */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { Row } from '../../common/bs';
import TnvTree from '../tnvtree';
import { isEmptyAll, isEmpty } from '../../common/utils';
import { useEventListener } from '../../common/hooks';
import { ShowSt } from '../showst';
import { tnved_manager } from '../tnved_manager';
import { debug } from '../../common/debug';
import { HeightObserver } from '../../common/mimic';
import { event_searchresults } from '../searchform';

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


const TnvedApp = (props) => {

    const { isclasses, manager, search, header_css, footer_css, onSearchResults, stavkas } = props;

    if (!manager) {
        manager = new tnved_manager({});
    }

    const cls = classNames({
        'ccs-tnvedapp': true,
        'container': isclasses
    });

    const [ current, setCurrent ] = useState();
    const [ data, setData ] = useState({});

    const tree = useRef(null);

    const notvalid = isEmptyAll(current) || isEmptyAll(current.CODE) || (current.CODE.length !== 10);
    const code = notvalid ? '' : current.CODE;

    const searchresults_handler = useCallback(
        (customevent) => {
            const result = customevent.detail.results;
            debug('searchresults_handler', result);
            if (result.length > 0) {
                const first = result[0];
                tree.current.setInitId(first.ID);
            } else {
                // ToDo: сделать модульное окно с инфомацией об ошибке.
                alert('Внимание! Информация по коду не найдена.');
            }
            if (onSearchResults) {
                onSearchResults(result)
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
    });

    useEventListener(event_searchresults, searchresults_handler, document);

    const treecls = classNames({
        'col-sm-8': isclasses && stavkas,
        'col' : isclasses && !stavkas
    });

    return (
        <div className={cls}>
            <Row className='scrollroot' {...props}>
                <div className={treecls}>
                    <HeightObserver element_css={header_css}/>
                    <TnvTree
                        className="ccs-scroll-container"
                        onChange={(node) => {
                            setCurrent(node)
                        }}
                        ref={tree}
                        topScrollMargin={160}
                        bottomScrollMargin={160}
                        {...props}
                    />
                    <HeightObserver element_css={footer_css}/>
                </div>
                {stavkas && (
                    <div className="col-sm-4">
                        <ShowStWindow
                            typ='1'
                            code={code}
                            data={data}
                            windowclassName={'tnvedapp-prim-window'}
                            {...props}
                        />
                    </div>
                )}
            </Row>
        </div>
    )
}

export {

    TnvedApp

}