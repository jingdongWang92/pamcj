import React from 'react';
import Select from 'antd/es/select';
import Form from 'antd/es/form';
import Collapse from 'antd/es/collapse';
import MarkEditor from './MarkEditor';
import ExternalGraphicEditor from './ExternalGraphicEditor';
import merge from 'lodash/fp/merge';
import { TYPE_GRAPHIC } from '@jcmap/constant-style-types';


export default class GraphicEditor extends React.Component {

  static propTypes = {

  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_GRAPHIC,
      enabled: true,
      [propertyName]: property,
    }));
  }

  handleGraphicTypeChange = graphicType => {
    this.props.onChange(merge(this.props.value, {
      type: 'graphic',
      enabled: true,
      value: merge(this.props.value.value, {
        type: graphicType,
      }),
    }));
  }

  render() {
    const { value: graphic } = this.props;
    if (!graphic) { return null; }

    return (
      <Collapse defaultActiveKey="graphic">
        <Collapse.Panel header="Graphic" key="graphic">
          <Form.Item label="图形类型">
            <Select
              value={graphic.value.type}
              onChange={this.handleGraphicTypeChange}
            >
              <Select.Option value="mark">色块</Select.Option>
              <Select.Option value="external_graphic">图片</Select.Option>
            </Select>
          </Form.Item>

          <Collapse defaultActiveKey="color">
            {graphic && graphic.value.type === 'mark' && (
              <Collapse.Panel header="色块" key="color">
                <MarkEditor
                  value={graphic.value}
                  onChange={this.handlePropertyChange('value')}
                />
              </Collapse.Panel>
            )}

            {graphic && graphic.value.type === 'external_graphic' && (
              <Collapse.Panel header="图片">
                <ExternalGraphicEditor
                  value={graphic.value}
                  onChange={this.handlePropertyChange('value')}
                />
              </Collapse.Panel>
            )}
          </Collapse>
        </Collapse.Panel>
      </Collapse>
    );
  }
}
