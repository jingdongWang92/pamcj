import React from 'react';
import AppShell from '@jcmap/component-app-shell';
import PropTypes from 'prop-types';
import CartogramRouteAddForm from './CartogramRouteAddForm';
import CartogramRouteEditForm from './CartogramRouteEditForm';
import URI from '@jcnetwork/util-uri';
import Table from 'antd/es/table';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import Modal from 'antd/es/modal';
import { CARTOGRAM_ROUTE_CREATE_FORM, CARTOGRAM_ROUTE_EDIT_FORM } from '../constants';


class CartogramCollectionRoute extends React.Component {

  static propTypes = {
    fetchCartogramCollection: PropTypes.func.isRequired,
    searchFeatures: PropTypes.func.isRequired,

    createCartogramRoute: PropTypes.func.isRequired,
    searchCartogramRoutes: PropTypes.func.isRequired,
    updateCartogramRoute: PropTypes.func.isRequired,
    removeCartogramRoute: PropTypes.func.isRequired,

    cartograms: PropTypes.array.isRequired,
    cartogramRoutes: PropTypes.array.isRequired,
  }


  componentDidMount() {
    const hashParams = (new URI()).hash(true);
    const cartogramCollectionId = hashParams.cartogram_collection_id || hashParams.cartogram_collection;
    this.props.loadData(cartogramCollectionId);
  }


  handleTableChange = (pagination, filters, sorter) => {
    this.props.changeTablePaginationSuccess(pagination);
  }


  render() {
    const {
      mode,

      cartograms,
      cartogramCollection,
      cartogramRoutes,

      viewCartogramRouteSuccess: viewCartogramRoute,
      addCartogramRouteSuccess: addCartogramRoute,
      editCartogramRouteSuccess: editCartogramRoute,

      createCartogramRoute,
      updateCartogramRoute,
      removeCartogramRoute,

      edittingCartogramRoute,

      isSubmitting,

      tablePagination,
      tableLoading,
      positions,
      isCreating,
    } = this.props;


    const cartogramFilterData = cartograms.map(cartogram => ({ text: cartogram.name, value: cartogram.id }));


    return (
      <AppShell>
        <Card
          bordered={false}
          title={
            <CardTitle text="配置地图集连接点" />
          }
          extra={
            <CardExtra addCartogramRoute={addCartogramRoute} isSubmitting={isSubmitting}/>
          }
        >
          <Table
            title={(currentPageData) => (<span style={{ fontSize: '24px' }}>{cartogramCollection && cartogramCollection.name}</span>)}
            dataSource={cartogramRoutes}
            pagination={tablePagination}
            loading={tableLoading}
            onChange={this.handleTableChange}
            rowKey={cartogramRoute => cartogramRoute.id}
          >
            <Table.Column
              title="起始地点"
              dataIndex="from_feature"
              render={renderFeaturePositionCell}
              filters={cartogramFilterData}
              onFilter={(cartogramId, cartogramRoute) => cartogramRoute.from_feature.cartogram.id === cartogramId }
            />

            <Table.Column
              title="起始地点类型"
              dataIndex="from_feature.layer.name"
            />

            <Table.Column
              title="目标地点"
              dataIndex="to_feature"
              render={renderFeaturePositionCell}
              filters={cartogramFilterData}
              onFilter={(cartogramId, cartogramRoute) => cartogramRoute.to_feature.cartogram.id === cartogramId }
            />

            <Table.Column
              title="目标地点类型"
              dataIndex="to_feature.layer.name"
            />

            <Table.Column
              title="操作"
              key="actions"
              render={(cartogramRoute) => {
                return [
                  <Button key="edit" onClick={() => editCartogramRoute(cartogramRoute)}>编辑</Button>,
                  <Button key="del" onClick={() => removeCartogramRoute(cartogramRoute)}>删除</Button>
                ];
              }}
            />
          </Table>


          {mode === 'add' ? (
            <Modal
              title="添加路由"
              visible={true}
              onCancel={() => viewCartogramRoute()}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => viewCartogramRoute()}
                >取消</Button>,

                <Button
                  key="submit"
                  type="primary"
                  htmlType="submit"
                  loading={isCreating}
                  form={CARTOGRAM_ROUTE_CREATE_FORM}
                >添加</Button>,
              ]}
            >
              <CartogramRouteAddForm
                positions={positions}
                createCartogramRoute={createCartogramRoute}
              />
            </Modal>
          ) : null}

          {mode === 'edit' ? (
            <Modal
              title="修改路由"
              visible={true}
              onCancel={() => viewCartogramRoute()}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => viewCartogramRoute()}
                >取消</Button>,

                <Button
                  key="submit"
                  type="primary"
                  htmlType="submit"
                  loading={isCreating}
                  form={CARTOGRAM_ROUTE_EDIT_FORM}
                >修改</Button>,
              ]}
            >
              <CartogramRouteEditForm
                positions={positions}
                initialValues={edittingCartogramRoute}
                updateCartogramRoute={updateCartogramRoute}
              />
            </Modal>
          ) : null}
        </Card>
      </AppShell>
    );
  }
}


export default CartogramCollectionRoute;


function CardTitle({ text }) {
  return (
    <span style={{ fontSize: '30px' }}>{text}</span>
  );
}


function CardExtra({ addCartogramRoute }) {
  return [
    <Button
      key="add-route"
      type="primary"
      onClick={() => addCartogramRoute('create')}
    >添加连接点</Button>,

    <Divider
      key="1"
      type="vertical"
    />,

    <Button
      key="link-to-cartogram-collection-list"
      type="ghost"
      href="/cartogram-collection/list"
    >返回地图集列表</Button>,
  ];
}


function getTitleOfFeature(feature) {
  if (!feature) { return ''; }

  return feature.formattedProperties.title || `${feature.layer.name}:${feature.id}`
}


function renderFeaturePositionCell(feature) {
  return `${feature.cartogram.name} / ${getTitleOfFeature(feature)}`;
}
