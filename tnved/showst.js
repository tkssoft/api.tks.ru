/*
* Ставки признаки по товарам
*
*
*
* */

const React = require('react');
const { calctxt, is_pr, get_type_priznak } = require('./tnved_utils');
const tnv_const = require('./tnv_const');
const { ModalButton } = require('../common/modalbutton');
const { ShowPrim, przdesc } = require('./shprim');
const { get_stavka, get_tnvedcc_rec } = require('./stavka');
const { TYPE_IM, TYPE_EK, TYPE_DEPOSIT } = require('../common/consts');

import { ccs_contract } from '../common/ccs';
import { isEmptyAll } from '../common/utils';
import classNames from 'classnames';

class ShowStItem extends React.Component {
    constructor (props) {
        super(props);
        this.modalref = React.createRef();
        this.state = {
            name: this.props.name || tnv_const.przname(this.props.prz),
            pr: this.props.data !== undefined && is_pr(this.props.data.TNVED, this.props.prz, this.props.tnvedcc)
        };
    }

    static getDerivedStateFromProps(props, state) {
        return {
            pr: props.data !== undefined && is_pr(props.data.TNVED, props.prz, props.tnvedcc)
        }
    }

    render () {
        const { value, prButtonLabel } = this.props
        if ([undefined, true].includes(this.props.skipIfEmpty) && !this.state.pr && [undefined, null, '', 'Нет', 'Беспошлинно', 'Отсутствует'].includes(value)) {
            return (<></>)
        } else {
            return (
                <div className={ccs_contract("ShowStItem") + " list-group-item"}>
                    <div className={"ccs-contract-strong ccs-contract-ShowStItem-name"}>{this.state.name + ':'}</div>
                    <div className={"ccs-contract-ShowStItem-value"}>{this.props.value}</div>
                    {this.state.pr && (
                        <ModalButton buttonLabel={prButtonLabel || "Выбрать"} ref={this.modalref} data={this.props.data}
                                     className={"ccs-contract-ShowStItem-button"}
                                     title={`Примечания по ${przdesc(this.props.prz)}`}
                                     btnClassName={'btn btn-sm btn-block btn-danger'}
                                     isclasses={this.props.isclasses}
                        >
                            <ShowPrim prz={this.props.prz}
                                      data={this.props.data}
                                      onSelect={this.props.onSelect}
                                      onAfterSelect={()=>{this.modalref.current.handleToggleModal()}}
                            />
                        </ModalButton>
                    )}
                </div>
            )
        }
    }
}


const getState = (data, tnved, g34, typ) => {
    const tnvedcc_rec = get_tnvedcc_rec(g34, tnved === undefined? {} : tnved.TNVEDCC);
    return {
        stavkas: calctxt(data, tnvedcc_rec),
        data: {...data},
        G33: data.G33,
        typ: typ,
        tnvedcc_rec: tnvedcc_rec,
    }
};


class ShowSt extends React.Component {
    constructor (props) {
        super(props);
        this.state = ShowSt.getDerivedStateFromProps(this.props)
    }

    static getDerivedStateFromProps(props, state) {
        return getState(props.data || {}, props.tnved || {}, props.G34 || '643', props.typ);
    }

    componentDidMount () {
    }

    doSelect = (prz, base, tnvedall) => {
        const stavka = get_stavka(prz, this.state.data, base ? undefined : tnvedall);
        this.props.onSelect(prz, base, tnvedall)
        this.setState(getState({...this.state.data, ...stavka}, this.props.tnved, this.props.G34, this.props.typ), () => {
            //this.props.onSelect(prz, base, tnvedall)
        });
    };

    render () {

        const { className, isclasses } = this.props;
        const cls = classNames({
            [className]: !!className,
            [ccs_contract('ShowSt')]: true,
            'list-group': isclasses,
        })

        if (!isEmptyAll(this.props.data) && !isEmptyAll(this.props.tnved)) {
            return (
                <div className={cls}>
                    {this.props.showTitle && (
                        <div className={'ccs-contract-title ccs-contract-ShowSt-title'}><div>Ставки признаки по товару</div></div>
                    )}
                    {[undefined, false].includes(this.props.skipName) && (
                        <ShowStItem name={"Наименование"} value={this.props.G312}/>
                    )}
                    {get_type_priznak(this.state.typ, this.props.expertmode).map((prz, index) => {
                        return <ShowStItem
                                    prz={prz}
                                    key={prz}
                                    value={this.state.stavkas[prz]}
                                    data={this.props.tnved}
                                    tnvedcc={this.state.tnvedcc_rec}
                                    onSelect={this.doSelect}
                                    skipIfEmpty={this.props.skipIfEmpty}
                                    isclasses={this.props.isclasses}
                                    prButtonLabel={this.props.prButtonLabel}
                                />
                    })}
                </div>
            )
        } else {
            return (<></>)
        }
    }
}

export {
    ShowSt
}
