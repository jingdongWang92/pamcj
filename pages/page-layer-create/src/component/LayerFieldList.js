import React from 'react';
import Button from 'antd/es/button';
import Icon from 'antd/es/icon';
import uuid from 'uuid';
import LayerFieldItem from './LayerFieldItem';


export default function LayerFieldList({ fields, ...rest }) {
  return (
    <div>
      {fields.map((field, index) => (
        <LayerFieldItem key={index} field={field} removeField={() => fields.remove(index)} />
      ))}


      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <Button type="primary" htmlType="button" size="large" style={{ width: '15%' }} onClick={() => fields.push({ id: uuid() })}>
          <Icon type="plus" />添加属性
        </Button>
      </div>
    </div>
  );
}
