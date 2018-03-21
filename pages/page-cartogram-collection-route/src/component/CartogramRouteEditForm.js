import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import { reduxForm, Field } from 'redux-form';
import { CARTOGRAM_ROUTE_EDIT_FORM } from '../constants';
import HighWaySelector from './HighWaySelector';
import OneWaySelector from './OneWaySelector';
import FeatureCascader from './FeatureCascader';


class CartogramRouteCreateForm extends React.Component {

  static propTypes = {
    positions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      children: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    })).isRequired,
    updateCartogramRoute: PropTypes.func.isRequired,
  };

  render() {
    const {
      positions,
      handleSubmit,
      updateCartogramRoute,
    } = this.props;
    console.log(this.props.initialValues, positions);

    return (
      <Form id={CARTOGRAM_ROUTE_EDIT_FORM} onSubmit={handleSubmit(updateCartogramRoute)}>
        <Form.Item label="起始位置">
          <Field
            name="from_position"
            component={FeatureCascader}
            cascaderOptions={positions}
          />
        </Form.Item>

        <Form.Item label="目标位置">
          <Field
            name="to_position"
            component={FeatureCascader}
            cascaderOptions={positions}
          />
        </Form.Item>

        <Form.Item label="道路类别">
          <Field name="highway" component={({ input }) => (<HighWaySelector {...input} />)} />
        </Form.Item>

        <Form.Item label="是否是单行道？">
          <Field name="oneway" component={({ input }) => (<OneWaySelector {...input} />)} />
        </Form.Item>
      </Form>
    );
  }
}


export default reduxForm({
  form: CARTOGRAM_ROUTE_EDIT_FORM,
})(CartogramRouteCreateForm);
