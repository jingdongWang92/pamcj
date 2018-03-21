import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import Form from 'antd/es/form';
import ReduxFormInput from './ReduxFormInput';


class OrganizationUpdateForm extends Component {

  render() {

    const { handleSubmit, updateOrganization, viewOrganization, isUpdating } = this.props;

    return (
        <Modal
          title={
            <p style={{textAlign: 'center', fontSize: '24px'}}>编辑</p>
          }
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
              form="organization-update"
              loading={isUpdating}

            >保存修改</Button>
          ]}
        >
          <Form id="organization-update" onSubmit={handleSubmit(updateOrganization)}>
            <Form.Item label="团队名称">
              <Field name="name" component={ReduxFormInput} />
            </Form.Item>
          </Form>
        </Modal>
    );
  }
}

export default reduxForm({
  form: 'organization-update',
})(OrganizationUpdateForm);
