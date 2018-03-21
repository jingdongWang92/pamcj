import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import merge from 'lodash/fp/merge';
import { TYPE_DISPLACEMENT } from '@jcmap/constant-style-types';


export default class DisplacementEditor extends React.Component {

  static propTypes = {
    value: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    onChange: PropTypes.func.isRequired,
  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_DISPLACEMENT,
      enabled: true,
      [propertyName]: property,
    }));
  }

  render() {
    const { value } = this.props;
    if (!value) { return null; }

    const { x, y } = value;

    return (
      <Form.Item label="显示位置" extra="表示Graphic相对于元素中心点的偏移, 默认值 0, 0 表示显示在元素中心点">
        <Row>
          <CustomInput
            label="X:"
            value={x}
            onChange={this.handlePropertyChange('x')}
          />

          <CustomInput
            label="Y:"
            value={y}
            onChange={this.handlePropertyChange('y')}
          />
        </Row>
      </Form.Item>
    );
  }
}


function CustomInput({ label, value, onChange }) {
  return [
    <Col key="label" span={1}>{label}</Col>,
    <Col key="input" span={4}>
      <InputNumber
        value={value}
        onChange={onChange}
      />
    </Col>,
  ];
}
