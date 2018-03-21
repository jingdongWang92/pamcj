import React from 'react';
import { FormSection } from 'redux-form';
import Button from 'antd/es/button';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import LayerFieldSection from './LayerFieldSection';


export default function LayerFieldItem({ field, removeField }) {
  return (
    <Row style={{ background: 'hsla(0, 0%, 100%, 0.53)', marginTop: '1em' }}>
      <Col offset={1} span={22}>
        <Row>
          <Col span={9} offset={7}>
            <h4 className="text-center">属性定义</h4>
          </Col>
          <Col span={4} offset={2}>
            <Button type="danger" htmlType="button" onClick={removeField}>
              删除
            </Button>
          </Col>
        </Row>
        <Row>
          <FormSection name={field}>
            <LayerFieldSection />
          </FormSection>
        </Row>
      </Col>
    </Row>
  );
}
