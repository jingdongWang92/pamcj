import React from 'react';
import PropTypes from 'prop-types';
import Radio from 'antd/es/radio';


export default class RadioType extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
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
    const { value, onChange, options } = this.props;

    return (
      <Radio.Group
        options={options}
        value={value}
        onChange={evt => onChange(evt.target.value)}
      />
    );
  }
}
