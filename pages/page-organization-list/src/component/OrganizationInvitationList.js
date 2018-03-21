import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Table from 'antd/es/table';
import PopconfirmButton from '@jcmap/component-popconfirm-button';
import Divider from 'antd/es/divider';
import 'moment/locale/zh-cn';
import * as organizationRoles from '@jcmap/constant-organization-roles';


const roleMap = Object.values(organizationRoles).reduce((accu, { name, code }) => ({
  ...accu,
  [code]: name,
}), {});


class OrganizationInvitationList extends React.Component {

  static propTypes = {
    acceptOrganizationInvitation: PropTypes.func.isRequired,
    rejectOrganizationInvitation: PropTypes.func.isRequired,
    organizationInvitations: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }


  render() {
    const {
      organizationInvitations,
      acceptOrganizationInvitation,
      rejectOrganizationInvitation,
      isLoading,
    } = this.props;

    return (
      <div>
        <Table
          rowKey={record => record.id}
          showHeader={true}
          dataSource={organizationInvitations}
          loading={isLoading}
        >
          <Table.Column
            title='团队名称'
            dataIndex='organization.name'
            render={name => <span style={{color: '#207A8B'}}>{name}</span>}
          />

          <Table.Column
            title='团队角色'
            dataIndex='role'
            render={role => roleMap[role]}
          />

          <Table.Column
            title='邀请时间'
            dataIndex='created_at'
            render={text => (
              <span title={moment.utc(text).format('YYYY-MM-DD HH:mm:SS')}>{moment.utc(text).from(moment.utc())}</span>
            )}
          />

          <Table.Column
            title='操作'
            key='action'
            render={(organizationInvitation) => {
              return [
                <PopconfirmButton
                  key="reject"
                  title="确定要拒绝该邀请吗？"
                  onConfirm={() => rejectOrganizationInvitation(organizationInvitation)}
                >拒绝</PopconfirmButton>,

                <Divider key="accept-divider" type="vertical" />,

                <PopconfirmButton
                  key="accept"
                  title="确定要加入该团队吗？"
                  buttonType="primary"
                  onConfirm={() => acceptOrganizationInvitation(organizationInvitation)}
                >接受</PopconfirmButton>,
              ];
            }}
          />
        </Table>
      </div>
    );
  }
}


export default OrganizationInvitationList;
