import React from 'react';
import LayerDefinedPropertiesEditor from './LayerDefinedPropertiesEditor';
import FeatureDefinedPropertiesEditor from './FeatureDefinedPropertiesEditor';


export default class PropertiesEditor extends React.Component {
  render() {
    return [
      <LayerDefinedPropertiesEditor key="layer_defined_properties_editor" />,
      <FeatureDefinedPropertiesEditor key="feature_defined_properties_editor" />
    ];
  }
}
