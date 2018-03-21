import React from 'react';
import Form from 'antd/es/form';
import Switch from 'antd/es/switch';
import Input from 'antd/es/input';
import Button from 'antd/es/button';

export function FormGroup({ label, ...rest }) {
  const labelCol = {
    xs: { span: 24 },
    sm: { span: 6 },
  };
  const wrapperCol = {
    xs: { span: 24 },
    sm: { span: 14 },
  };

  return (
    <Form.Item label={label} labelCol={labelCol} wrapperCol={wrapperCol} {...rest} />
  );
}


export function InputBox({ label, input, ...rest }) {
  return (
    <FormGroup label={label}>
      <Input {...input} {...rest} />
    </FormGroup>
  );
}

export function CheckBox({ label, input, ...rest }) {
  return (
    <FormGroup label={label}>
      <Switch {...input} {...rest} checked={!!input.value} />
    </FormGroup>
  );
}

export function CardTitle({ text }) {
  return (
    <span style={{ fontSize: '30px' }}>{text}</span>
  );
}

export function CardExtra({ form }) {
  return [
    <Button
      key="submit"
      htmlType="submit"
      type="primary"
      size="large"
      form={form}
    >提交</Button>,
  ];
}
