
import React from 'react';
import DatePicker from 'react-datepicker';
import { BaseContractEdit } from './basecontractedit';
import ru from 'date-fns/locale/ru';
import MaskedInput from 'react-text-mask';

class MaskDateInput extends React.Component {
    render () {
        console.log('MaskDateInput', this.props)
        return (
            <MaskedInput
                mask={[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
            />
        );
    }
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

/>

*/
    const { value, onChange } = props;
    console.log('BaseDateInput', value)
    // ToDo: сделать общую функцию формирования className с form-control
    return (
        <DatePicker
            // customInput={<MaskedInput
            //     mask={[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
            // />}
            isClearable
            closeOnScroll={true}
            locale={ru}
            onChange={(d)=>{
                onChange({
                    target: {value: d}
                })
            }}
            className={"form-control form-control-sm"}
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
