import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Table from 'antd/es/table';
import Divider from 'antd/es/divider';
import * as organizationRoles from '@jcmap/constant-organization-roles';
import PopconfirmButton from '@jcmap/component-popconfirm-button';
import get from 'lodash/fp/get';


const { OWNER, ADMIN, ADMINISTRATOR } = organizationRoles;
const roleMap = Object.values(organizationRoles).reduce((accu, { name, code }) => ({
  ...accu,
  [code]: name,
}), {});


class OrganizationList extends React.Component {

  static propTypes = {
    editOrganization: PropTypes.func.isRequired,
    updateOrganization: PropTypes.func.isRequired,
    removeOrganization: PropTypes.func.isRequired,
    quitOrganization: PropTypes.func.isRequired,
    organizations: PropTypes.array.isRequired,
    edittingOrganization: PropTypes.object,
    addOrganizationInvitation: PropTypes.func.isRequired,
    myself: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
  }

  render() {
    const {
      organizations,
      removeOrganization,
      quitOrganization,
      editOrganization,
      editOrganizationName,
      addOrganizationInvitation,
      myself,
      isLoading,
    } = this.props;


    return (
      <Table
        rowKey={record => record.id }
        showHeader={true}
        dataSource={organizations}
        loading={isLoading}
      >
        <Table.Column
          title='团队名称'
          dataIndex='name'
          render={text => <span style={{color: '#207A8B'}}>{text}</span>}
        />

        <Table.Column
          title='创建者'
          dataIndex='owner.email'
          render={(text, organization) => organization.owner.username || organization.owner.email}
        />

        <Table.Column
          title='我的身份'
          dataIndex='relationship_with_me.role'
          render={role => roleMap[role]}
        />

        <Table.Column
          title="方案"
          dataIndex='plan.name'
          render={planName => planName || '试用版' }
        />

        <Table.Column
          title="方案过期时间"
          dataIndex='plan_expired_at'
          render={(planExpiredAt) => {
            if (!planExpiredAt) { return '无'; }

            const expire = moment(planExpiredAt)
            return expire.isAfter()
              ? expire.diff(moment(), 'days') <= 7
                ? <span style={{ color: 'hsl(48, 100%, 50%)' }}>{moment(planExpiredAt).fromNow()}</span>
                : moment(planExpiredAt).fromNow()
              : <span style={{ color: 'red' }}>已过期</span>;
          }}
        />

        <Table.Column
          title='操作'
          key='action'
          render={(text, organization) => {
            const role = get(['relationship_with_me', 'role'], organization);
            const isOwner = role === OWNER.code;
            const isAdmin = role === ADMINISTRATOR.code || role === ADMIN.code;
            const isManager = isOwner || isAdmin;
            const isMyPrivateOrganization = organization.personal && myself && organization.owner_id === myself.id;


            const components = [
              <a key="add-organization-invitation" onClick={() => addOrganizationInvitation(organization)}>邀请用户</a>,
            ];


            components.push(
              <Divider key="view-organization-member-divider" type="vertical" />
            );

            // 查看(管理)成员
            components.push(
              isManager ? (
                <a key="view-organization-member" onClick={() => editOrganization(organization)}>管理成员</a>
              ) : (
                <a key="view-organization-member" onClick={() => editOrganization(organization)}>查看成员</a>
              )
            );

            if(isOwner) {
              components.push(
                <Divider key="update-organization-divider" type="vertical" />,
              );
              components.push(
                <a key="update-organization" onClick={() => editOrganizationName(organization)}>编辑</a>,
              );
            }

            // 离开组织
            if (!isMyPrivateOrganization) {
              components.push(
                <Divider key="leave-organization-divider" type="vertical" />
              );

              components.push(
                isOwner
                ? (
                  <PopconfirmButton
                    key="leave-organization"
                    title="确定要解散该团队吗?"
                    onConfirm={() =>  removeOrganization(organization)}
                  >解散</PopconfirmButton>
                )
                : (
                  <PopconfirmButton
                    key="leave-organization"
                    title="确定要退出该团队吗?"
                    onConfirm={() => quitOrganization(organization)}
                  >退出</PopconfirmButton>
                )
              );
            }

            return components;
          }}
        />
      </Table>
    );
  }
}


export default OrganizationList;
