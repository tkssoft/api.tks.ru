
/* Отображение результатов расчетов по настройкам из личного кабинета */

const React  = require('react');
const classNames = require('classnames')


const ResultTitle = (props) => {
    const { name, className } = props
    const clsname = classNames({
        "ccs-contract-title": true,
        "ccs-contract-ResultTitle": true,
        [className]: !!className
    })
    return (
        <div className={clsname}>Результаты расчета: {name}</div>
    )
}


const ResultValue = (props) => {
    const { value, title, className } = props
    let clsname = classNames({
        "ccs-contract-ResultValue": true,
        [className]: !!className
    })
    return (
        <div className={clsname}>
            <div className={classNames({
                "ccs-contract-ResultValue-title": true
                })}>{title}</div>
            <div className={classNames({
                "ccs-contract-ResultValue-value": true,
                })}>{value}</div>
        </div>
    )
}

const ConfigResult = (props) => {
    const { total, isclasses } = props
    const { NAME, VALUES, TYP } = total
    const clsname = "ccs-contract-ConfigResult-" + TYP.toString()
    return (
        <div className={clsname}>
            <ResultTitle className={clsname} name={NAME} isclasses={isclasses} />
            {
                Object.keys(VALUES).sort((a, b) => {
                    if (VALUES[a].ORDERBY < VALUES[b].ORDERBY) {
                        return -1
                    }
                    if (VALUES[a].ORDERBY > VALUES[b].ORDERBY) {
                        return 1
                    }
                    return 0
                }).map((valuename, index) => {
                    let value = VALUES[valuename]
                    return (
                        <ResultValue
                            key={index}
                            className={clsname}
                            title={value.NAME}
                            value={value.VALUE}
                            isclasses={isclasses}
                        />
                    )
                })
            }
        </div>
    )
}

const ConfigResults = (props) => {
    const { totals, isclasses } = props
    if (totals) {
        return (
            <div className="ccs-contract-ConfigResults">
                {
                    Object.keys(totals).map((typ, index) => {
                        return (
                            <ConfigResult key={index} total={totals[typ]} isclasses={isclasses}/>
                        )
                    })
                }
            </div>
        )
    } else {
        return null;
    }
}

export {
    ConfigResults
}