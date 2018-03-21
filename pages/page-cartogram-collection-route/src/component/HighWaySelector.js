import React from 'react';
import Select from 'antd/es/select';


export default class HighWaySelector extends React.PureComponent {
  render() {
    return (
      <Select {...this.props}>
        <Select.Option value="both">人车共用</Select.Option>
        <Select.Option value="motorway">车行道</Select.Option>
        <Select.Option value="footway">人行道</Select.Option>
      </Select>
    );
  }
}
