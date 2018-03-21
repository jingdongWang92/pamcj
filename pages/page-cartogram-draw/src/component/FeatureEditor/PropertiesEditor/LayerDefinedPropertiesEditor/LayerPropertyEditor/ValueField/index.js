import React from 'react';
import PropTypes from 'prop-types';
import { TextType, NumberType, RadioType, CheckboxType, SelectType } from './components';


class ValueField extends React.Component {
  render() {
    const { type, ...rest } = this.props;


    if (type === 'text') {
      return (
        <TextType {...rest} />
      );
    } else if (type === 'number') {
      return (
        <NumberType placeholder="请输入数字" {...rest} />
      );
    } else if (type === 'radio') {
      return (
        <RadioType
          {...rest}
          options={rest.options.map(option => ({
            ...option,
            label: option.name,
          }))}
        />
      );
    } else if (type === 'checkbox') {
      return (
        <CheckboxType
          {...rest}
          options={rest.options.map(option => ({
            ...option,
            label: option.name,
          }))}
        />
      );
    } else if (type === 'select') {
      return (
        <SelectType {...rest} />
      );
    }

    return null;
  }
}


ValueField.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
  ]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
};


export default ValueField;
