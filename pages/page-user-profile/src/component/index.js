import React from 'react';
import AppShell from '@jcmap/component-app-shell';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Tabs from 'antd/es/tabs';
import Divider from 'antd/es/divider';
import Menu from 'antd/es/menu';

import IconUserProfile from '../icon/user.png';
import UpdatePassword from './UpdatePassword';
import UpdateProfiles from './UpdateProfiles';
import UserPlan from './plan';
import OrderList from './order';
import InvoiceList from './invoice';


const TabPane = Tabs.TabPane;

class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: '1',
      menuKey: '1',
    };
  }

  componentDidMount() {
    this.props.searchOrders();
    this.props.fetchProfile();
    this.props.searchInvoices();
  }

  handleTabChange = (key) => {
    this.setState({
      key: key,
    });
  }

  handleMenuChange = (menu) => {
    this.setState({
      menuKey: menu.key,
    });
  }

  render() {

    const {
      updateProfile,
      resetPassword,
      orders,
      user,
    } = this.props;

    return (
      <AppShell>
        <Row>
          <Col lg={{ span: 6 }} xxl={{ span: 4}}>
            <div style={{textAlign: 'center', height: '400px',marginTop: '3rem',marginRight: '1rem',padding: '1rem', border: '1px solid #e5e5e5'}}>
              <div className="avatar">
                <img src={user.avatar ? `/apis/storage/${user.avatar}` : IconUserProfile } height="70" alt="avatar"/>
              </div>
              <div className="name" style={{ fontSize: '32px', marginTop: '10px'}}>
                {user.username}
              </div>
              <div className="name" style={{ fontSize: '16px'}}>
                {user.email}
              </div>
              <Divider />
              <Menu
                style={{ border: 'none' }}
                defaultSelectedKeys={['1']}
                onClick={this.handleMenuChange}
              >
                <Menu.Item key="1">账户信息</Menu.Item>
                <Menu.Item key="2">个人设置</Menu.Item>
              </Menu>
            </div>
          </Col>
          <Col lg={{ span: 18 }} xxl={{ span: 20 }} style={{marginTop: '3.0em'}}>
            <div style={{ display: this.state.menuKey === '1' ? 'block' : 'none' }}>
              <Tabs defaultActiveKey="1" onChange={ this.handleTabChange }>
                <TabPane tab={<TabBarText text="方案信息" />} key="1">
                  <UserPlan user={user}/>
                </TabPane>
                <TabPane tab={<TabBarText text="购买账单" />} key="2">
                  <OrderList orders={orders} />
                </TabPane>
                <TabPane tab={<TabBarText text="发票申请" />} key="3">
                  <InvoiceList {...this.props} />
                </TabPane>
              </Tabs>
            </div>
            <div style={{ display: this.state.menuKey !== '1' ? 'block' : 'none' }}>
              <Tabs defaultActiveKey="4" onChange={ this.handleTabChange }>
                <TabPane tab={<TabBarText text="修改密码" />} key="4">
                  <UpdatePassword
                    resetPassword={resetPassword}
                  />
                </TabPane>
                <TabPane tab={<TabBarText text="个人资料" />} key="5">
                  <UpdateProfiles
                    initialValues={user}
                    updateProfile={updateProfile}
                  />
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </AppShell>
    );
  }
}


export default UserProfile;

function TabBarText({ text }) {
  return (
    <span style={{fontSize: '2rem'}}>{text}</span>
  );
}
