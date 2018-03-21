import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppShell from '@jcmap/component-app-shell';
import moment from 'moment';
import Table from 'antd/es/table';
import PopconfirmButton from '@jcmap/component-popconfirm-button';
import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import Card from 'antd/es/card';
import GeometryStyleSample from './GeometryTypeSample';


export default class LayerList extends Component {

  static propTypes = {
    searchLayers: PropTypes.func.isRequired,
    layers: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const { pagination, filters, sorter } = this.props.queryConditions;
    this.props.searchLayers(formatQueryConditions(pagination, filters, sorter));
  }


  onTableChange = (pagination, filters, sorter) => {
    this.props.searchLayers(formatQueryConditions(pagination, filters, sorter));
    this.props.changeQueryConditionSuccess({
      pagination,
      filters,
      sorter,
    });
  }


  render() {
    const { layers, queryConditions, loading } = this.props;

    return (
      <AppShell>
        <Card bordered={false} title={<CardTitle text="图层列表" />} extra={<CardExtra />} />
        <div style={{ padding: '15px' }}>
          <Table
            rowKey={layer => layer.id }
            dataSource={ layers }
            pagination={queryConditions.pagination}
            onChange={this.onTableChange}
            loading={loading}
          >
            <Table.Column
              title='图层名称'
              dataIndex='name'
              render={text => <span style={{color: '#207A8B'}}>{text}</span>}
            />
            <Table.Column
              title='图层代码'
              dataIndex='code'
              render={text => <span style={{color: '#F15025'}}>{text}</span>}
            />
            <Table.Column
              title="几何类型"
              dataIndex='geometry_type'
            />
            <Table.Column
              title='显示顺序'
              dataIndex='sequence'
              render={text => <span style={{color: '#207A8B'}}>{text}</span>}
            />
            <Table.Column
              title='图层类别'
              dataIndex='owner.name'
              render={(organizationName, layer) => layer.is_created_by_system ? (<span style={{ color: '#f15025' }}>System</span>) : 'Custom'}
            />
            <Table.Column
              title='图层样式'
              dataIndex='geometry_style'
              render={(geometryStyle, layer) => (<GeometryStyleSample geometryStyle={geometryStyle} />)}
            />
            <Table.Column
              title='上次编辑时间'
              dataIndex='updated_at'
              render={text => moment(text).format('YYYY-MM-DD HH:mm:ss')}
            />
            <Table.Column
              title='操作'
              key='action'
              render={(text, layer) => (
                <span>
                  <Button type="primary" href={`/layer/view#?layer=${layer.id}`}>编辑图层</Button>
                  <Divider type="vertical" />
                  <Button href={`/geometry-style/view#?geometry_style=${layer.geometry_style.id}`}>编辑样式</Button>
                  <Divider type="vertical" />
                  <PopconfirmButton
                    title="确定要删除该图层吗?"
                    onConfirm={() => this.props.removeLayer(layer)}
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
      key="layer-create"
      type="primary"
      size="large"
      href="/layer/create"
    >新建图层</Button>,
  ];
}
