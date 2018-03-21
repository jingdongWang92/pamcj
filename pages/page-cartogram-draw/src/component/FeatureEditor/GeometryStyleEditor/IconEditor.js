import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorPicker from '@jcnetwork/component-color-picker';
import uuid from 'uuid';
import Form from 'antd/es/form';
import Input from 'antd/es/input';


export default class GeometryStyleEditor extends Component {
  handleGeometryStyleChange = feature => styleName => styleValue => {
    const newGeometryStyle = Object.assign({}, feature.geometry_style, {
      id: feature.geometry_style._is_changed ? feature.geometry_style.id : uuid(),
      _is_changed: true,
      [styleName]: styleValue,
    });
    const newFeature = Object.assign({}, feature, {
      geometry_style: newGeometryStyle,
    });
    this.props.updateFeature(newFeature);
  }


  render() {
    const { feature } = this.props;


    if (!feature.geometry_style) { return null; }


    const onStrokeChange = this.handleGeometryStyleChange(feature)('stroke');
    const onStrokeWidthChange = this.handleGeometryStyleChange(feature)('stroke_width');
    const onStrokeColorChange = this.handleGeometryStyleChange(feature)('stroke_color');
    const onFillChange = this.handleGeometryStyleChange(feature)('fill');
    const onFillColorChange = this.handleGeometryStyleChange(feature)('fill_color');


    const geometryType = feature.geometry_type || feature.geometry_style.geometry_type;
    const {
      stroke,
      stroke_width: strokeWidth,
      stroke_color: strokeColor,
      fill,
      fill_color: fillColor
    } = feature.geometry_style;


    if (geometryType === 'Point') {
      return null;
    } else if (geometryType === 'LineString') {
      return (
        <fieldset>
          <legend>元素样式</legend>
          <StrokeFieldGroup
            stroke={stroke}
            onStrokeChange={onStrokeChange}
            strokeWidth={strokeWidth}
            onStrokeWidthChange={onStrokeWidthChange}
            strokeColor={strokeColor}
            onStrokeColorChange={onStrokeColorChange}
          />
        </fieldset>
      );
    } else if (geometryType === 'Polygon') {
      return (
        <fieldset>
          <legend>元素样式</legend>
          <StrokeFieldGroup
            stroke={stroke}
            onStrokeChange={onStrokeChange}
            strokeWidth={strokeWidth}
            onStrokeWidthChange={onStrokeWidthChange}
            strokeColor={strokeColor}
            onStrokeColorChange={onStrokeColorChange}
          />
          <FillFieldGroup
            fill={fill}
            onFillChange={onFillChange}
            fillColor={fillColor}
            onFillColorChange={onFillColorChange}
          />
        </fieldset>
      );
    } else {
      console.warn(`invalid feature geometry_type ${geometryType}`);
      return null;
    }
  }
}

GeometryStyleEditor.propTypes = {
  updateFeature: PropTypes.func.isRequired,
};



function StrokeField({ value, onChange }) {
  return (
    <ToggleButton label="是否显示笔画" checked={value} onChange={evt => onChange(evt.target.checked)} />
  );
}
StrokeField.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};


function StrokeWidthField({ value, onChange }) {
  return (
    <Form.Item lable="笔画宽度">
      <Input
        value={value}
        onChange={evt => onChange(Number.parseInt(evt.target.value, 10))}
      />
    </Form.Item>
  );
}
StrokeWidthField.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};


function StrokeColorField({ value, onChange }) {
  return (
    <Form.Item label="笔画颜色">
      <ColorPicker value={value} onChange={value => onChange(value)} />
    </Form.Item>
  );
}
StrokeColorField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


function StrokeFieldGroup({ stroke, strokeWidth, strokeColor, onStrokeChange, onStrokeWidthChange, onStrokeColorChange }) {
  if (!stroke) {
    return (
      <div>
        <StrokeField value={stroke} onChange={onStrokeChange} />
      </div>
    );
  }


  return (
    <div>
      <StrokeField value={stroke} onChange={onStrokeChange} />
      <StrokeWidthField value={strokeWidth} onChange={onStrokeWidthChange} />
      <StrokeColorField value={strokeColor} onChange={onStrokeColorChange} />
    </div>
  );
}
StrokeFieldGroup.propTypes = {
  stroke: PropTypes.bool.isRequired,
  strokeWidth: PropTypes.number,
  strokeColor: PropTypes.string,
  onStrokeChange: PropTypes.func.isRequired,
  onStrokeWidthChange: PropTypes.func.isRequired,
  onStrokeColorChange: PropTypes.func.isRequired,
};


function FillField({ value, onChange }) {
  return (
    <ToggleButton label="是否填充" checked={value} onChange={evt => onChange(evt.target.checked)} />
  );
}
FillField.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};


function FillColorField({ value, onChange }) {
  return (
    <Form.Item label="填充颜色">
      <ColorPicker value={value} onChange={value => onChange(value)} />
    </Form.Item>
  );
}
FillColorField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


function FillFieldGroup({ fill, fillColor, onFillChange, onFillColorChange }) {
  if (!fill) {
    return (
      <div>
        <FillField value={fill} onChange={onFillChange} />
      </div>
    );
  }


  return (
    <div>
      <FillField value={fill} onChange={onFillChange} />
      <FillColorField value={fillColor} onChange={onFillColorChange} />
    </div>
  );
}
FillFieldGroup.propTypes = {
  fill: PropTypes.bool.isRequired,
  fillColor: PropTypes.string,
  onFillChange: PropTypes.func.isRequired,
  onFillColorChange: PropTypes.func.isRequired,
};


function ToggleButton({ label, ...rest }) {
  return (
    <Form.Item>
      <input type="checkbox" {...rest} />{label}
    </Form.Item>
  );
}
