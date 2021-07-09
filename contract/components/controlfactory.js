/* Создание пользовательских контролов по настройкам */

const controltypes = {};

const CT_INPUT = 1;
const CT_DATEINPUT = 2;
const CT_SELECT = 3;
const CT_CITY_TO = 4;
const CT_CITY_FROM = 5;
const CT_NUMERICINPUT = 6;
const CT_CALCFIELD = 7;

const create_control = (fieldconfig) => {
    const { typ, fieldname, displaylabel, data } = fieldconfig;

};

const register_control = (typ, ctrlfunc) => {
    if (!(typ in Object.keys(controltypes))) {
        controltypes[typ] = ctrlfunc;
    }
    return controltypes[typ];
};

export {
    create_control,
    register_control,
    CT_INPUT,
    CT_DATEINPUT,
    CT_SELECT,
    CT_CITY_TO,
    CT_CITY_FROM,
    CT_NUMERICINPUT,
    CT_CALCFIELD,
}