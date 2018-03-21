import React from 'react';
import Popconfirm from 'antd/es/popconfirm';
import Button from 'antd/es/button';
import defaults from 'lodash/fp/defaults';


const popconfirmDefaults = {
  okText: 'Yes',
  cancelText: 'No',
};

const buttonDefaults = {
  buttonType: 'danger',
  buttonSize: 'small',
  buttonLoading: false,
};


export default function PopconfirmButton(props) {
  const {
    children,
    buttonType,
    buttonSize,
    buttonLoading,
    ...rest,
  } = defaults(popconfirmDefaults, defaults(buttonDefaults, props));

  return (
    <Popconfirm {...rest}>
      <Button
        type={buttonType}
        size={buttonSize}
        loading={buttonLoading}
      >{children}</Button>
    </Popconfirm>
  );
}
