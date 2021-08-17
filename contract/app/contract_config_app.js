/* Приложение, которое считывает свои настройки и формирует форму по ним */

import React, { useState } from 'react';

import { BaseContractApp } from './contract_app';
import { tbl_kontrakt, tbl_kontdop } from './contract_manager';
import { process_config, get_result_array } from '../components/clientcalc';
import { isEmptyAll } from '../../common/utils';
import { ClientResultArray } from '../components/clientresults';

const fetch_client_config = (clientid) => {
    // const url = `https://my.tks.ru/products/calc/conf/download_simple/?product=${clientid}`;
    const url = `/demo/clientconfig.json`;
    return fetch(url)
        .then((r) => r.json())
        .catch((error) => {
            // ToDo: сделать обработку ошибок
            console.error('fetch_client_config error', error);
        });
}

const get_config_member = (config, member) => {
    if (member in config) {
        return config.member
    }
    return {}
}

get_table_config (tblname) {
    const { fieldconfig } = this.props
    if (fieldconfig) {
        if (tblname in fieldconfig) {
            return fieldconfig[tblname]
        }
    }
    return null
}

get_field_config (tblname) {
    const tableconfig = this.get_table_config(tblname)
    if (tableconfig && tableconfig.fields) {
        return tableconfig.fields
    }
    return {}
}

get_default_values (tblname) {
    let r = {}
    const tableconfig = this.get_table_config(tblname)
    if (tableconfig) {
        const fieldconfig = tableconfig.fields || {}
        r = Object.keys(fieldconfig).reduce((arr, fieldname) => {
                const cfg = fieldconfig[fieldname]
                if (cfg) {
                    arr[fieldname] = cfg.value
                }
                return arr
            }, r)
    }
    return r
}


const ConfigApp = (props) => {
    const [ config, setConfig ] = useState({});
    const [ clientresultarr, setclientresultarr ] = useState([]);
    return (
        <BaseContractApp storage_section={get_config_member(config, 'common').storage_section} {...props}>
            {(prs) => {
                return (
                    <>
                        <ClientResultArray results={clientresultarr} {...prs} />
                    </>
                )
            }}
        </BaseContractApp>
    );
};

export {
    ConfigApp as default
}