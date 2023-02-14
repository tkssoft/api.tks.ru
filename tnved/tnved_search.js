
/* Поиск текста в дереве ТН ВЭД */

import { isNumeric } from '../common/numbers';
import { debug } from '../common/debug';

// https://api1.tks.ru/tree.json/json/<ключ клиента>/search/?code=<code>&text=<goods_description>

const is_code = (s) => {
    return s && isNumeric(s) && s.length < 11
}

const getTreeData = (search) => {
    let sp = new URLSearchParams()
    if (is_code(search)) {
        sp.append('code', search)
    } else {
        sp.append('searchstr', search)
    }
    let clientid;
    try {
        clientid = encodeURIComponent(calc_tks_ru_license.split('\n').join(''))
    } catch (e) {
        // nothing yet
    }
    const url = `https://api.tks.ru/tree.json/json/${clientid}/search/?${sp.toString()}`
    const starttime = new Date().getTime();
    return fetch(url).then((r) => {
        const endtime = new Date().getTime();
        const duration = endtime - starttime;
        debug(`search ${search}: ${duration} ms`);
        return r.json()}
    );
}

export {
    getTreeData
}