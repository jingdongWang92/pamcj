import React from 'react';
import { Field } from 'redux-form';
import FormItem from './FormItem';
import Input from './ReduxFormComponents/Input';


export default function LayerFieldOption() {
  return (
    <div>
      <Field name="id" type="hidden" component="input" />

      <FormItem label="选项名">
        <Field name="name" type="text" component={Input} required={true}/>
      </FormItem>

      <FormItem label="选项值">
        <Field name="value" type="text" component={Input} required={true}/>
      </FormItem>
    </div>
  );
}
