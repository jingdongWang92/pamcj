import React from 'react';
import ColorPicker from '@jcmap/component-color-picker';
import Switch from 'antd/es/switch';
import Form from 'antd/es/form';
import merge from 'lodash/fp/merge';
import { TYPE_FILL } from '@jcmap/constant-style-types';


export default class FillEditor extends React.Component {

  static propTypes = {

  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_FILL,
      [propertyName]: property,
    }));
  }

  render() {
    const { value } = this.props;
    if (!value) { return null; }

    const { enabled, color } = value;

    return [
      <Form.Item key="enabled" label="是否显示填充">
        <Switch
          checkedChildren="显示"
          unCheckedChildren="不显示"
          checked={enabled}
          onChange={this.handlePropertyChange('enabled')}
        />
      </Form.Item>,

      <Form.Item key="fill_color" label="填充颜色">
        <ColorPicker
          value={color}
          onChange={this.handlePropertyChange('color')}
        />
      </Form.Item>,
    ];
  }
}
