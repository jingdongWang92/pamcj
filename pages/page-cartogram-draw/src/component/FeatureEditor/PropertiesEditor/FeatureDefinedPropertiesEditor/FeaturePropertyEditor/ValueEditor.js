import React from 'react';
import PropTypes from 'prop-types';
import Input from 'antd/es/input';


export default class FeaturePropertyValueEditor extends React.Component {
  static contextTypes = {
    selectedFeature: PropTypes.object.isRequired,
    updateFeature: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
  }


  handlePropertyValueChange = (feature, field) => evt => {
    const value = evt.target.value;

    const newProperties = feature.properties.map(property => {
      if (property.name !== field.name) { return property; }
      return {
        ...property,
        value,
      };
    });

    const newFeature = {
      ...feature,
      properties: newProperties,
    };


    this.context.updateFeature(newFeature);
  }


  render() {
    const { selectedFeature, field } = this.context;
    const property = selectedFeature.properties.find(_property => _property.name === field.name);


    return (
      <Input
        value={property.value}
        onChange={this.handlePropertyValueChange(selectedFeature, field)}
        placeholder="value"
      />
    );
  }
}
