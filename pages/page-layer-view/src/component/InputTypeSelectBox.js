import React from 'react';
import { FieldArray } from 'redux-form';
import Select from './ReduxFormComponents/Select';
import LayerFieldOptionList from './LayerFieldOptionList';


export default function InputTypeSelectBox(props) {
  const { value } = props.input;


  return (
    <div>
      <Select {...props} />


      <div className={`${['radio', 'checkbox', 'select'].includes(value) ? '' : 'hidden'}`}>
        <FieldArray name="options" component={LayerFieldOptionList} />
      </div>
    </div>
  );
}
