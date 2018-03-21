import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import * as constants from '../constants';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';

class UpdatePassword extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
  }


  render() {
    const { handleSubmit, resetPassword, } = this.props;

    return (
      <Form id={constants.MODULE_NAME} onSubmit={handleSubmit(resetPassword)}>
        <div style={{ padding: '15px', width: '50%' }}>
          <Form.Item colon={false} label="新密码">
            <Field
              name="password"
              component={({ input }) => (
                <Input type="password" placeholder="请输入新密码" {...input} />
              )}
              required={true}/>
          </Form.Item>

          <Form.Item colon={false} label="确认新密码">
            <Field
              name="confirm_password"
              component={({ input }) => (
                <Input type="password" placeholder="确认新密码" {...input} />
              )}
              required={true}/>
          </Form.Item>

          <Button type="primary" size="large" htmlType="submit" >修改密码</Button>
        </div>
      </Form>
    );
  }
}


export default reduxForm({ form: 'password-reset' })(UpdatePassword);
