import 'antd/dist/antd.css';

import React from 'react';
import PropTypes from 'prop-types';
import menus from './menu_data';
import request, { UnauthorizedError } from '@jcnetwork/util-better-request'
import Layout from 'antd/es/layout';
import Icon from 'antd/es/icon';
import styled from 'styled-components';
import AppBanner from './AppBanner';
import AppSider from './AppSider';


const { Header, Content, Sider } = Layout;


export default class AppShell extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  static defaultProps = {
    siderWidth: 200,
    bannerHeight: 56,
  }

  static childContextTypes = {
    user: PropTypes.object,
    userOrganization: PropTypes.object,
    organizationPlan: PropTypes.object,
    menus: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    siderWidth: PropTypes.number.isRequired,
    bannerHeight: PropTypes.number.isRequired,
    siderCollapsed: PropTypes.bool.isRequired,
  }

  getChildContext() {
    const { user, userOrganization, siderCollapsed } = this.state;
    const plan = userOrganization ? userOrganization.plan : (user ? user.plan : null);

    return {
      user: user,
      userOrganization: userOrganization,
      organizationPlan: plan,
      menus,
      siderWidth: this.props.siderWidth,
      bannerHeight: this.props.bannerHeight,
      siderCollapsed,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      userOrganization: props.userOrganization,
      siderCollapsed: false,
    };
  }

  async componentDidMount() {
    if (!this.props.test) {
      try {
        const res = await request({
          url: '//localhost:4000/self',
          method: 'get',
        });

        this.setState(state => ({
          ...state,
          user: res.payload,
          userOrganization: res.meta.organization,
        }));

      } catch (err) {
        if (err instanceof UnauthorizedError) {
          window.location.href = '/login';
          return;
        }

        console.error(err);
      }
    }
  }

  onSiderCollapse = collapsed => {
    this.setState(() => ({ siderCollapsed: collapsed }));
  }

  render() {
    const { bannerHeight } = this.props;
    const { siderCollapsed } = this.state;

    return (
      <Layout>
        <StyledHeader data-banner-height={bannerHeight}>
          <AppBanner />
        </StyledHeader>

        <StyledLayout data-sider-collapsed={siderCollapsed} data-banner-height={bannerHeight}>
          <StyledSider
            collapsible
            collapsed={siderCollapsed}
            trigger={
              <CustomSiderTrigger
                collapsed={siderCollapsed}
                onClick={() => this.onSiderCollapse(!siderCollapsed)}
              />
            }
          >
            <AppSider />
          </StyledSider>

          <StyledContent
            className={siderCollapsed
              ? 'content-with-sider-custom content-with-sider-collapsed-custom'
              : 'content-with-sider-custom'
            }
          >
            {this.props.children}
          </StyledContent>
        </StyledLayout>
      </Layout>
    );
  }
}


const StyledHeader = styled(Header)`
  padding: 0;
  height: ${props => props['data-banner-height']}px;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 2;
`;

const StyledLayout = styled(Layout)`
  margin-top: ${props => props['data-banner-height']}px;
  margin-left: ${props => props['data-sider-collapsed'] ? 80: 200}px;
  background-color: #fff;
`;

const StyledSider = styled(Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  background-color: #fff;
  border-right: 1px solid #e4e5e7;
  padding-top: 24px;
`;

const SiderTriggerContainer = styled.div`
  position: fixed;
  text-align: center;
  bottom: 0;
  cursor: pointer;
  width: ${props => props.collapsed ? 80 : 200}px;
  height: 48px;
  line-height: 48px;
  border-right: 1px solid #e4e5e7;
  color: #002140;
  background: #fff;
  z-index: 1;
  transition: all 0.2s;
`;

const StyledContent = styled(Content)`
  margin: 24px 16px 0;
  overflow: initial;
  transition: all 0.2s;
`;

class CustomSiderTrigger extends React.Component {
  render() {
    const { collapsed, onClick } = this.props;

    return (
      <SiderTriggerContainer collapsed={collapsed} onClick={onClick}>
        {!collapsed && (<Icon type="left" />)}
        {collapsed && (<Icon type="right" />)}
      </SiderTriggerContainer>
    );
  }
}
