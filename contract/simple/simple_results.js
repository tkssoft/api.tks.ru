/* простое отображение результатов расчетов */

const React = require('react')
const classNames = require('classnames')

const nsi = require('../../common/nsi')
const { g47name } = require('../../common/consts')


/* Таблица с данными 47 графы */
const SimpleResults = (props) => {

    const { data } = props

    if (data) {
        data.sort((v1, v2) => {
            var key1 = ('00000' + v1.G32.toString()).slice(-5) + v1.G471;
            var key2 = ('00000' + v2.G32.toString()).slice(-5) + v2.G471;
            return key1.localeCompare(key2)
        })
        let vlnm = nsi.valname();
        return (
            <div className="ccs-contract-Result-table">
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th scope="col">&nbsp;</th>
                        <th scope="col">Основа</th>
                        <th scope="col">Ставка</th>
                        <th scope="col">Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(
                        (rec, index) => {
                            return (
                                <tr key={rec.G471}>
                                    <th scope="row">{g47name(rec.G471, rec.LETTER)}</th>
                                    <td>{rec.G472}</td>
                                    <td>{rec.G473}</td>
                                    <td>{rec.G474}  {vlnm[rec.G4741].SHORT !== undefined ? vlnm[rec.G4741].SHORT : vlnm[rec.G4741].KRNAIM}</td>
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


/* Строка ИТОГО по результатам расчетов */
const SimpleResultTotals = (props) => {
    const { isclasses, data } = props
    if (data) {
        return (
            <div
                className={classNames({
                    "ccs-contract-Result-total": true
                })}
            >
                <div className={'ccs-contract-Result-total-name'}>Итого:</div>
                <div className={'ccs-contract-Result-total-value'}>{data.sum}</div>
                <div className={'ccs-contract-Result-total-valname'}>{data.valname}</div>
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