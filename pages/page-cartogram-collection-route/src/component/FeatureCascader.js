import React from 'react';
import Cascader from 'antd/es/cascader';


export default function FeatureSelector({ input, cascaderOptions }) {
  return (
    <Cascader {...input} options={cascaderOptions} />
  );
}
