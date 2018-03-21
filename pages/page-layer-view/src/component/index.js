import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, FieldArray, Field } from 'redux-form';
import AppShell from '@jcmap/component-app-shell';
import * as constants from '../constants';
import URL from '@jcnetwork/util-uri';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Card from 'antd/es/card';
import FormItem from './FormItem';
import Input from './ReduxFormComponents/Input';
import InputNumber from './ReduxFormComponents/InputNumber';
import Select from './ReduxFormComponents/Select';
import LayerFieldList from './LayerFieldList';
import Switch from './ReduxFormComponents/Switch';


class PageLayerView extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fetchLayer: PropTypes.func.isRequired,
    updateLayer: PropTypes.func.isRequired,
  }


  componentDidMount() {
    const hashParams = (new URL()).hash(true);
    this.props.fetchLayer(hashParams.layer_id || hashParams.layer);
  }


  render() {
    const { handleSubmit, updateLayer, layer } = this.props;


    return (
      <AppShell>
        <Form id={constants.MODULE_NAME} onSubmit={handleSubmit(updateLayer)} style={{marginTop:'1em'}}>
          <Card bordered={false} title={<CardTitle text="图层编辑" />} extra={<CardExtra />} />

          <div style={{ padding: '15px' }}>
            <FormItem label="组织">
              <Field name="owner_id" component={Select} disabled>
                <Select.Option key="1" value={layer && layer.owner_id}>{layer && layer.owner.name}</Select.Option>
              </Field>
            </FormItem>

            <FormItem label="图层名称">
              <Field name="name" component={Input} placeholder="请输入图层名称" />
            </FormItem>

            <FormItem label="图层代码">
              <Field name="code" component={Input} placeholder="请输入图层代码" disabled />
            </FormItem>

            <FormItem label="几何类型">
              <Field name="geometry_type" component={Select} disabled>
                <Select.Option value="Point">点</Select.Option>
                <Select.Option value="Curve">线</Select.Option>
                <Select.Option value="Surface">面</Select.Option>
              </Field>
            </FormItem>

            <FormItem label="显示顺序" extra="请输入显示顺序，数字越大越显示在上层">
              <Field name="sequence" component={InputNumber} placeholder="0" />
            </FormItem>

            <FormItem label="是否是系统层" extra="系统层可以被所有用户看见">
              <Field name="is_created_by_system" component={Switch} checkedChildren="是" unCheckedChildren="否" disabled />
            </FormItem>

            <FieldArray name="fields" component={LayerFieldList} />
          </div>
        </Form>
      </AppShell>
    );
  }
}

function CardTitle({ text }) {
  return (
    <span style={{ fontSize: '30px' }}>{text}</span>
  );
}

function CardExtra() {
  return [
    <Button
      key="submit"
      htmlType="submit"
      type="primary"
      size="large"
      form={constants.MODULE_NAME}
    >提交</Button>,
  ];
}

export default reduxForm({ form: constants.MODULE_NAME })(PageLayerView);
