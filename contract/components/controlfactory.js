/* Создание пользовательских контролов по настройкам */

import React from 'react';
import { Row } from '../../common/bs';

class CreateControlError extends Error {

}

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
        return <></>;
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
        return controlcreation.create( { edittype, ...props } );
    }

    get_data ( dsname ) {
        if (!(dsname in Object.keys(this.datasources))) {
            return {};
        }
        return this.datasources[dsname];
    }

    register_control (creation) {
        const ctype = creation.type();
        if (!(ctype in Object.keys(this.controltypes))) {
            this.controltypes[ctype] = creation;
        }
        return this;
    };

    register_datasource = (dsname, data) => {
        // Не проверяем наличие ключа, а просто переписываем данные
        this.datasources[dsname] = data;
        return this;
    }

    render ( { fields, ...props } ) {
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
        return Object.keys(rows).map((row, index) => {
            return (
                <Row key={index} {...props}>
                    {rows[row].map((field, index) => {
                        return this.create({
                            key: `field${index}`,
                            insiderow: true,
                            ...field,
                            ...props
                        });
                    })}
                </Row>
            )
        })
    }

}


export {
    ContractControlCreation,
    ControlFactory
}