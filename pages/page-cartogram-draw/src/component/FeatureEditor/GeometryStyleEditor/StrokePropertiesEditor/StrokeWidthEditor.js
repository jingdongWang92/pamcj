import React, { Component } from 'react';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';


export default class StrokeWidthEditor extends Component {

  render() {
    const { enabled, value, onChange } = this.props;

    return enabled && (
      <Form.Item label="笔画宽度(像素)">
        <InputNumber
          defaultValue={value}
          onChange={onChange}
          min={1}
        />
      </Form.Item>
    );
  }
}
