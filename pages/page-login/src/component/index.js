import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import map from './map.png';
import logo from './logo.png';
import zbj from './zbj.png';
import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import styled from 'styled-components';
import Input from 'antd/es/input';
import Form from 'antd/es/form';


const JCMAP_ZHUBAJIE_OAUTH2_CALLBACK = 'https://jcmap.jcbel.com/apis/authorization/zhubajie';
const ZHUBAJIE_OAUTH2_AUTHORIZATION = 'https://openapi.zbj.com/oauth2/authorize';
const ZHUBAJIE_OAUTH2_PARAMS = {
  client_id: '20171210104546dXz3h8',
  response_type: 'code',
  redirect_uri: encodeURIComponent(JCMAP_ZHUBAJIE_OAUTH2_CALLBACK),
  scope: 'all',
};
const ZHUBAJIE_OAUTH2_QUERYSTRING = Array.from(Object.entries(ZHUBAJIE_OAUTH2_PARAMS))
  .map(pair => pair.join('='))
  .join('&');
const ZHUBAJIE_OAUTH2_LINK = `${ZHUBAJIE_OAUTH2_AUTHORIZATION}?${ZHUBAJIE_OAUTH2_QUERYSTRING}`;


class LoginPage extends React.PureComponent {

  static propTypes = {
    login: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  render() {
    const {
      login,
      handleSubmit,
    } = this.props;

    return (
      <Container>
        <LogoContainer>
          <Logo src={logo} alt="logo" />
        </LogoContainer>

        <LoginPanelContainer>
          <LoginPanelHeader>
            <LoginPanelHeaderText>账号登录</LoginPanelHeaderText>
          </LoginPanelHeader>

          <LoginFormContainer>
            <Form onSubmit={handleSubmit(login)}>
              <Field name="grant_type" component="input" type="hidden" />

              <Form.Item label="帐号">
                <Field
                  name="username"
                  component={({ input }) => (
                    <Input {...input} placeholder="请输入email" />
                  )}
                />
              </Form.Item>

              <Form.Item label="密码">
                <Field
                  name="password"
                  component={({ input }) => (
                    <Input {...input} type="password" placeholder="请输入密码" />
                  )} />
              </Form.Item>

              <OAuth2Logins>
                <OAuth2LoginLabel>其他方式登录:</OAuth2LoginLabel>
                <LoginWithZhubajie href={ZHUBAJIE_OAUTH2_LINK}>
                  <img src={zbj} alt="zhubajie_logo" />
                </LoginWithZhubajie>
              </OAuth2Logins>

              <Button
                type="default"
                htmlType="submit"
                style={{
                  marginTop:'1rem',
                  fontSize: '1rem',
                  width: "100%"
                }}>登录</Button>

              <Links>
                <LinkItem href="/signup">还没有帐号？注册</LinkItem>
                <Divider type="vertical" />
                <LinkItem href="/password-forgot">忘记密码</LinkItem>
              </Links>
            </Form>
          </LoginFormContainer>
        </LoginPanelContainer>

        <PosterContainer>
          <Poster src={map} alt="map" />
        </PosterContainer>
      </Container>
    );
  }
}


export default reduxForm({
  form: 'login-form',
})(LoginPage);


const Container = styled.div`
  width: 95.36rem;
  height: 53.57rem;
  margin: auto;
  margin-top: 2.3rem;
  background: #3498DB;
  border-radius: 1.43rem;
  border: 1px solid #fff;
`;

const LogoContainer = styled.div`
  width: 25.64rem;
  height: 20.36rem;
  margin-top: 2.14rem;
  margin-left: 5.29rem;
`;

const Logo = styled.img`
  width: 25.64rem;
  height: 20.36rem;
`;

const LoginPanelContainer = styled.div`
  width: 25.64rem;
  height: 27rem;
  border-radius: 0.36rem;
  background: #fff;
  margin-top: 23.71rem;
  margin-left: 5.29rem;
  margin: 1.71rem 0 3.36rem 5.29rem;
`;

const LoginPanelHeader = styled.div`
  padding: 1rem;
  text-align: center;
`;

const LoginPanelHeaderText = styled.span`
  font-family: 'Helvetica-Bold';
  color: #3498db;
  font-size: 1.73rem;
`;

const LoginFormContainer = styled.div`
  padding: 0 2.36rem;
`;

const OAuth2Logins = styled.div`

`;

const Links = styled.div`
  text-align: right;
  margin-top: 1rem;
`;

const LinkItem = styled.a`
  color: #3498db;
  font-size: 1rem;
`;

const OAuth2LoginLabel = styled.span`
  font-size: 1rem;
`;

const LoginWithZhubajie = styled.a`
  margin-left: 10px;
`;

const PosterContainer = styled.div`
  margin-top: -54.57rem;
  float: right;
  height: 53.57rem;
  width: 58.93rem;
`;

const Poster = styled.img`
  width: 58.93rem;
  height: 53.40rem;
  border-bottom-right-radius: 1.43rem;
  border-top-right-radius: 1.43rem;
`;
