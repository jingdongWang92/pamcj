import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, } from 'redux-form';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Button from 'antd/es/button';


momentLocalizer(moment);


class UserEdit extends React.Component {

  render() {
    const { handleSubmit, updateUser, plans, user } = this.props;
    return (
      <div style={{ padding: '15px' }}>
        <div className="text-center" style={{marginBottom: '20px'}}>
          <h4>修改用户方案</h4>
          <p>当前用户方案: {(user.plan === undefined || user.plan === null) ? '免费版' : user.plan.name}</p>
        </div>
        <form className="form-horizontal" onSubmit={handleSubmit(updateUser)}>
          <div>
            <Field name="email" readOnly="readonly" component={InputBox} label="用户名"/>
            <Field name="plan_id" component={SelectBox} label="选择方案">
              <option value="">请选择</option>
              {plans.map(plan => (
                <ProductItem key={plan.id} plan={plan} />
              ))}
            </Field>
            <Field
              name="plan_expired_at"
              showTime={false}
              component={renderDateTimePicker}
              label="到期时间"
            />
            <div className="text-right row" style={{marginTop: '10px'}}>
              <Button htmlType="submit" type="primary" size="large" style={{marginRight: '15px'}}>提交</Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

UserEdit.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  updateUser: PropTypes.func,
  plans: PropTypes.array,
};

export default reduxForm({
  form: 'edit-user',
  enableReinitialize: true,
})(UserEdit);


function ProductItem({ plan }) {
  return (
    <option value={plan.id}>{plan.name}</option>
  );
}

function SelectBox({ input, children, label, disabled }) {
  return (
    <FormGroup label={label}>
      <select {...input} className="form-control" disabled={disabled}>
        {children}
      </select>
    </FormGroup>
  );
}


function InputBox({ input, label, placeholder, readOnly }) {
  return (
    <FormGroup label={label}>
      <input className="form-control" {...input} readOnly={readOnly} placeholder={placeholder} />
    </FormGroup>
  );
}


function FormGroup({ children, label }) {
  return (
    <div className="form-group row">
      <label className="col-sm-2 control-label" style={{fontSize:'14px'}}>{label}</label>
      <div className="col-sm-10">
        {children}
      </div>
    </div>
  );
}


function renderDateTimePicker({ input: { onChange, value }, showTime, label }) {
  return (
    <div className="row">
      <label className="col-sm-2 control-label" style={{fontSize:'14px'}}>{label}</label>
      <div className="col-sm-10">
        <DateTimePicker
          onChange={onChange}
          format="YYYY-MM-DD"
          time={showTime}
          value={!value ? null : new Date(value)}
        />
      </div>
    </div>
  );
}
