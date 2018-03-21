import React from 'react';
import Select from 'antd/es/select';
import FormItem from './FormItem';


export default function ReduxFormSelect({ input, children, disabled, ...rest }) {
  return (
    <FormItem {...rest}>
      <Select {...input} children={children} disabled={disabled} />
    </FormItem>
  );
}
ReduxFormSelect.Option = Select.Option;
