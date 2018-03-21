import React from 'react';
import Form from 'antd/es/form';


export default function FormItem(props) {
  const labelCol = {
    xs: { span: 24 },
    sm: { span: 6 },
  };
  const wrapperCol = {
    xs: { span: 24 },
    sm: { span: 12 },
  };

  return (
    <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} {...props} />
  );
}
