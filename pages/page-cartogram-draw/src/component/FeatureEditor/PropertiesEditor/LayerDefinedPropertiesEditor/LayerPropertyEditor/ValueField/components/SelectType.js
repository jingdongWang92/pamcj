import React from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/es/select';


export default class SelectType extends React.Component {
  render() {
    const { options, onChange, value } = this.props;


    return (
      <Select
        value={value}
        onChange={onChange}
      >
        <Select.Option key="__empty__" value="" disabled>请选择</Select.Option>
        {options.map(option => (
          <Select.Option
            key={option.id}
            value={option.value}
          >{option.name}</Select.Option>
        ))}
      </Select>
    );
  }
}


SelectType.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};


SelectType.defaultProps = {
  value: '',
};
