import React from 'react';
import PropTypes from 'prop-types';
import LayerPropertyEditor from './LayerPropertyEditor';


export default class LayerDefinedPropertiesEditor extends React.Component {
  static contextTypes = {
    selectedFeature: PropTypes.object,
  }


  render() {
    const { selectedFeature } = this.context;
    const { layer } = selectedFeature;
    const { fields } = layer;


    return fields.map(field => (
      <LayerPropertyEditor key={field.name} field={field} />
    ));
  }
}
