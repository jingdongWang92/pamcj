import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, Fields } from 'redux-form';
import AppShell from '@jcmap/component-app-shell';
import URI from '@jcnetwork/util-uri';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Card from 'antd/es/card';
import { MODULE_NAME } from '../constants';
import StyleEditor from './StyleEditor';


class GeometryStyleUpdate extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fetchGeometryStyle: PropTypes.func.isRequired,
    updateGeometryStyle: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const hashParams = (new URI()).hash(true);
    const geometryStyleId = hashParams.geometry_style_id || hashParams.geometry_style;
    this.props.fetchGeometryStyle(geometryStyleId);
  }

  render() {
    const { handleSubmit, updateGeometryStyle } = this.props;

    return (
      <AppShell>
        <Card bordered={false} title={<CardTitle text="编辑几何样式" />} extra={<CardExtra />}>
          
          <Form id={MODULE_NAME} onSubmit={handleSubmit(updateGeometryStyle)}>
            <Field name="id" component="input" type="hidden" />
            <Fields names={['geometry_type', 'style']} component={StyleEditor} />
          </Form>
        </Card>
      </AppShell>
    );
  }
}


export default reduxForm({ form: MODULE_NAME })(GeometryStyleUpdate);


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
      form={MODULE_NAME}
    >保存</Button>,
  ];
}
