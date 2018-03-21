import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, } from 'redux-form';
import Form from 'antd/es/form';
import { ORGANIZATION_INVITATION_CREATE_FORM } from '../constants';
import ReduxFormInput from './ReduxFormInput';
import Modal from 'antd/es/modal';
import Button from 'antd/es/button';
import OrganizationRoleSelector from './OrganizationRoleSelector';


class OrganizationInvitationCreateForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    createOrganizationInvitation: PropTypes.func,
    isCreating: PropTypes.bool.isRequired,
    viewOrganization: PropTypes.func.isRequired,
    organization: PropTypes.object.isRequired,
  }


  render() {
    const {
      handleSubmit,
      createOrganizationInvitation,
      isCreating,
      viewOrganization,
      organization,
    } = this.props;


    return (
      <Modal
        title={`邀请用户 - ${organization.name}`}
        visible={true}
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
            form={ORGANIZATION_INVITATION_CREATE_FORM}
          >邀请</Button>
        ]}
      >
        <Form id={ORGANIZATION_INVITATION_CREATE_FORM} onSubmit={handleSubmit(createOrganizationInvitation)}>
          <Field name="organization_id" component="input" type="hidden" />

          <Form.Item label="邮箱">
            <Field name="email" component={ReduxFormInput} />
          </Form.Item>

          <Form.Item label="角色">
            <Field name="role" component={OrganizationRoleSelector} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}


export default reduxForm({
  form: ORGANIZATION_INVITATION_CREATE_FORM,
})(OrganizationInvitationCreateForm);
