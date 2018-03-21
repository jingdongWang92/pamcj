import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Col from 'antd/es/col';
import ReduxFormImageUpload from './ReduxFormImageUpload';

class UpdateProfiles extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
  }


  render() {
    const { handleSubmit, updateProfile, } = this.props;

    const formItemLayout = {
      colon: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Form id='profile-update' onSubmit={handleSubmit(updateProfile)}>
        <div style={{ paddingTop: '20px' }}>

          <Form.Item {...formItemLayout} label="头像">
            <Field
              name="avatar"
              component={ReduxFormImageUpload}
            />
          </Form.Item>

          <Form.Item {...formItemLayout} label="姓名">
            <Field
              name="username"
              component={({ input }) => (
                <Input type="text"  {...input} />
              )}
            />
          </Form.Item>

          <Form.Item {...formItemLayout} label="邮箱">
            <Field
              name="email"
              component={({ input }) => (
                <Input type="text" {...input} />
              )}
            />
          </Form.Item>

        </div>
        <Col offset={2}>
          <Button type="primary" size="large" htmlType="submit" >修改个人信息</Button>
        </Col>
      </Form>
    );
  }
}


export default reduxForm({ form: 'profile-update' })(UpdateProfiles);
