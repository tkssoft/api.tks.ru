
/*

     Построение дерева ТН ВЭД

*/

const { debug } = require('../common/debug');
const { get_api_tks_ru } = require('../common/consts');
import { isNullStr } from '../common/utils';

const LASTNEXTID = 200000000;
const DEFAULTID = 10;


const format_id = (nodeid) => ('00000000' + nodeid.toString()).slice(-8);
const clientid = () => encodeURIComponent(calc_tks_ru_license.split('\n').join(''));
const get_tree_url = (nodeid) => `${get_api_tks_ru()}/tree.json/json/${clientid()}/${nodeid}.json`;
const get_code_url = (code) => `${get_api_tks_ru()}/tree.json/json/${clientid()}/search/?code=${code}`;


const loadData = (() => {
    const cache = {};
    return (nodeid) => {
        const url = get_tree_url(nodeid);
        if (nodeid in cache) {
            return Promise.resolve(cache[nodeid]);
        };
        return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.statusText)
                }
            }).then((data) => {
                cache[nodeid] = data;
                return Promise.resolve(data);
            });
    };
})();


/* поиск идентификатора в дереве по коду ТН ВЭД */
const getCodeID = (code) => {
    const url = get_code_url(code);
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText)
            }
        })
};



/*
    Вставка данных в дерево
    items - массив элементов дерева - первоначально пустой
    id - ID родительского элемента
    index - начальный индекс вставки (после родительского элемента) по сути это индекс следующего элемента после id
    level - уровень вложенности для вставки - level родительского элемента + 1
    nextid - ID следующего элемента после id на уровне level - 1
    initid - ID элемента, до которого нужно добраться (по умолчанию DEFAULTID)

    Возвращает массив элементов дерева с вставленными данными

    insertData([], DEFAULTID, 0, 0, LASTNEXTID, 10) - вставка корневого списка элементов
*/

const insertData = (items, id, index, level, nextid, initid=DEFAULTID) => {
    debug('insertData', id, index, level, nextid, initid);
    return loadData(format_id(id)).then((data) => {

        let prior = null;
        let next = null;
        let nextindex = 0;
        let found = false;

        //debug('data', data);

        let newitems = data.reduce((obj, item) => {
            if (prior !== null) {
                prior.nextid = item.ID;
                if (next !== null && initid > prior.nextid) {
                    next = null;
                }
            }
            prior = {...item, parentid: id, level: level, nextid: nextid};
            nextindex = obj.push(prior);

            if (id !== initid) {
                if (prior.ID === initid) {
                    found = true;
                } else if (initid > prior.ID && initid < prior.nextid) {
                    next = {
                        ...prior,
                        parentindex: nextindex
                    }
                }
            }
            return obj
        }, items.slice(0, index))
        // Добавляем остаток массива
        .concat(items.slice(index, items.length));

        if (next !== null && !found) {
            return insertData(newitems, next.ID, next.parentindex, next.level + 1, next.nextid, initid);
        };

        return Promise.resolve(newitems);

    })
};


const removeData = (items, startid, endid) => {
    return Promise.resolve(items.filter((item) => {
        return !(item.ID > startid && item.ID < endid);
    }))
};


const insertRoot = (initid) => {
    return insertData([], DEFAULTID, 0, 0, LASTNEXTID, initid);
};


const insertCode = (code) => {
    if (!isNullStr(code)) {
        return getCodeID(code).then((data) => {
            return insertRoot(data.length > 0 ? data[0].ID : DEFAULTID);
        });
    };
    return insertRoot(DEFAULTID);
}

export {
    insertData,
    removeData,
    insertRoot,
    insertCode,
    LASTNEXTID,
    DEFAULTID
}