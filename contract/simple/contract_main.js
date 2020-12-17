/* Простое приложение - расчет контракта с одним товаром */

const React  = require('react');
const ReactDOM = require('react-dom');

const { SimpleContractApp } = require('./simple_app');

ReactDOM.render(
    <SimpleContractApp NUM={1} usedefault={true} isclasses={true}/>,
    document.querySelector('#ccs-contract')
);
