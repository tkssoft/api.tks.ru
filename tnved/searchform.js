
import React, { useState, useEffect, useRef } from "react";
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

    const { isclasses, onSearchResults, code, onSearch, placeholder="Введите код...", onClick, onresultbuttons } = props;
    const [ value, setValue ] = useState(code || '');
    const [ state, setState ] = useState({'count' : 0, 'search' : ''});
    const input = useRef(null);

    useEffect(() => {
        if (state.search) {
            if (onSearch) {
                if (input && input.current) {
                    input.current.blur();
                };
                onSearch(state.search, onSearchResults);
            }
        }
    }, [state]);

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) {
            onClick(e);
        }
        setState({'count' : state.count + 1, 'search' : value});
    };

    return (
        <form className="form-inline ccs-searchform my-2">
            <input
                className={classNames("form-control-sm mr-2", {[props.inputClassName] : props.inputClassName})}
                type="text"
                placeholder = {placeholder}
                value={state.value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={ handleEnter }
                ref={input}
            />
            <button
                className="btn btn-sm btn-primary my-2"
                onClick={handleSearch}
            >
                Поиск
            </button>
            {onresultbuttons && onresultbuttons(props)}
        </form>
    )
}

const TnvSearchForm = (props) => {
    const { eventname=event_searchresults } = props;
    const [ searchResult, setSearchResult ] = useState({
        'current' : null,
        'data' : null,
        'onSearchResults' : null,
    });
    useEffect(() => {
        const { current, data, onSearchResults } = searchResult;
        if (data && data.length > 0) {
            const result = data[current || 0];
            if (onSearchResults) {
                onSearchResults([result, ]);
            } else {
                fire_result_event(eventname, [result, ]);
            }
        }
    }, [searchResult]);
    return (
        <SearchForm
            onSearch={(search, onSearchResults) => {
                getTreeData(search).then((data) => {
                    setSearchResult({
                        'current' : 0,
                        'data' : data,
                        'onSearchResults' : onSearchResults,
                    });
                })
            }}
            onresultbuttons={(props) => {
                const { current, data } = searchResult;
                if (data && data.length > 0) {
                    return (
                        <div className="btn-group btn-group-sm ml-2">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (current > 0) {
                                        setSearchResult({
                                            ...searchResult,
                                            'current' : current - 1,
                                        });
                                    }
                                }}
                            >
                                &lt;
                            </button>
                            <div className="ccs-search-results-counter">{current + 1} из {data.length}</div>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (current < data.length - 1) {
                                        const sr = {
                                            ...searchResult,
                                            'current' : current + 1,
                                        };
                                        setSearchResult(sr);
                                    }
                                }}
                            >
                                &gt;
                            </button>
                        </div>
                    )
                }
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