import isNil from 'lodash/fp/isNil'; // null 或 undefined
import isBoolean from 'lodash/fp/isBoolean';
import isFinite from 'lodash/fp/isFinite'; // 排除 NaN、Infinity和-Infinity
import isString from 'lodash/fp/isString';
import isArray from 'lodash/fp/isArray';


export function isValidSimpleValue(value) {
  return isNil(value) || isBoolean(value) || isFinite(value) || isString(value);
}

export function isValidArrayValue(value) {
  return isArray(value) && value.every(value => isValidSimpleValue(value) || isValidArrayValue(value));
}

export default function valueValidator(props, propName, componentName) {
  const value = props[propName];

  if (!isValidSimpleValue(value) && !isValidArrayValue(value)) {
    return new Error(`Invalid prop ${propName} supplied to \`${componentName}\`. Validation failed.`);
  }
}
