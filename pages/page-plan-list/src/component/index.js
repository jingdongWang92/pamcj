import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppShell from '@jcmap/component-app-shell';
import moment from 'moment';
import Table from 'antd/es/table';
import PopconfirmButton from '@jcmap/component-popconfirm-button';
import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import Card from 'antd/es/card';
import PlanCreate from './PlanCreate';
import PlanUpdate from './PlanUpdate';
import Divider from 'antd/es/divider';


class PlanList extends Component {

  constructor(props) {
    super();
    this.state = {
      visible: false,
      updatePlanModalVisible: false,
    };
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this.props.searchPlans();
  }

  onDelete(record){
    this.props.removePlan(record);
  }

  editPlan(plan) {
    this.props.editPlan(plan);
    this.setState({
      updatePlanModalVisible: true,
    });
  }

  openCreatePlanModal = () => {
    this.setState({
      visible: true,
    });
  }

  closeCreatePlanModal = () => {
    this.setState({
      visible: false,
    });
  }

  openUpdatePlanModal = () => {
    this.setState({
      updatePlanModalVisible: true,
    });
  }

  closeUpdatePlanModal = () => {
    this.setState({
      updatePlanModalVisible: false,
    });
  }

  render() {
    const {
      plans,
      createPlan,
      updatePlan,
      edittingPlan,
      markPlanAsLevelDefault,
    } = this.props;

    return (
      <AppShell>
        <Card
          bordered={false}
          title={<span style={{ fontSize: '30px' }}>方案列表</span>}
          extra={<Button key="create" type="primary" size="large" onClick={this.openCreatePlanModal}>新建方案</Button>}
        />

        <div style={{ padding: '15px' }}>
          <Table
            rowKey={record => record.id }
            showHeader={true}
            dataSource={ plans }
          >
            <Table.Column
              title='方案名称'
              dataIndex='name'
              render={text => <span style={{color: '#207A8B'}}>{text}</span>}
            />

            <Table.Column
              title='方案等级'
              dataIndex='level'
            />

            <Table.Column
              title='是否启用'
              dataIndex='is_enabled'
              render={yes => yes ? 'Yes' : null}
            />

            <Table.Column
              title='价格'
              dataIndex='price'
              render={text => `¥${text}`}
            />

            <Table.Column
              title='项目数量'
              dataIndex='project_count'
            />

            <Table.Column
              title="地图数量"
              dataIndex='map_count'
            />

            <Table.Column
              title='创建时间'
              dataIndex='created_at'
              render={text => moment(text).format('YYYY-MM-DD HH:mm:ss')}
            />

            <Table.Column
              title='操作'
              key='action'
              render={(text, plan, index) => (
                <span>
                  <a onClick={() => this.editPlan(plan)}>创建相似Plan</a>
                  {!plan.is_enabled && [
                    <Divider key="mark-plan-as-level-default-divider" type="vertical" />,
                    <Button key="mark-plan-as-level-default" onClick={() => markPlanAsLevelDefault(plan)}>启用</Button>
                  ]}
                  <span className="ant-divider" />
                  <PopconfirmButton
                    title="确定要删除该方案吗?"
                    onConfirm={this.onDelete.bind(this, plan)}
                  >删除</PopconfirmButton>
                </span>
              )}
            />
          </Table>
        </div>
        <Modal
          title=""
          visible={this.state.visible}
          width={600}
          footer={null}
          onCancel={this.closeCreatePlanModal}
        >
          <PlanCreate createPlan={ createPlan } />
        </Modal>
        <Modal
          title=""
          visible={this.state.updatePlanModalVisible}
          width={600}
          footer={null}
          onCancel={this.closeUpdatePlanModal}
        >
          <PlanUpdate
            updatePlan={updatePlan}
            initialValues={edittingPlan}
          />
        </Modal>
      </AppShell>
    );
  }
}

PlanList.propTypes = {
  searchPlans: PropTypes.func.isRequired,
  plans: PropTypes.array.isRequired,
};

export default PlanList;
