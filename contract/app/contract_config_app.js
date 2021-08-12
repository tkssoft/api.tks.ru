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


const ConfigApp = (props) => {
    const [ config, setConfig ] = useState({});
    const [ clientresultarr, setclientresultarr ] = useState([]);
    return (
        <>
        {(clientresultarr.length > 0) && (
            <ClientResultArray results={clientresultarr} {...props} />
        )}
        </>
    );
};

export {
    ConfigApp as default
}