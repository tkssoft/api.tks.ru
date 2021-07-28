/* Отображение результатов расчета клиентского конфига из ЛК */

import React from 'react';

import classNames from 'classnames';
import { ccs_class } from '../../common/ccs';
import { isEmptyAll } from '../../common/utils';

const ResultValue = (props) => {
    const { name, value } = props;
    return (
        <div>
            <div>{name}</div>
            <div>{value}</div>
        </div>
    )
}

const ClientResult = (props) => {
    const { isclasses, result } = props;
    const cls = classNames({
        [ccs_class('ClientResult')]: true,
    });
    return (
        <div className={cls}>
            { result.map((r) => {
                return (
                    <ResultValue
                        name={r.name}
                        value={ get_result_value(r) }
                    />
                )
            }) }
        </div>
    )
}

export {
    ClientResult
}