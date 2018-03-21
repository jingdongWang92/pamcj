import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Slider from 'antd/es/slider';
import merge from 'lodash/fp/merge';
import { TYPE_ANCHOR_POINT } from '@jcmap/constant-style-types';


export default class AnchorPointEditor extends React.Component {

  static propTypes = {
    value: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    onChange: PropTypes.func.isRequired,
  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_ANCHOR_POINT,
      enabled: true,
      [propertyName]: property,
    }));
  }

  render() {
    const { value } = this.props;
    if (!value) { return null; }

    const { x, y } = value;

    return (
      <Form.Item label="锚点" extra="Graphic在旋转或平移是时的中心点">
        <Row>
          <CustomSlider
            label="X:"
            value={x}
            onChange={this.handlePropertyChange('x')}
          />

          <CustomSlider
            label="Y:"
            value={y}
            onChange={this.handlePropertyChange('y')}
          />
        </Row>
      </Form.Item>
    );
  }
}


function CustomSlider({ label, value, onChange }) {
  return [
    <Col key="label" span={1}>{label}</Col>,
    <Col key="slider" span={7}>
      <Slider
        min={0.0}
        max={1.0}
        step={0.01}
        value={value}
        onChange={onChange}
      />
    </Col>,
    <Col key="input" span={4}>
      <InputNumber
        min={0.0}
        max={1.0}
        style={{ marginLeft: 16 }}
        value={value}
        onChange={onChange}
      />
    </Col>,
  ];
}
