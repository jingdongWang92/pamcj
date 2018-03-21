import React, { Component } from 'react'
import { Field } from 'redux-form';
import Button from 'antd/es/button';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Card from 'antd/es/card';

class WizardFormSecondPage extends Component {

  render() {
    const { onSubmit, previousPage } = this.props;
    return (
      <div>
        <form onSubmit={onSubmit}>
          <Card bordered={false} title={<span style={{ fontSize: '填写相关开票信息' }}></span>} />
          <div style={{marginTop: '20px'}}>
            <Row>
              <Col span={11}>
                <Field
                  name="title"
                  type="text"
                  component={renderField}
                  label="发票抬头"
                />
              </Col>
              <Col span={11} offset={2}>
                <Field
                  name="contact"
                  type="text"
                  component={renderField}
                  label="联系人" />
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Field
                  name="taxpayer_no"
                  type="text"
                  component={renderField}
                  label="纳税人识别号" />
              </Col>
              <Col span={11} offset={2}>
                <Field
                  name="mobile_phone"
                  type="text"
                  component={renderField}
                  label="联系电话" />
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Field
                  name="address"
                  type="text"
                  component={renderField}
                  label="邮寄地址" />
              </Col>
            </Row>
          </div>
          <div className="text-right">
            <Button htmlType="button" type="default" size="large" onClick={previousPage}>
              上一步
            </Button>
            <Button htmlType="submit" type="primary" size="large" style={{marginLeft: '10px'}}>提交</Button>
          </div>
        </form>
      </div>
    )
  }
}

export default WizardFormSecondPage;

const renderField = ({input, label, type, meta: {touched, error}}) => (
    <div className="form-group row">
      <div className="col-md-3">
        <label className="control-label">{label}</label>
      </div>
      <div className="control col-md-9">
        <input {...input} className="form-control" type={type} />
        {touched && error && <div><span style={{color:'red'}}>{error}</span></div>}
      </div>
    </div>
);
