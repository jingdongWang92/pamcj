import React from 'react';
import Row from 'antd/es/row';
import Table from 'antd/es/table';
import Col from 'antd/es/col';
import Modal from 'antd/es/modal';
import Button from 'antd/es/button';
import moment from 'moment';

import InvoiceCreate from './InvoiceCreate';

class InvoiceList extends React.Component {

  render() {

    const { invoices, visible, openModal, closeModal } = this.props;

    return (
      <div>
        <Row style={{marginTop: '2em 0'}}>
          <p style={{fontSize: '2rem'}}>我的发票</p>
        </Row>
        <Row style={{margin: '1em 0'}}>
          <Col span={20}>
            <p style={{fontSize: '2rem'}}>开票需知</p>
            <p>· 支付金额必须满499元, 方可开具发票。</p>
            <p>· 默认开具增值税普通发票(纸质). 类型为[软件服务费], 税率为6%.每月20-25日集中开具发票。</p>
            <p>· 请务必仔细核对信息, 发票一经开具, 非我司原因将无法重开, 更多发票问题, 可<a href="/userinfo">点击查看</a></p>
          </Col>
          <Col span={4}>
            <Button type="primary" size="large" onClick={openModal}>申请发票</Button>
            <Modal
              title=""
              visible={visible}
              width={900}
              footer={null}
              onCancel={closeModal}>
              <InvoiceCreate
                {...this.props}
              />
            </Modal>
          </Col>
        </Row>
        <div style={{marginRight: '5em'}}>
          <Table
            pagination={false}
            rowKey={record => record.id}
            dataSource={invoices}
          >
            <Table.Column
              title='状态'
              dataIndex='status'
              render={text => text === undefined ? '已申请' : text}
            />
            <Table.Column
              title='发票金额'
              dataIndex='amount'
              render={text => `¥${text}`}
            />
            <Table.Column
              title='申请日期'
              dataIndex='created_at'
              render={text => moment(text).format('YYYY-MM-DD HH:mm:ss')}
            />
            <Table.Column
              title='发票寄出日期'
              dataIndex='post_at'
              render={text => text === undefined ? '' : moment(text).format('YYYY-MM-DD HH:mm:ss')}
            />
            <Table.Column
              title='快递公司'
              dataIndex='express'
            />
            <Table.Column
              title='快递单号'
              dataIndex='tracking_no'
            />
          </Table>
        </div>
      </div>
    );
  }
}

export default InvoiceList;
