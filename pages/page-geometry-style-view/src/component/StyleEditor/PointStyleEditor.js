import React from 'react';
import PropTypes from 'prop-types';
import Collapse from 'antd/es/collapse';
import GraphicEditor from './GraphicEditor';
import AnchorPointEditor from './AnchorPointEditor';
import DisplacementEditor from './DisplacementEditor';
import merge from 'lodash/fp/merge';
import OpacityEditor from './OpacityEditor';
import SizeEditor from './SizeEditor';
import RotationEditor from './RotationEditor';
import { TYPE_POINT, TYPE_EXTERNAL_GRAPHIC, TYPE_MARK } from '@jcmap/constant-style-types';


export default class PointStyleEditor extends React.Component {

  static propTypes = {
    value: PropTypes.shape({
      graphic: PropTypes.shape({
        value: PropTypes.shape({
          type: PropTypes.oneOf([TYPE_EXTERNAL_GRAPHIC, TYPE_MARK]).isRequired,
          link: PropTypes.string,
          shape: PropTypes.oneOf(['square', 'circle']),
          fill: PropTypes.shape({
            color: PropTypes.string.isRequired,
          }),
          stroke: PropTypes.shape({
            color: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
          }),
        }),
      }).isRequired,
    }).isRequired,
  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_POINT,
      enabled: true,
      [propertyName]: property,
    }));
  }

  render() {
    const { value } = this.props;
    if (!value) { return null; }

    const { graphic, opacity, size, rotation, anchor_point, displacement } = value;

    return (
      <Collapse defaultActiveKey="graphic">
        <GraphicEditor
          value={graphic}
          onChange={this.handlePropertyChange('graphic')}
        />

        <Collapse.Panel header="Opacity">
          <OpacityEditor
            value={opacity}
            onChange={this.handlePropertyChange('opacity')}
          />
        </Collapse.Panel>

        <Collapse.Panel header="Size">
          <SizeEditor
            value={size}
            onChange={this.handlePropertyChange('size')}
          />
        </Collapse.Panel>

        <Collapse.Panel header="Rotation">
          <RotationEditor
            value={rotation}
            onChange={this.handlePropertyChange('rotation')}
          />
        </Collapse.Panel>

        <Collapse.Panel header="Anchor Point">
          <AnchorPointEditor
            value={anchor_point}
            onChange={this.handlePropertyChange('anchor_point')}
          />
        </Collapse.Panel>

        <Collapse.Panel header="Displacement">
          <DisplacementEditor
            value={displacement}
            onChange={this.handlePropertyChange('displacement')}
          />
        </Collapse.Panel>
      </Collapse>
    );
  }
}
