import React from 'react';
import Form from 'antd/es/form';


export default function FormItem(props) {
  return (
    <Form.Item
      labelCol={{
        xs: { span: 24 },
        sm: { span: 6 },
      }}
      wrapperCol={{
        xs: { span: 24 },
        sm: { span: 12 },
      }}
      {...props}
    />
  );
}
