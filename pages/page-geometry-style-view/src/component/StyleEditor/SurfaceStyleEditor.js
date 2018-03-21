import React from 'react';
import PropTypes from 'prop-types';
import Collapse from 'antd/es/collapse';
import merge from 'lodash/fp/merge';
import StrokeEditor from './StrokeEditor';
import FillEditor from './FillEditor';
import { TYPE_SURFACE } from '@jcmap/constant-style-types';


export default class SurfaceStyleEditor extends React.Component {

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
      type: TYPE_SURFACE,
      enabled: true,
      [propertyName]: property,
    }));
  }

  render() {
    const { value } = this.props;
    if (!value) { return null; }

    const { fill, stroke } = value;

    return (
      <Collapse defaultActiveKey="graphic">
        <Collapse.Panel header="Fill">
          <FillEditor
            value={fill}
            onChange={this.handlePropertyChange('fill')}
          />
        </Collapse.Panel>

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
