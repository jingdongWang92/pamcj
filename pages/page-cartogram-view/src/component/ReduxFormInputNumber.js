import React from 'react';
import InputNumber from 'antd/es/input-number';
import FormItem from './FormItem';


export default function FormItemNumber({ input, min, ...rest }) {
  return (
    <FormItem {...rest} addonBefore="mi">
      <InputNumber {...input} min={min} />
    </FormItem>
  );
}
