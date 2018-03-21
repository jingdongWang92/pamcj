import React from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form';
import Page from '@jcmap/component-app-shell';
import { MODULE_NAME } from '../constants';
import PropTypes from 'prop-types';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Card from 'antd/es/card';
import ReduxFormSelect from './ReduxFormSelect';
import ReduxFormInput from './ReduxFormInput';
import FormItem from './FormItem';
import ReduxFormCartogramList from './ReduxFormCartogramList';


const Option = ReduxFormSelect.Option;


class CartogramCollectionCreate extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    createCartogramCollection: PropTypes.func.isRequired,
    searchCartograms: PropTypes.func.isRequired,
    cartograms: PropTypes.array.isRequired,
  }


  componentDidMount() {
    this.props.searchOrganizations();
    this.props.searchCartograms({ limit: 1000 });
  }


  render() {
    const {
      handleSubmit,
      createCartogramCollection,
      cartograms,
      organizations,
      cartogramSelectStatus,
      isSubmitting,
    } = this.props;

    return (
      <Page>
        <Card bordered={false} title={<CardTitle text="创建项目" />} extra={<CardExtra isSubmitting={isSubmitting}/>}>
          <Form id={MODULE_NAME} onSubmit={handleSubmit(createCartogramCollection)}>
            <FormItem label="所有者">
              <Field name="organization_id" component={ReduxFormSelect} required={true}>
                <Option value="" disabled>请选择所有者</Option>
                {organizations.map(organization => (
                  <Option key={organization.id} value={organization.id}>{organization.name}</Option>
                ))}
              </Field>
            </FormItem>

            <FormItem label="项目名称">
              <Field
                name="name"
                placeholder="请输入项目名称"
                component={ReduxFormInput}
                required={true}
              />
            </FormItem>

            <FormItem label="包含地图">
              <FieldArray
                name="cartogram_ids"
                component={ReduxFormCartogramList}
                cartograms={cartograms}
                cartogramSelectStatus={cartogramSelectStatus}
              />
            </FormItem>
          </Form>
        </Card>
      </Page>
    );
  }
}


export default reduxForm({ form: MODULE_NAME })(CartogramCollectionCreate);


function CardTitle({ text }) {
  return (
    <span style={{ fontSize: '30px' }}>{text}</span>
  );
}


function CardExtra({ isSubmitting }) {
  return [
    <Button
      type="primary"
      size="large"
      loading={isSubmitting}
      key="submit"
      htmlType="submit"
      form={MODULE_NAME}
    >提交</Button>,
  ];
}
