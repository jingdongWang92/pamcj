import React from 'react';
import AppShell from '@jcmap/component-app-shell';
import moment from 'moment';
import UserEditForm from './UserEditForm';
import Table from 'antd/es/table';
import Modal from 'antd/es/modal';
import Icon from 'antd/es/icon';
import Button from 'antd/es/button';


export default class PageUserList extends React.Component {
  state = {
    visible: false,
  }

  componentDidMount() {
    const { queryConditions } = this.props;
    const { pagination } = queryConditions;

    this.props.searchUsers(formatQueryConditions(pagination));
    this.props.searchPlans();
    this.props.fetchUserSelf();
  }

  onDelete = (record) => {
    console.log(record);
  }

  closeModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

  editUser(record) {
    this.props.editUser(record);
    this.setState({
      visible: !this.state.visible,
    });
  }


  onTableChange = (pagination, filters, sorter) => {
    this.props.searchUsers(formatQueryConditions(pagination, filters, sorter));
    this.props.changeQueryConditionSuccess({
      pagination,
      filters,
      sorter,
    });
  }


  render() {
    const { users, edittingUser, plans, updateUser, queryConditions } = this.props;
    const { visible } = this.state;
    const { pagination } = queryConditions;


    return (
      <AppShell>
        <div className="panel-body">
          <div className="pull-left text-left">
            <h2>用户列表</h2>
          </div>
        </div>
        <div style={{margin: '10px'}}>
        <Table
          rowKey={record => record.id }
          dataSource={ users }
          pagination={pagination}
          onChange={this.onTableChange}
        >
          <Table.Column
            title='账号'
            dataIndex='email'
            render={(text, user) => (
              <span style={{color: '#207A8B'}}>{text} {user.email_verified ? (<Icon type="check-circle-o" />) : null}</span>
            )}
          />

          <Table.Column
            title='类型'
            dataIndex='role'
            render={(text) => text === 'immortal' ? '超级帐户' : '普通账户'}
          />

          <Table.Column
            title='注册时间'
            dataIndex='created_at'
            render={text => moment(text).format('YYYY-MM-DD HH:mm:ss')}
          />

          <Table.Column
            title='当前方案'
            dataIndex='plan.name'
          />

          <Table.Column
            title='操作'
            key='action'
            render={(text, user) => {
              const isMyselfImmortal = this.props.myself && this.props.myself.role === 'immortal';
              const isUserMortal = user.role === 'mortal';


              return [
                isUserMortal && (
                  <Button
                    key="edit"
                    type="primary"
                    onClick={() => this.editUser(user)}
                  >编辑</Button>
                ),
                !user.email_verified && (
                  <Button
                    key="email"
                    onClick={() => this.props.sendRegisterEmail(user)}
                    style={{
                      marginLeft: '1em',
                    }}
                    loading={!!this.props.registerEmailSendingStatus[user.id]}
                  >发送注册邮件</Button>
                ),
                isUserMortal && isMyselfImmortal && (
                  <Button
                    key="impersonate"
                    type="warning"
                    style={{ marginLeft: '1em' }}
                    onClick={() => this.props.impersonateUser(user)}
                  >冒充</Button>
                ),
              ];
            }}
          />
        </Table>
        <Modal
          title=""
          visible={visible}
          width={700}
          footer={null}
          onCancel={this.closeModal}>
          <div>
            <UserEditForm
              initialValues={edittingUser}
              updateUser={updateUser}
              user={edittingUser}
              plans={plans}
            />
          </div>
        </Modal>
        </div>

      </AppShell>
    );
  }
}


function formatQueryConditions(pagination, filters, sorter) {
  return {
    limit: pagination.pageSize,
    skip: pagination.pageSize * (pagination.current - 1),
  };
}
