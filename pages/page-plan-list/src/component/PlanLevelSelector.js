import React from 'react';
import Select from 'antd/es/select';
import {
  LEVEL_0,
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
} from '@jcmap/constant-plan-levels';


export default function PlanLevelSelector(props) {
  return (
    <Select {...props}>
      <Select.Option value={LEVEL_0}>{LEVEL_0}</Select.Option>
      <Select.Option value={LEVEL_1}>{LEVEL_1}</Select.Option>
      <Select.Option value={LEVEL_2}>{LEVEL_2}</Select.Option>
      <Select.Option value={LEVEL_3}>{LEVEL_3}</Select.Option>
    </Select>
  );
}
