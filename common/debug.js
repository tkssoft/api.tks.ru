
/*
* Средства отладки скриптов
* */


const debugmode = () => process.env.TKS_NODE_DEBUG === 'debug';

const debug = (...args) => debugmode() && console.log(...args);

export {
    debug
}