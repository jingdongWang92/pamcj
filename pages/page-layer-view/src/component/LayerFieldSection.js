import React, { Component } from 'react';
import { Field, Fields } from 'redux-form';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import FormItem from './FormItem';
import Input from './ReduxFormComponents/Input';
import Select from './ReduxFormComponents/Select';
import InputTypeSelectBox from './InputTypeSelectBox';
import AutoComplete from './ReduxFormComponents/AutoComplete';
import ColorPicker from '@jcnetwork/color-picker-component';

const layerFieldNames = [{
  title: '笔画宽度',
  key: 'style:stroke:width',
}, {
  title: '笔画颜色',
  key: 'style:stroke:color',
}, {
  title: '笔画透明度',
  key: 'style:stroke:alpha',
}, {
  title: '填充颜色',
  key: 'style:fill:color',
}, {
  title: '填充透明度',
  key: 'style:fill:alpha',
}, {
  title: '建筑物高度',
  key: 'style:fill-extrusion:height',
}, {
  title: '基底高度',
  key: 'style:fill-extrusion:base-heigt',
}]


export default class LayerFieldSection extends Component {

  renderLayerProperty = ({ name, default_value, description, data_type, input_type }) => {
    return (
      <div>
        <FormItem label="属性名称">
          <Field
            name="name"
            dataSource={layerFieldNames}
            component={AutoComplete}
            filterOption={(inputValue, option) => option.props.children.includes(inputValue)}
            required={true}
          />
        </FormItem>
        {this.renderDefaultValueField(name)}
        {this.renderDescription()}
        {this.renderDataType()}
        {this.renderInputTypeField()}
      </div>
    );
  }

  renderDefaultValueField = (name) => {
    if ('style:stroke:color' === name.input.value || 'style:fill:color' === name.input.value ) {
      return (
        <FormItem label="默认值">
          <Field name="default_value" label="" component={ColorPicker} required={true} />
        </FormItem>
      );
    } else {
      return (
        <FormItem label="默认值">
          <Field name="default_value" type="text" component={Input} required={true} />
        </FormItem>
      );
    }
  }

  renderDescription = () => {
    return (
      <FormItem label="属性描述">
        <Field name="description" type="text" component={Input} />
      </FormItem>
    );
  }

  renderDataType = () => {
    return (
      <FormItem label="数据类型">
        <Field name="data_type" component={Select} defaultValue="number">
          <Select.Option value="">请选择</Select.Option>
          <Select.Option value="number">number</Select.Option>
          <Select.Option value="string">string</Select.Option>
          <Select.Option value="boolean">boolean</Select.Option>
        </Field>
      </FormItem>
    );
  }

  renderInputTypeField = () => {
    return (
      <FormItem label="输入类型">
        <Field name="input_type" component={InputTypeSelectBox} defaultValue="">
          <Select.Option value="">请选择</Select.Option>
          <Select.Option value="text">text</Select.Option>
          <Select.Option value="number">number</Select.Option>
          <Select.Option value="radio">radio</Select.Option>
          <Select.Option value="checkbox">checkbox</Select.Option>
          <Select.Option value="select">select</Select.Option>
          <Select.Option value="color">color</Select.Option>
        </Field>
      </FormItem>
    );
  }

  render() {
    return (
      <Row>
        <Col span={24}>
          <Field name="id" type="hidden" component="input" />
          <Fields names={['name','default_value', 'description', 'data_type','input_type']} component={this.renderLayerProperty} />
        </Col>
      </Row>
    );
  }
}
