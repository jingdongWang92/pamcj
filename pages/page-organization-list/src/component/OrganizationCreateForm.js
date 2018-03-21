import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, } from 'redux-form';
import Form from 'antd/es/form';
import { ORGANIZATION_CREATE_FORM } from '../constants';
import ReduxFormInput from './ReduxFormInput';
import Modal from 'antd/es/modal';
import Button from 'antd/es/button';


class OrganizationCreateForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    createOrganization: PropTypes.func,
    isCreating: PropTypes.bool.isRequired,
    viewOrganization: PropTypes.func.isRequired,
  }


  render() {
    const {
      handleSubmit,
      createOrganization,
      isCreating,
      viewOrganization,
    } = this.props;

    return (
      <Modal
        title="创建团队"
        visible={true}
        width={600}
        onCancel={() => viewOrganization()}
        footer={[
          <Button
            key="cancel"
            onClick={() => viewOrganization()}
          >取消</Button>,

          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            loading={isCreating}
            form={ORGANIZATION_CREATE_FORM}
          >创建</Button>
        ]}
      >
        <Form id={ORGANIZATION_CREATE_FORM} onSubmit={handleSubmit(createOrganization)}>
          <Form.Item label="团队名称">
            <Field name="name" component={ReduxFormInput} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}


export default reduxForm({
  form: ORGANIZATION_CREATE_FORM,
})(OrganizationCreateForm);
