/* Отображение результатов расчета клиентского конфига из ЛК */

import React from 'react';

import classNames from 'classnames';
import { ccs_class, ccs_contract } from '../../common/ccs';
import { isEmptyAll } from '../../common/utils';
import { get_result_value } from './clientcalc';
import { ArrayList } from './tablelist';

const ResultValue = (props) => {
    const { name, value, indent } = props;
    const cls = classNames({
        [ccs_contract('Result-total')]: true,
    });
    const clsname = classNames({
        [ccs_contract('Result-total-name')]: true,
        [ccs_class('indent-' + indent)]: indent !== undefined
    })
    return (
        <div className={cls}>
            <div className={clsname}>{name}</div>
            {value !== undefined && (
                <div className={ccs_contract('Result-total-value')}>{value}</div>
            )}
        </div>
    )
}

const ClientResult = (props) => {
    const { isclasses, result, subitems, className } = props;
    const cls = classNames({
        [ccs_class('ClientResult')]: true,
        [className]: !!className
    });
    return (
        <div className={cls}>
            <ResultValue
                name={result.name}
                value={ get_result_value(result) }
                indent={result.indent}
            />
            {subitems && result.items && (
                <ClientResultArray results={result.items} {...props} />
            )}
        </div>
    )
}

const ClientResultArray = (props) => {
    const { isclasses, results } = props;
    const cls = classNames({
        [ccs_contract('Result-table')]: true,
    });
    if (results && Array.isArray(results) && (results.length > 0)) {
        return (
            <ArrayList
                onContentItem={(r) => {
                    return (
                        <ClientResult result={r} />
                    )
                }}
                data={results}
                classPrefix={ccs_class('ClientResult')}
                {...props}
            />
        )
    } else {
        return <></>
    }
}

export {
    ClientResultArray
}