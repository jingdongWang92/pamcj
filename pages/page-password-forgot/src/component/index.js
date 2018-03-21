import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import Form from 'antd/es/form';

class PasswordForgotPage extends React.Component {
  render() {
    const { resetPassword, handleSubmit } = this.props;

    return (
      <div style={{maxWidth: '400px',margin: 'auto', paddingTop: '6%'}}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{fontWeight:'200', marginBottom: '30px'}}>密码重置</h2>
        </div>

        <div style={{ padding: '15px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '2px', position: 'relative' }}>
          <div style={{marginBottom:'30px',}}>
            <p>输入您注册时填写的邮件地址,我们将会发送重置密码的链接到您的邮箱,请注意查收.</p>
          </div>
          <div style={{marginBottom:'20px'}}>
            <Form onSubmit={handleSubmit(resetPassword)}>
              <Field
                name="email"
                component={InputBox}
                placeholder="请输入注册时使用的电子邮件地址"
                required="true"
              />
              <Button
                type="primary"
                htmlType="submit"
                style={{marginTop: '30px',width: "100%" }}
              >发送邮件</Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}


export default reduxForm({
  form: 'password-reset-form',
})(PasswordForgotPage);


PasswordForgotPage.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

function InputBox({input, label, placeholder,type, meta: {touched, error}}) {
  return(
    <div>
      <Input {...input} type={type} placeholder={placeholder} />
      {touched && error && <div><small>{error}</small></div>}
    </div>
  );
}
