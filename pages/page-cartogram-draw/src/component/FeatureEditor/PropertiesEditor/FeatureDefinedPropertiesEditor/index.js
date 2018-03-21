import React from 'react';
import PropTypes from 'prop-types';
import FeaturePropertyEditor from './FeaturePropertyEditor';
import FeaturePropertyCreator from './FeaturePropertyCreator';
import Divider from 'antd/es/divider';
import PropertyCreatingButton from './PropertyCreatingButton';


const STYLE_FIELDS_ORDER = [
  'style:stroke',
  'style:stroke:width',
  'style:stroke:color',
  'style:fill',
  'style:fill:color',
];


export default class FeatureDefinedPropertiesEditor extends React.Component {
  static contextTypes = {
    selectedFeature: PropTypes.object,
  }


  static childContextTypes = {
    creating: PropTypes.bool.isRequired,
    enableCreating: PropTypes.func.isRequired,
    disableCreating: PropTypes.func.isRequired,
  }


  getChildContext() {
    return {
      creating: this.state.creating,
      enableCreating: this.enableCreating,
      disableCreating: this.disableCreating,
    };
  }


  state = {
    creating: false,
  }


  enableCreating = () => {
    this.setState(state => ({
      ...state,
      creating: true,
    }));
  }


  disableCreating = () => {
    this.setState(state => ({
      ...state,
      creating: false,
    }));
  }


  render() {
    const { selectedFeature } = this.context;
    const { creating } = this.state;
    const { fields, layer } = selectedFeature;
    const layerFieldNames = layer.fields.map(field => field.name);
    const fieldsNotInLayerFields = fields
      .filter(field => !layerFieldNames.includes(field.name))
      .filter(field => !STYLE_FIELDS_ORDER.includes(field.name)); // 同时过滤掉样式属性

    const components = fieldsNotInLayerFields.reduce((accu, field, index) => {
      accu.push(
        <FeaturePropertyEditor key={field.id} field={field} />
      );

      accu.push(
        <Divider key={`divider-${field.id}`} />
      )

      return accu;
    }, []);

    if (creating) {
      components.push(
        <FeaturePropertyCreator key="feature-property-creator" />,
      );
    } else {
      components.push(
        <PropertyCreatingButton key="property-creating-button" />
      );
    }

    return components;
  }
}
