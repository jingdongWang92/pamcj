import React from 'react';
import PropTypes from 'prop-types';
import AppShell from '@jcmap/component-app-shell';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import PopconfirmButton from '@jcmap/component-popconfirm-button';
import Divider from 'antd/es/divider';
import moment from 'moment';


class CartogramList extends React.Component {

  componentDidMount() {
    const { pagination, filters, sorter } = this.props.queryConditions;
    this.props.searchCartograms(formatQueryConditions(pagination, filters, sorter));
  }

  onTableChange = (pagination, filters, sorter) => {
    this.props.searchCartograms(formatQueryConditions(pagination, filters, sorter));
    this.props.changeQueryConditionSuccess({
      pagination,
      filters,
      sorter,
    });
  }

  render() {
    const { cartograms, queryConditions, loading } = this.props;
    return (
      <AppShell>
        <Card bordered={false} title={<CardTitle text="地图列表" />} extra={<CardExtra />} />
        <div style={{ padding: '15px' }}>
          <Table
            rowKey={record => record.id}
            dataSource={ cartograms }
            pagination={queryConditions.pagination}
            onChange={this.onTableChange}
            loading={loading}
          >
            <Table.Column
              title='地图名称'
              dataIndex='name'
              render={text => <span style={{color: '#3498DB'}}>{text}</span>}
            />
            <Table.Column
              title='地址'
              dataIndex='address'
              width={200}
              render={text => <div className="span-address">地址: {text}</div>}
            />
            <Table.Column
              title='所有者'
              dataIndex='owner.name'
            />
            <Table.Column
              title='创建时间'
              dataIndex='created_at'
              render={text => moment(text).format('YYYY-MM-DD HH:mm:ss')}
            />
            <Table.Column
              title='上次编辑时间'
              dataIndex='updated_at'
              render={text => moment(text).format('YYYY-MM-DD HH:mm:ss')}
            />
            <Table.Column
              title='操作'
              key='action'
              render={(text, cartogram) => (
                <span>
                  <a style={{color: '#1890ff'}} href={`/cartogram/view#?cartogram=${cartogram.id}`}>编辑</a>
                  <Divider type="vertical"/>
                  <a style={{color: '#1890ff'}} href={`/cartogram/georeference#?cartogram=${cartogram.id}`}>配准</a>
                  <Divider type="vertical"/>
                  <a style={{color: '#1890ff'}} href={`/cartogram/draw#?cartogram=${cartogram.id}`}>绘制</a>
                  <Divider type="vertical"/>
                  <PopconfirmButton
                    title="确定要删除该地图吗?"
                    onConfirm={() => this.props.removeCartogram(cartogram)}
                  >删除</PopconfirmButton>
                </span>
              )}
            />
          </Table>
        </div>
      </AppShell>
    );
  }
}

CartogramList.propTypes = {
  searchCartograms: PropTypes.func.isRequired,
  cartograms: PropTypes.array.isRequired,
  removeCartogram: PropTypes.func.isRequired,
};


export default CartogramList;


function formatQueryConditions(pagination, filters, sorter) {
  return {
    limit: pagination.pageSize,
    skip: pagination.pageSize * (pagination.current - 1),
  };
}


function CardTitle({ text }) {
  return (
    <span style={{ fontSize: '30px' }}>{text}</span>
  );
}


function CardExtra() {
  return [
    <Button
      key="cartogram-create"
      type="primary"
      size="large"
      href="/cartogram/create"
    >新建地图</Button>,
  ];
}
