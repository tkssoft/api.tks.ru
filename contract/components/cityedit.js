/* Редактирование названия городов */
const React  = require('react');

const { CitiesSelect } = require('../../common/select_cities')
const { BaseContractEdit } = require('./basecontractedit')

const CityEdit = (props) => {
    return (
        <BaseContractEdit
            {...props}
        >
            {(prs) => {
                return <CitiesSelect {...prs} />
            }}
        </BaseContractEdit>
    )
}


export {
    CityEdit
}