import React from 'react';
import Row from 'antd/es/row';
import Table from 'antd/es/table';
import Icon from 'antd/es/icon';
import Tag from 'antd/es/tag';
import moment from 'moment';

class OrderList extends React.Component {

  render() {

    const { orders } = this.props;

    return (
      <Row style={{marginTop: '2em 0'}}>
        <p style={{fontSize: '2rem'}}>我的账单</p>
        <Table
          rowKey={record => record.id}
          dataSource={orders}
        >
          <Table.Column
            title='购买方案'
            dataIndex='merchandise_name'
          />
          <Table.Column
            title='金额'
            dataIndex='trade_amount'
            render={text => `¥${text}`}
          />
          <Table.Column
            title='支付方式'
            dataIndex='pay_method'
            render={text => {
              if(!text) return <Tag color="red">未支付</Tag>;
              return text === 'alipay'
                ? <Icon type="alipay" style={{fontSize: '24px', color: 'rgb(18,152,233)'}} />
                : <Icon type="wechat" style={{fontSize: '24px', color: 'rgb(24,179,12)'}}/>;
            }}
          />
          <Table.Column
            title='付费日期'
            dataIndex='payed_at'
            render={payedAt => payedAt ? moment(payedAt).format('YYYY-MM-DD HH:mm:ss') : null}
          />
        </Table>
      </Row>
    );
  }
}

export default OrderList;
