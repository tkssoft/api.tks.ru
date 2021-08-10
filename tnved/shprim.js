/*
* Окно показа и выбора ставок / признаков по товару
*
* */

import React from 'react';
const {calctxt, is_pr, calc_get5, get5} = require('./tnved_utils');
const tnv_const = require('./tnv_const');
const keys = require('../common/keys');

const przdesc = (prz) => {
    switch (prz) {
        case 0: return "экспортной пошлине";
        case tnv_const.PRIZNAK_IMPORTDUTY: return 'импортной пошлине';
        case tnv_const.PRIZNAK_EXCISEDUTY: return 'ставкам акциза';
        case tnv_const.PRIZNAK_VAT: return 'ставкам НДС';
        case 4: return 'ставкам обеспечения';
        case 5: return 'льготам по стране происхождения';
        case 6: return 'лицензированию на экспорт';
        case 7: return 'лицензированию на импорт';
        case 8: return 'квотированию на экспорт';
        case 9: return 'квотированию на импорт';
        case 10: return 'регистрации контракта';
        case 11: return 'сертификации';
        case 12: return 'стратегическим товарам';
        case 13: return 'товарам двойного применения';
        case tnv_const.PRIZNAK_IMPORTSPECDUTY: return 'временной импортной пошлине';
        case tnv_const.PRIZNAK_IMPORTANTIDUMP: return 'антидемпинговой пошлине';
        case 17: return 'дополнительной импортной пошлине';
        case 20: return 'компенсационной пошлине';
        case 21: return 'товарам двойного применения';
        case tnv_const.PRIZNAK_IMPORTDUTY_OTHER: return 'пошлине по др. странам';
        case 32: return 'преференциям для наименее развитых стран';
        case 28: return 'маркировке КИЗ';
        case tnv_const.PRIZNAK_OTHER_LIC_EXP: return 'прочим разрешительным экспорт';
        case tnv_const.PRIZNAK_OTHER_LIC_IMP: return 'прочим разрешительным импорт';
        default: return "прочим особенностям";
    }
};

class ShowPrim extends React.Component {
    constructor (props) {
        super(props);
        const { TNVED, TNVEDALL, TNVEDCC } = this.props.data;
        this.state = {
            desc: przdesc(this.props.prz),
            stavkas: TNVEDALL[this.props.prz].reduce(
                (a, v) => {

                    a.push({
                        stavka: get5(
                            v.PRIZNAK,
                            v.MIN,
                            v.TYPEMIN,
                            v.MAX,
                            v.TYPEMAX,
                            v.MIN2,
                            v.TYPEMIN2,
                            v.PREF,
                            v.SIGN,
                            v.SIGN2,
                            '',
                            v.CU
                            ),
                        note: v.NOTE && v.NOTE.replace('\n', '<br />')
                    });
                    return a
                }, [15, 30].includes(this.props.prz)? [] :[{stavka: calc_get5(TNVED, this.props.prz) + ' - (БАЗОВАЯ)'}]
            ),
            selected: 0
        }
    }

    componentDidMount() {
        document.addEventListener('keyup', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.handleKeyPress);
    }

    handleKeyPress = (e) => {
        if (e.keyCode === keys.VK_RETURN) {
            this.buttonClick(this.state.selected, null);
            e.preventDefault();
        } else if (e.keyCode === keys.VK_DOWN) {
            // Стрелка вниз
            if (this.state.selected !== this.state.stavkas.length - 1) {
                this.setState({selected: this.state.selected + 1});
            }
            e.preventDefault();
        } else if (e.keyCode === keys.VK_UP) {
            // Стрелка вверх
            if (this.state.selected > 0) {
                this.setState({selected: this.state.selected - 1})
            }
            e.preventDefault();
        }
    };

    itemClick(i, e) {
        const stavka = this.state.stavkas[i];
        this.setState({selected: i});
    }

    buttonClick(i, e) {
        this.props.onSelect(this.props.prz, i === 0, i !== 0 && this.props.data.TNVEDALL[this.props.prz][i - 1] );
        if (this.props.onAfterSelect) {
            this.props.onAfterSelect()
        }
    }

    render () {
        return (
            <div className="ccs-contract-ShowPrimWindow">
                <div className="ccs-contract-ShowPrimTitle">
                    <div className="ccs-contract-toolbar d-inline-flex align-items-center">
                        <div className="ccs-contract-strong ccs-contract-ShowPrimTitleItem ccs-contract-ShowPrimCode">{this.props.data.CODE}</div>
                        <div className="ccs-contract-ShowPrimTitleItem ccs-contract-ShowPrimName">{this.props.data.KR_NAIM}</div>
                    </div>
                </div>
                <div className="list-group ccs-contract-ShowPrimContent w-100" role="tablist">
                    {this.state.stavkas.map((item, i) => {
                        const {stavka, note} = item;
                        const active = i === this.state.selected ? "active" : "";
                        const linkclass = active ? 'text-white' : 'text-link'
                        let style = {};
                        return (
                            <div className={"list-group-item list-group-item-action " + active}
                               key={i}
                               style={style}
                               onClick={this.itemClick.bind(this, i)}
                               onDoubleClick={this.buttonClick.bind(this, i)}
                            >
                                <div>
                                    <a href="#" className={'ccs-contract-strong ' + linkclass} onClick={this.buttonClick.bind(this, i)}>{stavka}</a>
                                    {note !== undefined && (
                                        <p className="pt-3" dangerouslySetInnerHTML={{__html: note}} />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export {
    ShowPrim,
    przdesc
}