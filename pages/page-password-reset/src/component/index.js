import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';


class PasswordResetPage extends React.Component {


  componentDidMount() {
    const hashes = parseQueryStringLikeString(window.location.hash);
    this.props.fetchToken(hashes.token);
  }

  render() {
    const { resetPassword, handleSubmit } = this.props;

    return (
      <div style={{maxWidth: '400px',margin: 'auto', paddingTop: '6%'}}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{fontWeight:'200', marginBottom: '30px'}}>密码重置</h2>
        </div>

        <div style={{ padding: '15px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '2px', position: 'relative' }}>
          <div style={{marginBottom:'20px'}}>
            <Form onSubmit={handleSubmit(resetPassword)}>
              <Form.Item label="新密码">
                <Field
                  name="password"
                  component={({ input }) => (
                    <Input type="password" placeholder="请输入新密码" {...input} />
                  )}
                  required="true"
                />
              </Form.Item>

              <Form.Item label="确认密码">
                <Field
                  name="confirm_password"
                  component={({ input }) => (
                    <Input type="password" placeholder="请输入确认密码" {...input} />
                  )}
                  required="true"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                style={{marginTop: '20px',width: "100%" }}
              >重置密码</Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}


export default reduxForm({
  form: 'password-reset-form',

})(PasswordResetPage);


PasswordResetPage.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

function parseQueryStringLikeString(str = '') {
  return str.slice(1)
      .split('&')
      .filter(pair => pair)
      .map(pair => pair.split('='))
      .reduce((accu, pair) => Object.assign({}, accu, {
        [pair[0]]: pair[1],
      }), {});
}
