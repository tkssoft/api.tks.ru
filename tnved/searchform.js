
import React, { useState, useEffect } from "react";
import { debug } from "../common/debug";
import { getTreeData } from './tnved_search';
import classNames from "classnames";

const event_searchresults = 'tnvsearchresults';

const fire_result_event = (eventname, data) => {
    let tnvsearchresults = new CustomEvent(eventname, {
        detail: {
            results: data,
        }
    });
    document.dispatchEvent(tnvsearchresults);
};

const SearchForm = (props) => {

    const { isclasses, onSearchResults, code, onSearch, placeholder="Введите код...", onClick } = props
    const [ value, setValue ] = useState(code || '')
    const [ search, setSearch ] = useState('')

    useEffect(() => {
        if (search) {
            debug('setSearch', search);
            if (onSearch) {
                onSearch(search, onSearchResults)
            }
        }
    }, [search]);

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
        setSearch(value);
    };

    return (
        <form className="form-inline ccs-searchform my-2">
            <input
                className={classNames("form-control-sm mr-2", {[props.inputClassName] : props.inputClassName})}
                type="text"
                placeholder = {placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={ handleEnter }
            />
            <button
                className="btn btn-sm btn-outline-success my-2"
                onClick={handleSearch}
            >
                Поиск
            </button>
        </form>
    )
}

const TnvSearchForm = (props) => {
    const { eventname=event_searchresults } = props
    return (
        <SearchForm
            onSearch={(search, onSearchResults) => {
                getTreeData(search).then((data) => {
                    if (onSearchResults) {
                        onSearchResults(data)
                    } else {
                        fire_result_event(eventname, data)
                    }
                })
            }}
            {...props}
        />
    )
}

module.exports = {
    TnvSearchForm,
    SearchForm,
    fire_result_event,
    event_searchresults
}