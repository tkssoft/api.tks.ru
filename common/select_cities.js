/* тест react-select для выбора городов */

import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';
import classNames from 'classnames';

const fetchData = (term, mode) => {
    try {
        const eterm = encodeURIComponent(term);
        const url = `https://w7.tks.ru:5002/?term=${eterm}&mode=${mode}`;
        return fetch(url).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                let err = new Error(response.statusText);
                err.code = response.status;
                throw err;
            }
        })
    } catch (e) {
        throw e;
    }
}

const get_item = (akey, avalue) => {
    return {value: akey, label: akey};
}

const get_items = avalues => {
    return avalues.map((value, index) => {
        return get_item(value);
    })
}

const promiseOptions = mode => {
    return inputValue => {
        return new Promise((resolve, reject) => {
            if (!inputValue) {
                return resolve([]);
            }
            fetchData(inputValue, mode).then(data => {
                let r = get_items(data);
                return resolve(r);
            }).catch(
                error => {
                    reject(error);
                }
            )
        })
    }
}


class CitiesSelect extends Component {

    state = {
        selectedOption: null,
    };

    handleChange = selectedOption => {
        this.setState(
            { selectedOption }
        );
        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    name: this.props.name,
                    value: selectedOption === null ? '' : selectedOption.value
                }
            })
        }
    };

    render() {

        // const { selectedOption } = this.state;

        const v = {value: this.props.value, label: this.props.value};

        // console.log('selectedOption', v, selectedOption);

        const cls = classNames({
            'ccs-city-select': true,
            'ccs-select': true,
        })

        return (
           <AsyncSelect value={v}
                        onChange={this.handleChange}
                        loadOptions={promiseOptions(this.props.mode)}
                        placeholder={this.props.placeholder || ''}
                        classNamePrefix={this.props.classNamePrefix || 'ccs-select-sm'}
                        noOptionsMessage={inputValue => {
                            // console.log('noOptionsMessage', inputValue)
                            return "Нет подходящих названий..."
                        }}
                        loadingMessage={()=>{return "Загрузка..."}}
                        className={cls}
                        id={this.props.id}
                        name={this.props.name}
                        defaultOptions
                        isClearable
            />
        );
    }
}


export {
    CitiesSelect
}