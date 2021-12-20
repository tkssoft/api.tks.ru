/* Редактирование названия городов */
const React  = require('react');

const { CitiesSelect } = require('../../common/select_cities');
const { BaseContractEdit } = require('./basecontractedit');

const { ControlFactory, ContractControlCreation } = require('./controlfactory');

const CT_CITY = 'Город';

const CityEdit = (props) => {
    return (
        <BaseContractEdit
            {...props}
        >
            {(prs) => {
                //console.log('CityEdit', prs.fieldname, prs.value, prs.save);
                return <CitiesSelect {...prs} />
            }}
        </BaseContractEdit>
    )
}

class CityFactory extends ContractControlCreation {

    type () {
        return CT_CITY;
    }

    create (props) {
        return <CityEdit {...props} />
    }

}

new ControlFactory()
    .register_control(new CityFactory({}))
    ;

export {
    CT_CITY
}