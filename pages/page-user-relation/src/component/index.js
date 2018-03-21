import React from 'react';
import PropTypes from 'prop-types';
import URL from '@jcnetwork/util-uri';
import BindAccountForm from './BindAccountForm';
import CreateAndBindAccountForm from './CreateAndBindAccountForm';
import Tabs from 'antd/es/tabs';
import styled from 'styled-components';


const TabPane = Tabs.TabPane;


export default class UserRelationPage extends React.PureComponent {

  static propTypes = {
    bindAccount: PropTypes.func.isRequired,
  }

  state = {
    access_token: (new URL()).hash(true).access_token,
    openid: (new URL()).hash(true).openid,
  }

  render() {
    const { bindAccount, isSubmitting } = this.props;
    const initialValues = {
      access_token: this.state.access_token,
      openid: this.state.openid,
    }

    return (
      <Container>
        <Header>
          <HeaderTitle>请关联你的甲虫帐号</HeaderTitle>
        </Header>

        <Tabs defaultActiveKey="1">
          <TabPane tab="创建甲虫帐号" key="1">
            <CreateAndBindAccountForm
              bindAccount={bindAccount}
              isSubmitting={isSubmitting}
              initialValues={Object.assign({}, initialValues, {is_create: true})}
            />
          </TabPane>
          <TabPane tab="绑定已有甲虫帐号" key="2">
            <BindAccountForm
              bindAccount={bindAccount}
              initialValues={initialValues}
              isSubmitting={isSubmitting}
            />
          </TabPane>
        </Tabs>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(-16em);
`;

const Header = styled.div`
  text-align: center;
`;

const HeaderTitle = styled.h2`
  font-weight: 200;
`;
