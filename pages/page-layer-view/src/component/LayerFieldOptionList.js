import React from 'react';
import uuid from 'uuid';
import Button from 'antd/es/button';
import LayerFieldOptionItem from './LayerFieldOptionItem';


export default function LayerFieldOptionList({ fields }) {
  return (
    <div>
      {fields.map((item, index) => (
        <LayerFieldOptionItem key={index} field={item} removeField={() => fields.remove(index)} />
      ))}


      <div className="text-center">
        <Button htmlType="button" onClick={() => fields.push({ id: uuid() })}>添加选项</Button>
      </div>
    </div>
  );
}
