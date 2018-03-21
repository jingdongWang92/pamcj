import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'antd/es/checkbox';


export default class CheckboxType extends React.Component {

  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ])),
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      disabled: PropTypes.bool,
    })).isRequired,
  }

  render() {
    const { options, value, onChange } = this.props;

    return (
      <Checkbox.Group
        options={options}
        value={value}
        onChange={onChange}
      />
    );
  }
}
