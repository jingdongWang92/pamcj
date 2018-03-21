import React from 'react';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import merge from 'lodash/fp/merge';
import { TYPE_ROTATION } from '@jcmap/constant-style-types';


export default class RotationEditor extends React.Component {

  static propTypes = {

  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_ROTATION,
      enabled: true,
      [propertyName]: property,
    }));
  }

  render() {
    const { value: rotation } = this.props;
    if (!rotation) { return null; }

    const { value } = rotation;

    return (
      <Form.Item label="旋转">
        <InputNumber
          value={value}
          onChange={this.handlePropertyChange('value')}
        />
      </Form.Item>
    );
  }
}
