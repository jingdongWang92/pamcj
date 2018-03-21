import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, } from 'redux-form';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Panel from './Panel';
import ButtonBar from './ButtonBar';
import FormContainer from './FormContainer';


class BindAccountForm extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    updateUser: PropTypes.func,
  }

  render() {
    const { handleSubmit, bindAccount, isSubmitting } = this.props;
    return (
      <Panel>
        <FormContainer>
          <Form onSubmit={handleSubmit(bindAccount)}>
            <p>绑定已有甲虫帐号</p>
            <div>
              <small>绑定后，使用猪八戒账户或者甲虫帐号均可以登录到你现有的帐号。</small>

              <Form.Item>
                <Field
                  name="email"
                  component={({ input }) => (
                    <Input {...input} placeholder="请输入email" style={{ width: '20em' }} />
                  )}
                />
              </Form.Item>

              <Form.Item>
                <Field
                  name="password"
                  component={({ input }) => (
                    <Input type="password" {...input} placeholder="请输入密码" style={{ width: '20em' }} />
                  )}
                />
              </Form.Item>

              <ButtonBar>
                <Button type="primary" size="large" htmlType="submit" loading={isSubmitting} >绑定</Button>
              </ButtonBar>
            </div>
          </Form>
        </FormContainer>
      </Panel>
    );
  }
}


export default reduxForm({
  form: 'account-bind-form',
  enableReinitialize: true,
})(BindAccountForm);
