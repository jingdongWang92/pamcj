import React from 'react';
import AppShell from '@jcmap/component-app-shell';
import PropTypes from 'prop-types';
import moment from 'moment';
import Table from 'antd/es/table';
import PopconfirmButton from '@jcmap/component-popconfirm-button';
import Divider from 'antd/es/divider';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import DownloadButton from '@jcnetwork/component-download-button';


class CartogramCollectionList extends React.Component {

  static propTypes = {
    searchCartogramCollections: PropTypes.func.isRequired,
    cartogramCollections: PropTypes.array.isRequired,
  }


  componentDidMount() {
    this.props.readAccessToken();
    this.props.searchCartogramCollections({ limit: 100, sort_by: 'created_at', sort: 'desc' });
  }


  render() {
    const { cartogramCollections, accessToken } = this.props;

    return (
      <AppShell>
        <Card bordered={false} title={<CardTitle text="项目列表" />} extra={<CardExtra />} />
        <div style={{ padding: '15px' }}>
          <Table
            rowKey={record => record.id}
            dataSource={cartogramCollections}
          >
            <Table.Column
              title='项目名称'
              key='name'
              render={(cartogramCollection) => `${cartogramCollection.owner.name} / ${cartogramCollection.name}`}
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
              render={(cartogramCollection) => [
                <a
                  key="cartogram-collection-view"
                  href={`/cartogram-collection/view#?cartogram_collection=${cartogramCollection.id}`}
                >编辑</a>,

                <Divider
                  key="cartogram-collection-route-divider"
                  type="vertical"
                />,

                <a
                  key="cartogram-collection-route"
                  href={`/cartogram-collection/route#?cartogram_collection=${cartogramCollection.id}`}
                >配置连接点</a>,

                <Divider
                  key="cartogram-collection-export-link-divider"
                  type="vertical"
                />,

                <DownloadButton
                  key="cartogram-collection-export-link"
                  fileLink={`//localhost:3010/${cartogramCollection.id}/geojson?token=${accessToken}&version=v3`}
                  // fileLink={`/apis/cartogram-collections/${cartogramCollection.id}/geojson?token=${accessToken}&version=v3`}
                  fileName={`${cartogramCollection.name}.json`}
                >导出数据文件</DownloadButton>,

                <Divider
                  key="remove-button-divider"
                  type="vertical"
                />,

                <PopconfirmButton
                  key="remove-button"
                  title="确定要删除该项目吗?"
                  onConfirm={() => this.props.removeCartogramCollection(cartogramCollection)}
                  buttonSize="default"
                >删除</PopconfirmButton>,
              ]}
            />
          </Table>
        </div>
      </AppShell>
    );
  }
}

export default CartogramCollectionList;

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
      href="/cartogram-collection/create"
    >新建项目</Button>,
  ];
}
