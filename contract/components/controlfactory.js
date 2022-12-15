/* Создание пользовательских контролов по настройкам */

import React from 'react';
import { Row } from '../../common/bs';
import { isEmptyAll } from '../../common/utils';
import { debug } from '../../common/debug';
import { eval_value } from './clientcalc';

const FK_CALCULATED = 'Вычисляемое';
const CT_CONTRACTINPUT = 'Текст';

class ContractControlCreation {

    constructor ({type, onCreate}) {
        this._type = type;
        this._onCreate = onCreate;
    }

    type () {
        return this._type;
    }

    create ( props ) {
        if (this._onCreate) {
            return this._onCreate(props);
        }
        return null;
    }

}

class ControlFactory {

    constructor (props) {
        if (!ControlFactory._instance) {
            this.datasources = {};
            this.controltypes = {};
            ControlFactory._instance = this;
        }
        return ControlFactory._instance;
    }

    create ( { edittype, ...props } ) {
        const controlcreation = this.controltypes[edittype];
        if (controlcreation) {
            return controlcreation.create( { edittype, ...props } );
        }
        console.error('ControlFactory.create. creation not found', edittype);
        return null;
    }

    get_data ( dsname ) {
        if (!(dsname in this.datasources)) {
            return {};
        }
        return this.datasources[dsname];
    }

    register (props) {
        return this.register_control(new ContractControlCreation(props));
    }

    register_control (creation) {
        const ctype = creation.type();
        if (!(ctype in this.controltypes)) {
            this.controltypes[ctype] = creation;
        }
        return this;
    };

    register_datasource = (dsname, data) => {
        // Не проверяем наличие ключа, а просто переписываем данные
        this.datasources[dsname] = data;
        return this;
    }

    render ( { fields, variables, onCreate, ...props } ) {
        var sfields = [...fields];
        var rows = sfields.sort(function (a, b) {
            const row1 = parseInt(a.row) || 0;
            const row2 = parseInt(a.row) || 0;
            return row1 - row2;
        }).reduce((arr, field, index) => {
            const row = field.row || 0;
            if (!(row in arr)) {
                arr[row] = []
            }
            arr[row].push(field);
            return arr;
        }, {});
        return Object.keys(rows).map((row, ind) => {
            return (
                <Row key={`row-${ind}`} {...props}>
                    {rows[row].map((field, index) => {
                        const akey = `field_${ind * 100 + index}`;
                        let params = {
                            key: akey,
                            ...field,
                            ...props
                        }
                        if (field.layout === undefined) {
                            params['layout'] = {group: '-sm'};
                        } else if (typeof field.layout === 'string') {
                            params['layout'] = {group: field.layout};
                        }
                        if (field.fieldkind === FK_CALCULATED) {
                            params['readOnly'] = true;
                        }
                        if (field.visible !== undefined && typeof field.visible === 'string') {
                            params['visible'] = eval_value(field.visible, variables);
                        }
                        if (field.data !== undefined && typeof field.data === 'string') {
                            params['data'] = eval_value(field.data, variables);
                        }
                        if (onCreate) {
                            params = onCreate(params);
                        }
                        if (isEmptyAll(params) || (params.visible == 0)) {
                            return null;
                        }
                        if (!field.edittype) {
                            params.edittype = CT_CONTRACTINPUT;
                        }
                        const component_to_render = this.create(params);
                        if (component_to_render) {
                            return component_to_render;
                        }
                        console.error('ControlFactory.render. nothing to render!', field);
                        return null;
                    })}
                </Row>
            )
        })
    }

}


export {
    ContractControlCreation,
    ControlFactory,
    FK_CALCULATED,
    CT_CONTRACTINPUT
}