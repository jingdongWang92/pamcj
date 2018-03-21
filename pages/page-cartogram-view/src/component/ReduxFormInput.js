import React from 'react';
import Input from 'antd/es/input';
import FormItem from './FormItem';


export default function ReduxFormInput({ input, onInput, ...rest }) {
  return (
    <FormItem {...rest}>
      <Input {...input} onInput={onInput} />
    </FormItem>
  );
}
