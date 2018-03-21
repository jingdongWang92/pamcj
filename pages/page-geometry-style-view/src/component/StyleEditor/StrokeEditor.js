import React from 'react';
import ColorPicker from '@jcmap/component-color-picker';
import Switch from 'antd/es/switch';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import merge from 'lodash/fp/merge';
import { TYPE_STROKE } from '@jcmap/constant-style-types';


export default class StrokeEditor extends React.Component {

  static propTypes = {

  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_STROKE,
      [propertyName]: property,
    }));
  }

  render() {
    const { value } = this.props;
    if (!value) { return null; }

    const { enabled, width, color } = value;

    return [
      <Form.Item key="enabled" label="是否显示笔画">
        <Switch
          checkedChildren="显示"
          unCheckedChildren="不显示"
          checked={enabled}
          onChange={this.handlePropertyChange('enabled')}
        />
      </Form.Item>,

      <Form.Item key="stroke_color" label="笔画颜色">
        <ColorPicker
          value={color}
          onChange={this.handlePropertyChange('color')}
        />
      </Form.Item>,

      <Form.Item key="stroke_width" label="笔画宽度">
        <InputNumber
          value={width}
          min={1}
          onChange={this.handlePropertyChange('width')}
        />
      </Form.Item>,
    ];
  }
}
