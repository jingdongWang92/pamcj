import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/es/button';
import Table from 'antd/es/table';
import Modal from 'antd/es/modal';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { isEmail } from 'validator';
import * as organizationRoles from '@jcmap/constant-organization-roles';
import PopconfirmButton from '@jcmap/component-popconfirm-button';


const roleFilter = Object.values(organizationRoles).map(({ name, code }) => ({
  text: name,
  value: code,
}));
const roleMap = Object.values(organizationRoles).reduce((accu, { name, code }) => ({
  ...accu,
  [code]: name,
}), {})


class OrganizationMemberList extends React.Component {

  static propTypes = {
    edittingOrganization: PropTypes.object,
    createOrganizationInvitation: PropTypes.func.isRequired,
    viewOrganization: PropTypes.func.isRequired,
    removeOrganizationMember: PropTypes.func.isRequired,
  }

  state = {}

  handleEmailChange = evt => {
    const email = evt.target.value;
    this.setState(state => ({
      email,
    }));
  }


  render() {
    const {
      edittingOrganization,
      createOrganizationInvitation,
      viewOrganization,
      isInviting,
      removeOrganizationMember,
    } = this.props;
    const { email, role } = this.state;
    let _members = [...edittingOrganization.members];
    if (email) {
      _members = _members.filter(member => member.email.includes(email));
    }


    return (
      <Modal
        title="管理成员"
        visible={true}
        onCancel={() => viewOrganization()}
        footer={[
          <Button
            key="cancel"
            onClick={() => viewOrganization()}
          >关闭</Button>,
        ]}
      >

        <Form.Item
          extra={email && isEmail(email) && !_members.length && (
            <div>
              此用户尚未加入此团队，发送
              <Button
                size="small"
                loading={isInviting}
                onClick={() => createOrganizationInvitation({
                  organization_id: edittingOrganization.id,
                  email: email,
                  role: role,
                })}>
                {isInviting ? '邀请中' : '邀请'}
              </Button>
            </div>
          )}
        >
          <Input.Search
            placeholder="输入邮箱"
            onChange={this.handleEmailChange}
          />
        </Form.Item>

        <div style={{minHeight: '350px'}}>
          <Table
            rowKey={user => user.id }
            pagination={false}
            dataSource={ _members }
          >
            <Table.Column
              title='Email'
              dataIndex='email'
              render={text => <span style={{color: '#207A8B'}}>{text}</span>}
            />

            <Table.Column
              title='Role'
              dataIndex='organization_member.role'
              filters={roleFilter}
              onFilter={(role, user) => user.organization_member.role === role}
              render={role => roleMap[role]}
            />

            <Table.Column
              title='Action'
              key='actions'
              render={(user) => {
                const components = [];

                if (user.organization_member.role !== organizationRoles.OWNER.code) {
                  components.push(
                    <PopconfirmButton
                      key="remove-organization-member"
                      title="确定要将此用户移除出团队吗？"
                      onConfirm={() => removeOrganizationMember(user.organization_member)}
                    >移除</PopconfirmButton>
                  );
                }

                return components;
              }}
            />
          </Table>
        </div>
      </Modal>
    );
  }
}


export default OrganizationMemberList;
