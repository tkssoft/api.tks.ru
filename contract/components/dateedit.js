
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { BaseContractEdit, get_input_className } from './basecontractedit';
import ru from 'date-fns/locale/ru';
import MaskedInput from 'react-text-mask';
//import moment from 'moment';

// moment.locale('ru', {
//     week: {
//         dow: 1,
//     }
// });

class MaskDateInput extends React.Component {
    render () {
        return (
            <MaskedInput
                mask={[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
            />
        );
    }
}

const zfill = (d) => {
    const r = '00' + d.toString();
    return r.slice(-2);
}

const date_to_string = (d) => {
    if (d) {
        return `${d.getFullYear()}-${zfill(d.getMonth() + 1)}-${zfill(d.getDate())}`
    }
    return d;
}

const string_to_date = (s) => {
    if (s) {
        const [y, m, d] = s.split('-');
        return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    }
    return s
}

const BaseDateInput = (props) => {
    /* selected={startDate}
       dateFormat="yyyy/MM/dd"
       shouldCloseOnSelect={false} - показывать календарь
       onChangeRaw={event => handleChangeRaw(event.target.value)} - обычные onchange
       showPopperArrow={false} - не показывать стрелку над календарем
       inline - просто календарь

customInput={<MaskedInput
  mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
/>}

<MaskedInput
  mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
  className="form-control"
  placeholder="Enter a phone number"
  guide={false}
  id="my-input-id"
  onBlur={() => {}}
  onChange={() => {}}
            className="red-border"
            calendarClassName="rasta-stripes"
    locale={ru}

/>

*/
    const { value, onChange, className } = props;
    // ToDo: сделать общую функцию формирования className с form-control
    const cls = get_input_className(props);
    const ru_locale = {
        ...ru,
        // options: {
        //     ...ru.options,
        //     weekStartsOn: 0
        // }
        // https://github.com/y0c/react-datepicker/issues/55
    };
    const selected = string_to_date(value);
    return (
        <DatePicker
            customInput={<MaskedInput
                mask={[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
            />}
            selected={selected}
            onChange={date=>{
                onChange({target: {
                     value: date_to_string(date)
                }})
            }}
            dateFormat="dd.MM.yyyy"
            className="form-control form-control-sm"
            locale={ru_locale}
            wrapperClassName={cls}
        />
    )
};

const ContractDateInput = (props) => {
    return (
        <BaseContractEdit {...props}>
            {(prs) => {
                return <BaseDateInput {...prs}/>
            }}
        </BaseContractEdit>
    );
};

export {
    ContractDateInput,
};
