import React from 'react';
import InputNumber from 'antd/es/input-number';



export default function ({ input, ...rest }) {
  return (
    <InputNumber {...input} {...rest} />
  );
}
