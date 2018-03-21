import React from 'react';
import { reduxForm, Field } from 'redux-form';
import PropTypes from 'prop-types';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import styled from 'styled-components';


class UserRegister extends React.PureComponent {

  static propTypes = {
    registeUser: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  render() {
    const {
      handleSubmit,
      registeUser,
    } = this.props;

    return (
      <Container>
        <Header>
          <HeaderTitle>JCMap</HeaderTitle>
          <p>甲虫网络地图工具</p>
        </Header>

        <FormContainer>
          <Form onSubmit={handleSubmit(registeUser)}>
            <Form.Item label="帐号">
              <Field name="email" component={EmailInput} />
            </Form.Item>

            <Form.Item label="密码">
              <Field name="password" component={PasswordInput} />
            </Form.Item>

            <Form.Item label="确认密码">
              <Field name="password_confirm" component={PasswordConfirmInput} required="true" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              style={{marginTop: '20px',width: "100%"}}
            >注册账号</Button>

            <Links>
              <a href="/login">我已经有帐号</a>
            </Links>
          </Form>
        </FormContainer>
      </Container>
    );
  }
}

export default reduxForm({
  form: 'user-registe',
})(UserRegister);


class EmailInput extends React.PureComponent {
  render() {
    const { input } = this.props;

    return (
      <Input type="email" required="true" placeholder="请输入email" {...input} />
    );
  }
}


class PasswordInput extends React.PureComponent {
  render() {
    const { input } = this.props;

    return (
      <Input type="password" required="true" placeholder="请输入密码" {...input} />
    );
  }
}


class PasswordConfirmInput extends React.PureComponent {
  render() {
    const { input } = this.props;

    return (
      <Input type="password" required="true" placeholder="请输入确认密码" {...input} />
    );
  }
}


const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Header = styled.div`
  text-align: center;
`;

const HeaderTitle = styled.h2`
  font-weight: 200;
`;

const FormContainer = styled.div`
  min-width: 30em;
  background: #fff;
  border: 1px solid #e4e5e7;
  border-radius: 2px;
  position: relative;
  padding: 20px;
`;

const Links = styled.div`
  text-align: right;
  margin-top: 20px;
`;
