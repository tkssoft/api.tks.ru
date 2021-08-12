/* Выпадающий список с наименованием поля */

import React from 'react';
import { BaseSelectEdit } from './baseselectedit';
import { BaseContractEdit } from './basecontractedit';

const SelectEdit = (props) => {
    return (
        <BaseContractEdit
            {...props}
        >
            {(prs) => {
                return (
                    <BaseSelectEdit
                        {...prs}
                    />
                )
            }}
        </BaseContractEdit>
    )
}

export {
    SelectEdit
}