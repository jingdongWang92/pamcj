import React from 'react';
import Switch from 'antd/es/switch';


export default function ({ input, ...rest }) {
  return (
    <Switch {...input} {...rest} checked={!!input.value} />
  );
}
