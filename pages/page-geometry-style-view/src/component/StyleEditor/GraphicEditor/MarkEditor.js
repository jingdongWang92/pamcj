import React from 'react';
import Select from 'antd/es/select';
import Form from 'antd/es/form';
import Collapse from 'antd/es/collapse';
import FillEditor from '../FillEditor';
import StrokeEditor from '../StrokeEditor';
import merge from 'lodash/fp/merge';
import { TYPE_MARK } from '@jcmap/constant-style-types';


export default class MarkEditor extends React.Component {

  static propTypes = {

  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_MARK,
      enabled: true,
      [propertyName]: property,
    }));
  }

  render() {
    const { value } = this.props;
    if (!value) { return null; }

    const { shape, fill, stroke } = value;

    return [
      <Form.Item key="shape" label="形状">
        <Select
          value={shape}
          onChange={this.handlePropertyChange('shape')}
        >
          <Select.Option value="circle">圆形</Select.Option>
          <Select.Option value="square">方块</Select.Option>
        </Select>
      </Form.Item>,

      <Collapse key="fill_and_stroke" defaultActiveKey="fill">
        <Collapse.Panel header="Fill" key="fill">
          <FillEditor
            value={fill}
            onChange={this.handlePropertyChange('fill')}
          />
        </Collapse.Panel>

        <Collapse.Panel header="Stroke">
          <StrokeEditor
            value={stroke}
            onChange={this.handlePropertyChange('stroke')}
          />
        </Collapse.Panel>
      </Collapse>
    ];
  }
}
