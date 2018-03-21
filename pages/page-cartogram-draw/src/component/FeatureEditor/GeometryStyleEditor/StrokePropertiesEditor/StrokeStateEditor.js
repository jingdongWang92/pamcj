import React, { Component } from 'react';
import Form from 'antd/es/form';
import Switch from 'antd/es/switch';

export default class StrokeStateEditor extends Component {

  render() {
    const { value, onChange } = this.props;


    return (
      <Form.Item label="是否显示笔画线条">
        <Switch
          defaultChecked={value}
          onChange={onChange}
          checkedChildren="显示"
          unCheckedChildren="不显示"
        />
      </Form.Item>
    )
  }
}
