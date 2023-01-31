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
import { ModalButton } from '../../common/modalbutton';

const ShowStWindow = (props) => {
    const { code, data, isclasses, windowclassName, typ=0, windowClassName } = props
    return (
        <div className={classNames("ccs-codeinfo", windowClassName)}>
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


const ShowStButton = (props) => {
    const { code } = props;
    if (code && code.length === 10) {
        return (
            <div className="ccs-code d-sm-block d-md-none">
                <ModalButton btnClassName="btn-sm" buttonLabel="Ставки" title="Ставки / признаки">

                    <h1>Ставки</h1>
                </ModalButton>
            </div>
        )
    }
    return null;
}


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
        'col-md-8': isclasses && stavkas,
        'col' : isclasses && !stavkas
    });

    const showst_props = {
        typ: '1',
        code: code,
        data: data,
        windowclassName: 'tnvedapp-prim-window',
    }

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
                        onCodeRender={(acode, text) => {
                            if (acode === code) {
                                return (
                                    <ShowStButton
                                        {...showst_props}
                                        {...props}
                                    />
                                );
                            }
                            return null;
                        }}
                        {...props}
                    />
                    <HeightObserver element_css={footer_css}/>
                </div>
                {stavkas && (
                    <div className="col-md-4">
                        <ShowStWindow
                            windowClassName="d-none d-sm-none d-md-block"
                            {...showst_props}
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