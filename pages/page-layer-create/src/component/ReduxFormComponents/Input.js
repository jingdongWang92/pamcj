import React from 'react';
import Input from 'antd/es/input';


export default function ({ input, ...rest }) {
  return (
    <Input {...input} {...rest} />
  );
}
