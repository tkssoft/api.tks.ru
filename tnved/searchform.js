
import React, { useState, useEffect } from "react";
import { debug } from "../common/debug";
import { getTreeData } from './tnved_search';

const event_searchresults = 'tnvsearchresults';

const fire_result_event = (data) => {
    let tnvsearchresults = new CustomEvent(event_searchresults, {
        detail: {
            results: data,
        }
    });
    document.dispatchEvent(tnvsearchresults);
};

const TnvSearchForm = (props) => {

    const { isclasses, onSearchResults, code } = props
    const [ value, setValue ] = useState(code || '')
    const [ search, setSearch ] = useState('')

    useEffect(() => {
        if (search) {
            debug('setSearch', search);
            getTreeData(search).then((data) => {
                if (onSearchResults) {
                    onSearchResults(data)
                } else {
                    fire_result_event(data)
                }
            })
        }
    }, [search]);

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setSearch(value);
        }
    };

    return (
        <form className="mt-2 mt-md-0 form-inline mb-md-0">
            <input
                className="form-control-sm mr-sm-2"
                type="text"
                placeholder="Введите код..."
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
                onKeyDown={ handleEnter }
            />
            <button
                className="btn btn-sm btn-outline-success my-2 my-sm-0"
                onClick={(e) => {
                    e.preventDefault();
                    setSearch(value);
                }}
            >
                Поиск
            </button>
        </form>
    )
}

module.exports = {
    TnvSearchForm,
    event_searchresults
}