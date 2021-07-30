/* простое отображение результатов расчетов */

const React = require('react');
const classNames = require('classnames');

const nsi = require('../../common/nsi');
import { ccs_class } from '../../common/ccs';
const { g47name } = require('../../common/consts');

import { ArrayList } from '../components/tablelist';


/* Таблица с данными 47 графы */
const SimpleResults = (props) => {

    const { data, isclasses } = props

    if (data) {
        data.sort((v1, v2) => {
            var key1 = ('00000' + v1.G32.toString()).slice(-5) + v1.G471;
            var key2 = ('00000' + v2.G32.toString()).slice(-5) + v2.G471;
            return key1.localeCompare(key2)
        })
        let vlnm = nsi.valname();
        let d = [{
            DUMMY: '\u00A0',
            OSNOVA: 'Основа',
            STAVKA: 'Ставка',
            SUMMA: 'Сумма'
        }, ...data];
        console.log('SimpleResults', d);
        return (
            <ArrayList
                onContentItem={(rec, index) => {
                    return (
                        <div>
                            <div>{rec.DUMMY || g47name(rec.G471, rec.LETTER)}</div>
                            <div>{rec.OSNOVA || rec.G472}</div>
                            <div>{rec.STAVKA || rec.G473}</div>
                            <div>{rec.SUMMA || rec.G474}&nbsp;{!rec.SUMMA && (vlnm[rec.G4741].BUK || vlnm[rec.G4741].KRNAIM)}</div>
                        </div>
                    )
                }
                }
                data={d}
                classPrefix={ccs_class('Result')}
                isclasses={isclasses}
                className={'mt-3'}
            />
        )
    } else {
        return (<></>)
    }
}


/* Строка ИТОГО по результатам расчетов */
const SimpleResultTotals = (props) => {
    const { isclasses, data } = props
    if (data) {
        return (
            <div
                className={classNames({
                    "ccs-contract-Result-total": true,
                    'list-group-item mt-3': isclasses
                })}
            >
                <div className={'ccs-contract-Result-total-name'}>Итого:</div>
                <div className={'ccs-contract-Result-total-value'}>
                    <div>{data.sum}</div>
                    <div className={'ccs-contract-Result-total-valname'}>{data.buk}</div>
                </div>
            </div>
        )
    } else {
        return (<></>)
    }
}

/* Протокол расчетов */
const CalcLog = (props) => {
    const {data, g32} = props
    if (data && data[g32]) {
        return (
            <div className="ccs-contract-Result-log">
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th scope="col">Протокол расчета</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data[g32].map(
                        (rec, index) => {
                            return (
                                <tr key={index}>
                                    <td>{rec}</td>
                                </tr>
                            )
                        }
                    )}
                    </tbody>
                </table>
            </div>
        )
    } else {
        return (<></>)
    }
}

export {
    SimpleResults,
    SimpleResultTotals,
    CalcLog
}