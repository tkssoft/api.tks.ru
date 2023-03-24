/*
* Окно показа и выбора ставок / признаков по товару
*
* */

import React from 'react';
const {calctxt, is_pr, calc_get5, get5} = require('./tnved_utils');
const tnv_const = require('./tnv_const');
const keys = require('../common/keys');
const { isNullStr } = require('../common/utils');
const classNames = require('classnames');

const przdesc = (prz) => {
    switch (prz) {
        case 0: return "экспортной пошлине";
        case tnv_const.PRIZNAK_IMPORTDUTY: return 'импортной пошлине'; // 1
        case tnv_const.PRIZNAK_EXCISEDUTY: return 'ставкам акциза'; // 2
        case tnv_const.PRIZNAK_VAT: return 'ставкам НДС'; // 3
        case 4: return 'ставкам обеспечения';
        case 5: return 'преференциям по РС';
        case 6: return 'лицензированию на экспорт';
        case 7: return 'лицензированию на импорт';
        case 8: return 'квотированию на экспорт';
        case 9: return 'квотированию на импорт';
        case 10: return 'регистрации контракта';
        case 11: return 'сертификации';
        case 12: return 'стратегическим товарам';
        case 13: return 'товарам двойного применения';
        case tnv_const.PRIZNAK_OTHER_LIC_IMP: return 'прочим разрешительным импорт'; //14
        case 15: return "прочим особенностям"
        case tnv_const.PRIZNAK_IMPORTSPECDUTY: return 'временной импортной пошлине'; //16
        case 17: return 'дополнительной импортной пошлине';
        case tnv_const.PRIZNAK_IMPORTANTIDUMP: return 'антидемпинговой пошлине';
        case 20: return 'компенсационной пошлине';
        case 21: return 'товарам двойного применения';
        case tnv_const.PRIZNAK_OTHER_LIC_EXP: return 'прочим разрешительным экспорт';
        case 28: return 'маркировке';
        case tnv_const.PRIZNAK_IMPORTDUTY_OTHER: return 'пошлине по др. странам'; // 30
        case 32: return 'преференциям по НРС';
        case 33: return 'прослеживаемости';
        case 34: return 'переченю запретов других стран на экспорт';
        case 35: return 'переченю запретов других стран на импорт';
        default: return 'неизвестному признаку';
    }
};

const tr_note = (note) => {
    if (note) {
        var rexp = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
        var s = note.split('\n').reduce((a, v) => {
            if (!isNullStr(v)) {
                const s = v.trim();
                if (s.length > 0) {
                    a.push(v);
                }
            }
            return a
        }, []).join('<br />');
        return s.replace(rexp, "<a href='$1' target='_blank'>$1</a>");
    }
    return null;
}

class ShowPrim extends React.Component {
    constructor (props) {
        super(props);
        const { TNVED, TNVEDALL, TNVEDCC } = this.props.data;
        this.state = {
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
                        note: v.NOTE && tr_note(v.NOTE)
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
        const selectable = !!this.props.onSelect;
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
                        const isactive = selectable && (i === this.state.selected);
                        const iscurrent = selectable && (stavka === this.props.current);
                        console.log('iscurrent', stavka, this.props.current, iscurrent);
                        const listitemcls = classNames(
                            'list-group-item',
                            'list-group-item-action',
                            {
                                'active': isactive
                            },
                        );
                        const linkclass = classNames(
                            'ccs-contract-strong',
                            {
                                'text-white': isactive,
                                'text-link': !isactive,
                                'ccs-contract-ShowPrimCurrent': iscurrent
                            },
                        );
                        return (
                            <div className={listitemcls}
                               key={i}
                               onClick={this.itemClick.bind(this, i)}
                               onDoubleClick={this.buttonClick.bind(this, i)}
                            >
                                <div>
                                    <a href="#" className={linkclass} onClick={this.buttonClick.bind(this, i)}>{stavka}</a>
                                    {!isNullStr(note) && (
                                        <p className="pt-2" dangerouslySetInnerHTML={{__html: note}} />
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
    ShowPrim
}