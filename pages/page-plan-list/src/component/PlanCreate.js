import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, } from 'redux-form';
import { CheckBox, InputBox, CardTitle, CardExtra } from './common';
import Form from 'antd/es/form';
import Card from 'antd/es/card';
import PlanLevelSelector from './PlanLevelSelector';
import { FormGroup } from './common';


class PlanCreate extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    createPlan: PropTypes.func,
  }


  render() {
    const { handleSubmit, createPlan } = this.props;

    return (
      <Card bordered={false} title={<CardTitle text="新建方案" />} extra={<CardExtra form="plan-create" />}>
        <Form id="plan-create" onSubmit={handleSubmit(createPlan)}>
          <Field name="name" label="方案名称" component={InputBox} />
          <FormGroup label="方案等级">
            <Field
              name="level"
              component={({ input }) => <PlanLevelSelector {...input} />}
            />
          </FormGroup>
          <Field name="alias" label="方案别名" component={InputBox} />
          <Field name="price" label="方案价格" type="number" component={InputBox} />
          <Field name="organization_count" label="团队数量" type="number" component={InputBox} />
          <Field name="project_count" label="项目数量" type="number" component={InputBox} />
          <Field name="map_count" label="地图数量" type="number" component={InputBox} />
          <Field label="支持数据导出" name="file_export" component={CheckBox} checkedChildren="是" unCheckedChildren="否" />
        </Form>
      </Card>
    );
  }
}


export default reduxForm({
  form: 'plan-create',
})(PlanCreate);
