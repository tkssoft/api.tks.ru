/* простое отображение результатов расчетов */

const React = require('react');
const classNames = require('classnames');

const nsi = require('../../common/nsi');
import { ccs_class, ccs_contract } from '../../common/ccs';
const { g47name, nbsp } = require('../../common/consts');

import { ArrayList } from '../components/tablelist';

const vlnm = nsi.valname();
const edizm = nsi.edizm();


const NumberWithEdi = (props) => {
    const { value, valedi, edizmedi, altvalue, className, valediname, editype } = props;
    let edi;
    if (valedi && edizmedi) {
        edi = `${vlnm[valedi].BUK}${nbsp}/${nbsp}${edizm[edizmedi].KRNAIM}`;
    } else if (valedi) {
        edi = `${valediname || vlnm[valedi].BUK}`;
    } else if (edizmedi) {
        edi = `${edizmedi === "%" ? edizmedi : edizm[edizmedi].KRNAIM}`;
    } else if (editype === "%") {
        edi = editype;
    } else if (valediname) {
        edi = valediname;
    } else {
        edi = '';
    }
    const cls = classNames({
        [className]: !!className,
        [ccs_class('NumberWithEdi')]: edi
    })
    if (!edi) {
        return (<div className={cls}>{altvalue || value}</div>)
    }
    return (
        <div className={cls}>
            <div className={ccs_class('NumberWithEdi-value')}>{value}</div>
            <div className={ccs_class('NumberWithEdi-edi')}>{edi}</div>
        </div>
    )
}


/* Таблица с данными 47 графы */
const SimpleResults = (props) => {

    const { data, isclasses } = props

    if (data && data.length > 0) {
        data.sort((v1, v2) => {
            var key1 = ('00000' + v1.G32.toString()).slice(-5) + v1.G471;
            var key2 = ('00000' + v2.G32.toString()).slice(-5) + v2.G471;
            return key1.localeCompare(key2)
        });
        let d = [{
            DUMMY: nbsp,
            OSNOVA: 'Основа',
            STAVKA: 'Ставка',
            SUMMA: 'Сумма'
        }, ...data];
        return (
            <ArrayList
                onContentItem={(rec, index) => {
                    let platname = g47name(rec.G471, rec.LETTER);
                    if (platname) {
                        platname = platname + ':';
                    }
                    return (
                        <>
                            <div className={ccs_class('g47name')}>{rec.DUMMY || platname}</div>
                            <NumberWithEdi altvalue={rec.OSNOVA} value={rec.G472} valedi={rec.G4721} edizmedi={rec.G472EDI}/>
                            <NumberWithEdi altvalue={rec.STAVKA} value={rec.G473_ARM} valedi={rec.G4732} edizmedi={rec.G4733} editype={rec.G4731}/>
                            <NumberWithEdi className={ccs_class('g47summa')} altvalue={rec.SUMMA} value={rec.G474} valedi={rec.G4741}/>
                        </>
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
                <NumberWithEdi className={'ccs-contract-Result-total-value'} value={data.sum} valediname={data.buk} />
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