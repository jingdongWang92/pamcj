import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, FieldArray, Field } from 'redux-form';
import AppShell from '@jcmap/component-app-shell';
import * as constants from '../constants';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Form from 'antd/es/form';
import FormItem from './FormItem';
import Input from './ReduxFormComponents/Input';
import InputNumber from './ReduxFormComponents/InputNumber';
import Select from './ReduxFormComponents/Select';
import LayerFieldList from './LayerFieldList';
import Switch from './ReduxFormComponents/Switch';


class LayerCreate extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    createLayer: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.fetchUserSelf();
    this.props.searchOrganizations();
  }


  render() {
    const { handleSubmit, createLayer, myself, organizations, isSubmitting } = this.props;


    return (
      <AppShell>
        <Form id={constants.MODULE_NAME} onSubmit={handleSubmit(createLayer)}>
          <Card bordered={false} title={<CardTitle text="添加图层" />} extra={<CardExtra isSubmitting={ isSubmitting } />} />
          <div style={{ padding: '15px' }}>
            <FormItem label="所属组织">
              <Field name="owner_id" component={Select}  defaultValue="">
                <Select.Option value="">请选择</Select.Option>
                {organizations.map(organization => (
                  <Select.Option key={organization.id} value={organization.id}>{organization.name}</Select.Option>
                ))}
              </Field>
            </FormItem>

            <FormItem label="图层名称">
              <Field name="name" component={Input} placeholder="请输入图层名称" required={true}/>
            </FormItem>

            <FormItem label="图层代码">
              <Field name="code" component={Input} placeholder="请输入图层代码" required={true}/>
            </FormItem>

            <FormItem label="几何类型">
              <Field name="geometry_type" component={Select} defaultValue="">
                <Select.Option value="">请选择</Select.Option>
                <Select.Option value="Point">点</Select.Option>
                <Select.Option value="Curve">线</Select.Option>
                <Select.Option value="Surface">面</Select.Option>
              </Field>
            </FormItem>

            <FormItem label="显示顺序" extra="请输入显示顺序，数字越大越显示在上层">
              <Field name="sequence" component={InputNumber} placeholder="0" />
            </FormItem>

            {myself && myself.role === 'immortal' && (
              <FormItem label="是否是系统层" extra="系统层可以被所有用户看见">
                <Field name="is_created_by_system" component={Switch} checkedChildren="是" unCheckedChildren="否" />
              </FormItem>
            )}

            <FieldArray name="fields" component={LayerFieldList} />
          </div>
        </Form>
      </AppShell>
    );
  }
}


export default reduxForm({ form: constants.MODULE_NAME })(LayerCreate);

function CardTitle({ text }) {
  return (
    <span style={{ fontSize: '30px' }}>{text}</span>
  );
}


function CardExtra({ isSubmitting }) {
  return [
    <Button
      key="submit"
      htmlType="submit"
      type="primary"
      size="large"
      loading={isSubmitting}
      form={constants.MODULE_NAME}
    >提交</Button>,
  ];
}
