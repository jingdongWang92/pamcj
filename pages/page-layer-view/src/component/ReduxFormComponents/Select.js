import React from 'react';
import Select from 'antd/es/select';


function ReduxFormSelect({ input, ...rest }) {
  return (
    <Select {...input} {...rest} />
  );
}
ReduxFormSelect.Option = Select.Option;


export default ReduxFormSelect;
