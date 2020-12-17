
/*
* Средства отладки скриптов
* */

const React = require('react')

const debugmode = () => true;

const debug = (...args) => debugmode() && console.log(...args);

const Dummy = (props) => {
    return (<div {...props}>Dummy</div>)
}

export {
    debug,
    Dummy
}