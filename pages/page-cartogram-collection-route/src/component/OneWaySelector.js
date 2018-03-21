import React from 'react';
import Select from 'antd/es/select';


export default class OneWaySelector extends React.PureComponent {
  render() {
    return (
      <Select {...this.props}>
        <Select.Option value="no">不是</Select.Option>
        <Select.Option value="yes">是</Select.Option>
      </Select>
    );
  }
}
