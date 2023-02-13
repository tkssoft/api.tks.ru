
/**
 * Дерево ТН ВЭД с обработкой результатов поиска
 *
 *
**/

import React, { useRef, useCallback } from 'react';
import { useEventListener } from '../common/hooks';
import { debug } from '../common/debug';
import { event_searchresults } from './searchform';
import { TnvTree } from './tnvtree';

const SearchTnvTree = (props) => {

    const { onSearchResults } = props;
    const tree = useRef(null);

    const searchresults_handler = useCallback(
        (customevent) => {
            const result = customevent.detail.results;
            if (result.length > 0) {
                const first = result[0];
                tree.current.setInitId(parseInt(first.ID));
            } else {
                // ToDo: сделать модульное окно с инфомацией об ошибке.
                alert('Внимание! Информация по коду не найдена.');
            }
            if (onSearchResults) {
                onSearchResults(result);
            }
        },
        []
    );

    useEventListener(event_searchresults, searchresults_handler, document);

    return (
        <TnvTree ref={tree} {...props}/>
    );
}

export {
    SearchTnvTree
}