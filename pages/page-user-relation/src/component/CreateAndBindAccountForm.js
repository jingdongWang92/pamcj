import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, } from 'redux-form';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Panel from './Panel';
import ButtonBar from './ButtonBar';
import FormContainer from './FormContainer';


class CreateAndBindAccountForm extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    bindAccount: PropTypes.func.isRequired,
  }

  render() {
    const { handleSubmit, bindAccount, isSubmitting } = this.props;
    return (
      <Panel>
        <FormContainer>
          <Form onSubmit={handleSubmit(bindAccount)}>
            <p>创建一个甲虫帐号，并绑定你现在登录的猪八戒账户</p>
            <div>
              <small>绑定后，使用猪八戒账户或者甲虫帐号均可以登录到你现有的帐号。</small>

              <Form.Item>
                <Field
                  name="email"
                  component={({ input }) => (
                    <Input {...input} placeholder="请输入email" />
                  )}
                />
              </Form.Item>

              <Form.Item>
                <Field
                  name="password"
                  component={({ input }) => (
                    <Input {...input} type="password" placeholder="请输入密码" />
                  )}
                />
              </Form.Item>

              <Field name="is_create"  hidden="true" component="input" />

              <ButtonBar>
                <Button type="primary" size="large" htmlType="submit" loading={isSubmitting} >创建并绑定</Button>
              </ButtonBar>
            </div>
          </Form>
        </FormContainer>
      </Panel>
    );
  }
}


export default reduxForm({
  form: 'create-bind-form',
  enableReinitialize: true,
})(CreateAndBindAccountForm);
