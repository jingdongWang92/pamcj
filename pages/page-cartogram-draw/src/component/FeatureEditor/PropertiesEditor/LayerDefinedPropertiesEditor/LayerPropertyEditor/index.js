import React from 'react';
import PropTypes from 'prop-types';
import ValueField from './ValueField';
import uuid from 'uuid';
import Form from 'antd/es/form';


export default class LayerPropertyEditor extends React.Component {
  static propTypes = {
    field: PropTypes.object,
  }

  static contextTypes = {
    selectedFeature: PropTypes.object.isRequired,
    updateFeature: PropTypes.func.isRequired,
  }


  handlePropertyValueChange = (feature, key) => newValue => {
    const property = feature.properties.find(_property => _property.name === key);

    let newProperties = [...feature.properties];
    if (property) {
      newProperties = newProperties.map(property => {
        if (property.name !== key) { return property; }
        return {
          ...property,
          value: newValue,
        };
      });
    } else {
      newProperties.push({
        id: uuid(),
        name: key,
        value: newValue,
      });
    }

    const newFeature = {
      ...feature,
      properties: newProperties,
    };

    this.context.updateFeature(newFeature);
  }


  render() {
    const { field } = this.props;
    const { name, input_type, ...rest } = field;
    const { selectedFeature } = this.context;
    const { properties } = selectedFeature;
    const property = properties.find(_property => _property.name === field.name);


    return (
      <Form.Item label={name} extra={field.description}>
        <ValueField
          {...rest}
          type={input_type}
          value={property && property.value}
          onChange={this.handlePropertyValueChange(selectedFeature, name)}
        />
      </Form.Item>
    );
  }
}
