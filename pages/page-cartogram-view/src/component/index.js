import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import Page from '@jcmap/component-app-shell';
import * as constants from '../constants';
import URI from '@jcnetwork/util-uri';
import ReduxFormImageUpload from './ReduxFormImageUpload';
import Button from 'antd/es/button';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Card from 'antd/es/card';
import ReduxFormInput from './ReduxFormInput';
import ReduxFormInputNumber from './ReduxFormInputNumber';
import EnhancedCoordinatePicker from './EnhancedCoordinatePicker';
import ReduxFormSelect from './ReduxFormSelect';
import ReduxFormAddressInput from './ReduxFormAddressInput';
import FormItem from './FormItem';


class CartogramView extends React.Component {

  static propTypes = {
    readAccessToken:PropTypes.func.isRequired,
    fetchCartogram: PropTypes.func.isRequired,
    updateCartogram: PropTypes.func.isRequired,
    cartogram: PropTypes.object,
    organizations: PropTypes.array.isRequired,
  }

  componentDidMount() {
    this.props.readAccessToken();
    this.props.searchOrganizations();
    const hashParams = (new URI()).hash(true);
    const cartogramId = hashParams.cartogram_id || hashParams.cartogram;
    this.props.fetchCartogram(cartogramId);
  }

  render() {
    const {
      handleSubmit,
      updateCartogram,
      organizations,
      inputTips,
      isSubmitting,
      searchInputTips,
      selectInputTip,
    } = this.props;

    return (
      <Page>
        <Card title={<CardTitle text="创建地图" />} extra={<CardExtra isSubmitting={ isSubmitting } />}>
          <Form id={constants.MODULE_NAME} onSubmit={handleSubmit(updateCartogram)}>
            <Row gutter={32}>
              <Col span={12}>
                <Field
                  name="owner_id"
                  component={ReduxFormSelect}
                  label="所有者"
                  required={true}
                  disabled
                >
                  {organizations.map(organization => (
                    <ReduxFormSelect.Option
                      key={organization.id}
                      value={organization.id}
                      title={organization.name}
                    >{organization.name}</ReduxFormSelect.Option>
                  ))}
                </Field>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Field
                  name="name"
                  component={ReduxFormInput}
                  label="地图名称"
                  placeholder="请输入地图名称"
                  required={true}
                />

                <Field
                  name="length"
                  component={ReduxFormInputNumber}
                  label="建筑长度"
                  placeholder="请输入建筑物实际的长度"
                  extra="单位：米"
                  min={1}
                  required={true}
                />

                <Field
                  name="width"
                  component={ReduxFormInputNumber}
                  label="建筑宽度"
                  placeholder="请输入建筑物实际的宽度"
                  extra="单位：米"
                  min={1}
                  required={true}
                />

                <Field
                  name="height"
                  component={ReduxFormInputNumber}
                  label="建筑高度"
                  placeholder="请输入建筑物实际的高度"
                  extra="单位：米"
                  min={1}
                  required={true}
                />

                <Field
                  name="floor_label"
                  component={ReduxFormInput}
                  label="楼层标签"
                  extra="楼层在电梯按键上的标签, 比如 3F 就输入 3F, LG 层就输入 LG"
                  placeholder="请输入楼层标签"
                  required={true}
                />

                <Field
                  name="floor_number"
                  component={ReduxFormInputNumber}
                  type="number"
                  label="楼层编号"
                  extra="比如电梯上是 -2F 即输入 -2，3F 即输入 3,"
                  placeholder="请输入楼层编号"
                  required={true}
                />

                <Field
                  name="floor_index"
                  component={ReduxFormInputNumber}
                  type="number"
                  label="楼层序号"
                  extra="楼层从地基开始往上计数的编号"
                  placeholder="请输入楼层序号"
                  min={1}
                  required={true}
                />

                <FormItem label="设计图" required={true}>
                  <Field
                    name="diagram"
                    component={ReduxFormImageUpload}
                  />
                </FormItem>
              </Col>

              <Col span={12}>
                <Field
                  name="address"
                  component={ReduxFormAddressInput}
                  label="建筑物地址"
                  placeholder="请输入建筑物地址"
                  required={true}
                  inputTips={inputTips}
                  onSearch={searchInputTips}
                  onSelect={selectInputTip}
                />

                <Field
                  name="location"
                  component={EnhancedCoordinatePicker}
                  required={true}
                />
              </Col>
            </Row>
          </Form>
        </Card>
      </Page>
    );
  }
}


export default reduxForm({ form: constants.MODULE_NAME })(CartogramView);


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
      style={{marginRight:'10px'}}
      form={constants.MODULE_NAME}
    >提交</Button>,
    <Button
      key="goback"
      htmlType="button"
      type="primary"
      size="large"
      href="/cartogram/list"
    >返回地图列表</Button>,
  ];
}
