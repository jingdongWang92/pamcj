import React from 'react';
import AutoComplete from 'antd/es/auto-complete';

const Option = AutoComplete.Option;

export default function ({ input, ...rest }) {

  const children = rest.dataSource.map((option) => {
    return <Option key={option.key}>{option.title}</Option>
  });

  return (
    <AutoComplete {...input} {...rest} children={children} />
  );
}
