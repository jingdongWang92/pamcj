import React from 'react';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import CoordinatePicker from '@jcmap/component-coordinate-picker';


export default function EnhancedCoordinatePicker({ input, ...rest }) {
  const { value, onChange } = input;
  const latitude = Number.parseFloat(value && value.coordinates && value.coordinates[1]);
  const longitude = Number.parseFloat(value && value.coordinates && value.coordinates[0]);
  const formattedValue = Number.isNaN(latitude) || Number.isNaN(longitude) ? null : { latitude, longitude };


  return (
    <Row gutter={16}>
      <Col span={24}>
        <CoordinatePicker value={formattedValue} onChange={_value => onChange(formatLocation(_value))} />
      </Col>
    </Row>
  );
}


function formatLocation(_value) {
  if (!_value) { return null; }
  return {
    type: 'Point',
    coordinates: [_value.longitude, _value.latitude],
  };
}
