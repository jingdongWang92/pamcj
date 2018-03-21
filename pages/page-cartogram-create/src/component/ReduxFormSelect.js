import React from 'react';
import Select from 'antd/es/select';
import FormItem from './FormItem';


export default function ReduxFormSelect({ input, children, ...rest }) {
  return (
    <FormItem {...rest}>
      <Select {...input} children={children} />
    </FormItem>
  );
}
ReduxFormSelect.Option = Select.Option;
