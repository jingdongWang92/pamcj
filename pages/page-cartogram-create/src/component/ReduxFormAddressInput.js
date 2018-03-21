import React from 'react';
import FormItem from './FormItem';
import AutoComplete from 'antd/es/auto-complete';


export default function ReduxFormAddressInput(props) {
  const {
    label,
    required,
    input,
    inputTips,
    onSearch,
    onSelect,
    ...rest,
  } = props;

  return (
    <FormItem label={label} required={required}>
      <AutoComplete
        onSearch={onSearch}
        onSelect={(value, option) => onSelect(option.props.inputTip)}
        {...rest}
        {...input}
      >
        {(inputTips || []).map(item => (
          <AutoComplete.Option key={item.id} inputTip={item}>
            {item.name}
          </AutoComplete.Option>
        ))}
      </AutoComplete>
    </FormItem>
  );
}
