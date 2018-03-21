import React from 'react';
import PropTypes from 'prop-types';
import Collapse from 'antd/es/collapse';
import merge from 'lodash/fp/merge';
import StrokeEditor from './StrokeEditor';
import { TYPE_CURVE } from '@jcmap/constant-style-types';


export default class CurveStyleEditor extends React.Component {

  static propTypes = {
    value: PropTypes.shape({
      stroke: PropTypes.shape({
        color: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_CURVE,
      enabled: true,
      [propertyName]: property,
    }));
  }

  render() {
    const { value } = this.props;
    if (!value) { return null; }

    const { stroke } = value;

    return (
      <Collapse defaultActiveKey="graphic">
        <Collapse.Panel header="Stroke">
          <StrokeEditor
            value={stroke}
            onChange={this.handlePropertyChange('stroke')}
          />
        </Collapse.Panel>
      </Collapse>
    );
  }
}
