/* Примерное приложение с деревом ТН ВЭД и показом ставок / признаков по выбранному коду */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { Row } from '../../common/bs';
import { isEmptyAll, isEmpty } from '../../common/utils';
import { ShowSt } from '../showst';
import { tnved_manager } from '../tnved_manager';
import { debug } from '../../common/debug';
import { HeightObserver } from '../../common/mimic';
import { event_searchresults } from '../searchform';
import { DotsModalButtonVertical } from '../../common/modalbutton';
import { isNumeric } from '../../common/numbers';
import { Alert } from '../../common/alert';
import { TnvSearchForm } from '../searchform';
import { SearchTnvTree } from '../searchtnvtree';

const isCode = (code) => {
    return code && isNumeric(code) && code.length === 10;
}

const ShowStWindow = (props) => {
    const { code, manager, isclasses, windowclassName, typ=0, windowClassName } = props;
    const [ data, setData ] = useState({});
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if (isCode(code)) {
            setLoading(true);
            const starttime = new Date().getTime();
            manager.getData(code).then((data) => {
                debug('Загрузка данных для кода', code, 'заняла', new Date().getTime() - starttime, 'мс' );
                setData(data);
                setLoading(false);
            });
        }
    }, [code]);

    return (
        <div className={classNames("ccs-codeinfo", windowClassName)}>
            {!isCode(code) && (
                <Alert type="warning" isclasses={isclasses}>
                    <div>Для просмотра информации по коду, выберете полный код</div>
                </Alert>
            )}
            {loading && (
                <div>Идет загрузка данных для кода {code}</div>
            )}
            {!loading && isCode(code) && !isEmptyAll(data) && (
                <ShowSt
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
    if (isCode(code)) {
        return (
            <div className="ccs-code d-sm-block d-md-none margin-left-auto">
                <DotsModalButtonVertical btnClassName="btn btn-sm btn-light" buttonLabel="Ставки" title="Ставки / признаки" {...props}>
                    <ShowStWindow windowClassName="ccs-codeinfo-modal" {...props} />
                </DotsModalButtonVertical>
            </div>
        )
    }
    return null;
}


const TnvedApp = (props) => {

    const { isclasses, manager, show_stavkas } = props;

    if (!manager) {
        manager = new tnved_manager({});
    }

    const cls = classNames({
        'ccs-tnvedapp': true,
        'container-fluid': isclasses
    });

    const [ current, setCurrent ] = useState();

    const notvalid = isEmptyAll(current) || isEmptyAll(current.CODE) || (current.CODE.length !== 10);
    const code = notvalid ? '' : current.CODE;

    const treecls = classNames({
        'col-md-7': isclasses && show_stavkas,
        'col' : isclasses && !show_stavkas
    });

    const showst_props = {
        typ: '1',
        code: code,
        windowclassName: 'tnvedapp-prim-window',
    }

    return (
        <div className={cls}>
            {props.onInfo && props.onInfo(props)}
            <Row className="row position-sticky top-0 z-5 background-color-light">
                <div className="col-md">
                    <TnvSearchForm />
                </div>
            </Row>
            <Row className='scrollroot' {...props}>
                <div className={treecls}>
                    <SearchTnvTree
                        className="ccs-scroll-container"
                        onChange={(node) => {
                            setCurrent(node)
                        }}
                        topScrollMargin={0}
                        bottomScrollMargin={0}
                        onCodeRender={(acode, text) => {
                            if (show_stavkas) {
                                return (
                                    <ShowStButton
                                        {...showst_props}
                                        {...props}
                                        code={acode}
                                    />
                                );
                            }
                            return null;
                        }}
                        {...props}
                    />
                </div>
                {show_stavkas && (
                    <div className="col-md-5">
                        <ShowStWindow
                            windowClassName="ccs-codeinfo-fixed d-none d-sm-none d-md-block position-sticky top-55 z-4 bottom-0"
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