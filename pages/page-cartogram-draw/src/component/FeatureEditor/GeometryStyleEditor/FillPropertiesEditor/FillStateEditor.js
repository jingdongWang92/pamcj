import React, { Component } from 'react';
import Form from 'antd/es/form';
import Switch from 'antd/es/switch';


export default class FillStateEditor extends Component {

  render() {
    const { value, onChange } = this.props;


    return (
      <Form.Item label="是否填充颜色">
        <Switch
          defaultChecked={value}
          onChange={onChange}
          checkedChildren="填充"
          unCheckedChildren="不填充"
        />
      </Form.Item>
    )
  }
}
