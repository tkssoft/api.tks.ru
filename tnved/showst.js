/*
* Ставки признаки по товарам
*
*
*
* */

const React = require('react');
const { calctxt, is_pr, get_type_priznak } = require('./tnved_utils');
const tnv_const = require('./tnv_const');
const { DotsModalButton } = require('../common/modalbutton');
const { ShowPrim } = require('./shprim');
const { get_stavka, get_tnvedcc_rec } = require('./stavka');
const { TYPE_IM, TYPE_EK, TYPE_DEPOSIT, nbsp, calctype } = require('../common/consts');
const { AlertDanger } = require('../common/alert');
const { getcold } = require('../common/bs');
import { ccs_contract } from '../common/ccs';
import { isEmptyAll } from '../common/utils';
import classNames from 'classnames';


const S_SHOWSTTITLE = "Список ставок и признаков";
const S_EMPTYTNVED = "Информация о ставках/признаках на товар отсутствует.";


const get_item_cls = (is_name) => {
    return classNames(
        ccs_contract("ShowStItem"),
        {
            "list-group-item": true,
            "no-border": !is_name,
            "name-bottom-border": is_name
        }
    );
};


const ShowStName = ({ children, is_name }) => {
    return (!is_name ? <div className={"ccs-contract-strong ccs-contract-ShowStItem-name"}>{children}</div> : null);
};


class ShowStItem extends React.Component {
    constructor (props) {
        super(props);
        this.modalref = React.createRef();
        this.state = {
            name: this.props.name || tnv_const.przname(this.props.prz, true),
            pr: this.props.data !== undefined && is_pr(this.props.data.TNVED, this.props.prz, this.props.tnvedcc)
        };
    }

    static getDerivedStateFromProps(props, state) {
        return {
            pr: props.data !== undefined && is_pr(props.data.TNVED, props.prz, props.tnvedcc)
        }
    }

    render () {
        const { value, prButtonLabel, windowclassName, is_name } = this.props;
        if ([undefined, true].includes(this.props.skipIfEmpty) && !this.state.pr && [undefined, null, '', 'Нет', 'Беспошлинно', 'Отсутствует'].includes(value)) {
            return null;
        } else {
            const cls = get_item_cls(is_name);
            return (
                <li className={cls}>
                    <ShowStName is_name={is_name}>{this.state.name}:</ShowStName>
                    <div className={classNames("ccs-contract-ShowStItem-value", {"mr-0  w-100": is_name})}>{this.props.value}</div>
                    {this.state.pr ? (
                        <DotsModalButton
                            buttonLabel={prButtonLabel || "Выбрать"}
                            modalref={this.modalref}
                            data={this.props.data}
                            className={"ccs-contract-ShowStItem-button"}
                            title={tnv_const.przname(this.props.prz, false)}
                            btnClassName={'btn btn-sm btn-danger display-flex'}
                            isclasses={this.props.isclasses}
                            windowclassName={windowclassName}
                        >
                            <ShowPrim
                                prz={this.props.prz}
                                data={this.props.data}
                                onSelect={this.props.onSelect}
                                onAfterSelect={()=>{
                                    if (this.props.selectable) {
                                        this.modalref.current.handleToggleModal();
                                    }
                                }}
                                current={this.props.value}
                                selectable={this.props.selectable}
                            />
                        </DotsModalButton>
                    ) : null}
                    {!this.state.pr && !is_name ? (
                        <div className={"ccs-contract-ShowStItem-button"}>{nbsp}</div>
                    ) : null}
                </li>
            )
        }
    }
}


const trunc_date = (n) => {
    const oneday = 60 * 60 * 24 * 1000;
    return n - (n % oneday);
};


/* Проверка даты действия кода */
const check_dates = (dstart, dend) => {
    var now = trunc_date(new Date().valueOf());
    if (dstart) {
        var ds = trunc_date(new Date(dstart).valueOf());
        if (ds > now) {
            return "Действие кода товара еще не началось."
        }
    }
    if (dend) {
        var ds = trunc_date(new Date(dend).valueOf());
        if (ds < now) {
            return "Код товара недействителен на текущую дату."
        }
    }
    return "";
};


/* Заголовок списка */
const ShowStTitle = ({children}) => {
    return (<li className={'ccs-contract-title ccs-contract-ShowSt-title'}><div>{children}</div></li>);
}

/* Наименование направления */
const ShowStType = ({children}) => {
    const cls = classNames(
        get_item_cls(true),
        ccs_contract("ShowSt-type")
    );
    return (
        <li className={cls}>
            <ShowStName is_name={false}>{children}</ShowStName>
        </li>
    );
}

/* Список ставок и признаков по коду по выбранному направлению */
const ShowSt = (props) => {

    const { className, isclasses, classNamePrefix, data, tnved, G34='643', onSelect } = props;
    const cls = classNames({
        [className]: !!className,
        [classNamePrefix]: !!classNamePrefix,
        [ccs_contract('ShowSt')]: true,
        'list-group': isclasses,
        ...getcold(props, true, 'group')
    });

    // массив типов для отображения
    const typarr = props.typ === undefined ? [TYPE_IM, TYPE_EK] : [props.typ];
    // данные по пошлинам других стран
    const tnvedcc_rec = get_tnvedcc_rec(G34, tnved === undefined? {} : tnved.TNVEDCC);
    // строковое представление ставок
    const stavkas = calctxt(props.data, tnvedcc_rec);
    // не отображать наименование товара
    const skipName = [undefined, false].includes(props.skipName);
    // нет данных
    const emptyTnved = isEmptyAll(tnved.TNVED);
    // список для отображения
    const items = [];
    // Проверка дат
    const code_error = emptyTnved ? '' : check_dates(tnved.TNVED.DSTART, tnved.TNVED.DEND);

    if (!emptyTnved) {
        for (let typ of typarr) {
            let przarr = get_type_priznak(typ, props.expertmode);
            items.push(<ShowStType key={typ}>{calctype()[typ]}:</ShowStType>);
            for (let prz of przarr) {
                items.push(
                    <ShowStItem
                        prz={prz}
                        key={JSON.stringify({typ, prz})}
                        value={stavkas[prz]}
                        data={props.tnved}
                        tnvedcc={tnvedcc_rec}
                        onSelect={(prz, base, tnvedall) => {
                            return onSelect !== undefined ? onSelect(prz, base, tnvedall) : false;
                        }}
                        skipIfEmpty={props.skipIfEmpty}
                        isclasses={props.isclasses}
                        prButtonLabel={props.prButtonLabel}
                        windowclassName={props.windowclassName}
                        selectable={onSelect !== undefined}
                    />
                );
            }
        }
    }

    if (!isEmptyAll(props.data) && !isEmptyAll(props.tnved)) {
        return (
            <ul className={cls}>
                {props.showTitle ? ( <ShowStTitle>{S_SHOWSTTITLE}</ShowStTitle> ) : null}
                {skipName ? ( <ShowStItem key="name" name={"Наименование"} value={props.G312} is_name={true}/> ) : null}
                {code_error ? (<AlertDanger key="alert 1" isclasses={isclasses}>{code_error}</AlertDanger>) : null}
                {emptyTnved ? (<AlertDanger key="alert 1" isclasses={isclasses}>{S_EMPTYTNVED}</AlertDanger>) : null}
                { items }
            </ul>
        )
    } else {
        return null;
    }
}

export {
    ShowSt
}
