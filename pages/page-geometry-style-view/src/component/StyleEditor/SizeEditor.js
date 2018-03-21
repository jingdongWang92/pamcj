import React from 'react';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import merge from 'lodash/fp/merge';
import { TYPE_SIZE } from '@jcmap/constant-style-types';


export default class SizeEditor extends React.Component {

  static propTypes = {

  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_SIZE,
      enabled: true,
      [propertyName]: property,
    }));
  }

  render() {
    const { value: size } = this.props;
    if (!size) { return null; }

    const { value } = size;

    return (
      <Form.Item label="大小">
        <InputNumber
          min={1}
          value={value}
          onChange={this.handlePropertyChange('value')}
        />
      </Form.Item>
    );
  }
}
