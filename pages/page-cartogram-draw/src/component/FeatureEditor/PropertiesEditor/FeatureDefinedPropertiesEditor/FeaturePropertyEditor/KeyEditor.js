import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Input from 'antd/es/input';


export default class FeaturePropertyKeyEditor extends React.Component {
  static contextTypes = {
    selectedFeature: PropTypes.object.isRequired,
    updateFeature: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
  }


  constructor(props, context) {
    super(props, context);

    this.state = {
      value: context.field.name,
    };
  }


  handlePropertyKeyChange = (feature, field) => evt => {
    const value = evt.target.value;

    this.setState(state => ({
      ...state,
      value,
    }));
  }


  updateFeature = (feature, field) => value => {
    if (!value) { return; }

    const newProperties = feature.properties.map(property => {
      if (property.name !== field.name) { return property; }
      return {
        ...property,
        name: value,
      };
    });

    const newFeature = {
      ...feature,
      properties: newProperties,
    };


    const isLayerDefinedField = feature.layer.fields.find(_field => _field.name === value);
    if (isLayerDefinedField) {
      // 如果此字段的key值已经存在于layer内预定义的字段，那么就移除feature上定义的字段
      const newFeatureFields = feature.fields.filter(_field => _field.name !== field.name);

      Object.assign(newFeature, {
        fields: newFeatureFields,
      });
    } else {
      // 如果此字段的key值在layer内预定义的字段中不存在，那么就更新feature上定义的字段
      const newFeatureFields = feature.fields.map(_field => {
        if (_field.name !== field.name) { return _field; }
        return {
          ..._field,
          id: uuid(),
          __version: (_field.__version || 1) + 1,
          name: value,
        };
      });

      Object.assign(newFeature, {
        fields: newFeatureFields,
      });
    }


    this.context.updateFeature(newFeature);
  }


  render() {
    const { selectedFeature, field } = this.context;
    const { value } = this.state;


    return (
      <Input
        value={value}
        onChange={this.handlePropertyKeyChange(selectedFeature, field)}
        onBlur={() => this.updateFeature(selectedFeature, field)(value)}
        placeholder="key"
        style={{ fontWeight: 'bold' }}
      />
    );
  }
}
