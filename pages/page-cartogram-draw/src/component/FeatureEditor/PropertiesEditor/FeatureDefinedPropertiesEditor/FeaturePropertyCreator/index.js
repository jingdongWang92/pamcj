import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Input from 'antd/es/input';


export default class FeaturePropertyCreator extends React.Component {
  static contextTypes = {
    selectedFeature: PropTypes.object,
    updateFeature: PropTypes.func.isRequired,
    disableCreating: PropTypes.func.isRequired,
  }

  state ={
    name: '',
    value: '',
    isKeyConflict: false,
  }


  handleKeyChange = evt => {
    const name = evt.target.value;

    const { selectedFeature } = this.context;
    const { fields: featureFields, layer } = selectedFeature;
    const { fields: layerFields } = layer;

    const isKeyConflict = [...layerFields, ...featureFields].find(_field => _field.name === name);

    this.setState(state => ({
      ...state,
      name,
      isKeyConflict: !!isKeyConflict,
    }));
  }


  handleValueChange = evt => {
    const value = evt.target.value;

    this.setState(state => ({
      ...state,
      value,
    }));
  }


  handleBlur = () => {
    const { name, value, isKeyConflict } = this.state;

    if (!name || !value || isKeyConflict) { return; }

    const { feature } = this.context;
    const { fields, properties } = feature;


    const newProperties = [
      ...properties,
      {
        id: uuid(),
        __version: 1,
        name,
        value,
      },
    ];


    const newFields = [
      ...fields,
      {
        id: uuid(),
        __version: 1,
        name,
      },
    ];


    const newFeature = {
      ...feature,
      fields: newFields,
      properties: newProperties,
    };

    this.setState(state => ({
      ...state,
      name: '',
      value: '',
      isKeyConflict: false,
    }));

    this.context.disableCreating();
    this.context.updateFeature(newFeature);
  }


  render() {
    const { name, value, isKeyConflict } = this.state;

    return (
      <Input.Group compact>
        <Input
          placeholder="key"
          style={{
            width: '30%',
            borderWidth: '1px',
            borderColor: isKeyConflict ? 'red' : 'grey',
          }}
          value={name}
          onChange={this.handleKeyChange}
          onBlur={this.handleBlur}
        />
        <Input
          style={{ width: '70%' }}
          placeholder="value"
          value={value}
          onChange={this.handleValueChange}
          onBlur={this.handleBlur}
        />
      </Input.Group>
    );
  }
}
