import React from 'react';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import merge from 'lodash/fp/merge';
import { TYPE_OPACITY } from '@jcmap/constant-style-types';


export default class OpacityEditor extends React.Component {

  static propTypes = {

  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_OPACITY,
      enabled: true,
      [propertyName]: property,
    }));
  }

  render() {
    const { value: opacity } = this.props;
    if (!opacity) { return null; }

    const { value } = opacity;

    return (
      <Form.Item label="透明度">
        <InputNumber
          min={0.0}
          max={1.0}
          step={0.01}
          value={value}
          onChange={this.handlePropertyChange('value')}
        />
      </Form.Item>
    );
  }
}
