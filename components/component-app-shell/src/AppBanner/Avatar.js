import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/es/button';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Tag from 'antd/es/tag';
import Popover from 'antd/es/popover';
import avatarPlaceholder from '../imgs/avatar.png'
import moment from 'moment';
import styled from 'styled-components';


export default class Avatar extends React.Component {

  static contextTypes = {
    user: PropTypes.object,
    userOrganization: PropTypes.object,
    organizationPlan: PropTypes.object,
    bannerHeight: PropTypes.number.isRequired,
  }

  render() {
    const { user, bannerHeight } = this.context;
    if(!this.context.user) { return null; }

    return (
      <Popover content={<UserInfo {...this.context} />} placement="bottomRight">
        <UserAvatarImage src={avatarPlaceholder} alt={user.email} bannerHeight={bannerHeight} />
      </Popover>
    );
  }
}

const Divider = styled.div`
  height: 1px;
  background: rgb(231, 231, 231);
  margin: 15px 0;
`;

class UserInfo extends React.Component {
  render() {
    const { user, userOrganization, organizationPlan } = this.props;

    return (
      <UserInfoContainer>
        <Row>
          <Col span={16} offset={4}>
            <p style={{ fontSize: '32px',margin: '0px' }}>{user.username}</p>
            <p style={{ fontSize: '16px',margin: '0px' }}>{user.email}</p>
          </Col>
        </Row>

        {user.role !== 'immortal' && (
          <div>
            <Divider />
            <Row style={{ marginTop:'15px' }}>
              <Col span={12} offset={4}>
                <span style={{ fontSize:'16px',color: '#DD6041' }}>
                  {!organizationPlan ? '试用版': organizationPlan.name }
                </span>
              </Col>
              <Col span={8}>
                <Button type="primary" size="small" href="/pricing">升级</Button>
              </Col>
            </Row>
            <Row style={{marginTop:'15px'}}>
              <Col span={12} offset={4}>
                <span style={{ fontSize:'16px' }}>
                  {!userOrganization || !userOrganization.plan_expired_at ? '' : moment(userOrganization.plan_expired_at).format('YYYY-MM-DD') + '到期'}
                </span>
              </Col>
              <Col span={8}>
                {
                  !organizationPlan ? ''
                    : moment().isBefore(userOrganization && userOrganization.plan_expired_at)
                        ? <Tag style={{fontSize: '14px'}} color="green">有效</Tag>
                        : <Tag style={{fontSize: '14px'}} color="#f50">过 期</Tag>
                }
              </Col>
            </Row>
            <Divider />
          </div>
        )}

        <div style={{ margin:'20px 0', textAlign: 'center' }}>
          <Button
            size="large"
            href="/logout"
            style={{color: '#fff', backgroundColor: '#34495E'}}>
            退出登录
          </Button>
        </div>
      </UserInfoContainer>
    );
  };
}

const UserInfoContainer = styled.div`
  width: 300px;
`;

const UserAvatarImage = styled.img`
  height: ${props => props.bannerHeight * 0.8}px;
`;
