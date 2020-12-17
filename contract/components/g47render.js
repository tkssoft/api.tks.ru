
const React  = require('react');

const { g47name } = require('../../common/consts')


const G47SumResults = (props) => {

    return (
        <div className="dutyresults">
            <div className="dutyitem">
                <div className="dutyname">Итого:</div>
                <div className="dutyvalue">{props.total}</div>
            </div>
            {Object.keys(props.letter).map((letter) => {
                return  <div className="dutyitem" key={letter}>
                            <div className="dutyname">{g47name(letter.toString(), letter.toString())}{':'}</div>
                            <div className="dutyvalue">{props.letter[letter]}</div>
                        </div>
            })}
        </div>
    )
}

export {
    G47SumResults
}