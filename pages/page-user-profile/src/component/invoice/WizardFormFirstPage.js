import React, { Component } from 'react';
import Table from 'antd/es/table';
import Icon from 'antd/es/icon';
import Tag from 'antd/es/tag';
import moment from 'moment';
import { Field } from 'redux-form';


class WizardFormFirstPage extends Component{

  render() {

    const { onSubmit, orders, selectedRowKeys, totalAmount, selectOrders, computeTotalAmount } = this.props
    return (
      <div>
        <h3>选择未开具发票账单</h3>
        <form onSubmit={onSubmit}>
          <Field
            name="orders"
            component={TableOrders}
            selectedRowKeys={selectedRowKeys}
            selectOrders={selectOrders}
            orders={orders}
            computeTotalAmount={computeTotalAmount}
          />
          <div className="text-right" style={{marginTop: '10px'}}>
            <span>发票金额: ¥{totalAmount.toFixed(2)}</span>
            <button
              className="ant-btn-primary ant-btn-lg"
              disabled={ (totalAmount === 0 || totalAmount < 499) ? 'disabled' : '' }
              type="submit"
              style={{marginLeft: '10px'}}>下一步
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default WizardFormFirstPage;

function TableOrders(props) {
  const { orders, selectedRowKeys } = props;

  let unInvoicedOrders = [];
  for (var i = 0; i < orders.length; i++) {
    if(orders[i].payed_at && (!orders[i].invoiced || orders[i].invoiced === '0')) {
      unInvoicedOrders.push(orders[i]);
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => {
      props.input.onChange(selectedRowKeys);
      props.selectOrders(selectedRowKeys);
      let totalAmount = 0;
      for (let i = 0; i < selectedRowKeys.length; i++) {
        for (let j = 0; j < orders.length; j++) {
          if(orders[j].id === selectedRowKeys[i]) {
            totalAmount += Number.parseFloat(orders[j].trade_amount);
          }
        }
      }
      props.computeTotalAmount(totalAmount);
    },
  };
  return(
    <div style={{marginTop: '20px'}}>
      <Table
        rowSelection={rowSelection}
        pagination={false}
        rowKey={record => record.id}
        dataSource={unInvoicedOrders}
      >
        <Table.Column
          title='方案'
          dataIndex='merchandise_name'
        />
        <Table.Column
          title='金额'
          dataIndex='trade_amount'
          render={text => `¥${text}`}
        />
        <Table.Column
          title='时长'
          render={text => '年付'}
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
          render={text => moment(text).format('YYYY-MM-DD HH:mm:ss')}
        />
      </Table>
    </div>
  );
}
