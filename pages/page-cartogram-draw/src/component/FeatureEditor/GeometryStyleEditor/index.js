import React from 'react';
import PropTypes from 'prop-types';
import StrokePropertiesEditor from './StrokePropertiesEditor';
import FillPropertiesEditor from './FillPropertiesEditor';
import uuid from 'uuid';


export default class GeometryStyleEditor extends React.Component {
  static contextTypes = {
    selectedFeature: PropTypes.object,
    updateFeature: PropTypes.func.isRequired,
  }

  handleStyleChange = (feature, styleName) => styleValue => {

    const newGeometryStyle = {
      ...feature.geometry_style,
      id: uuid(),
      style: {
        ...feature.geometry_style.style,
        [styleName]: styleValue,
      },
    };

    let newFields = [...feature.fields];
    let newProperties = [...feature.properties];

    if (styleName === 'stroke') {
      const styleStrokeFieldIndex = newFields.findIndex(field => field.name === 'style:stroke');
      if (styleStrokeFieldIndex < 0) {
        newFields.push({
          id: uuid(),
          name: 'style:stroke',
        });
      }

      const styleStrokePropertyIndex = newProperties.findIndex(property => property.name === 'style:stroke');
      const strokeProperty = {
        id: uuid(),
        name: 'style:stroke',
        value: styleValue.enabled,
      };
      if (styleStrokePropertyIndex < 0) {
        newProperties.push(strokeProperty);
      } else {
        newProperties[styleStrokePropertyIndex].value = strokeProperty.value;
      }


      const styleStrokeWidthFieldIndex = newFields.findIndex(field => field.name === 'style:stroke:width');
      if (styleStrokeWidthFieldIndex < 0) {
        newFields.push({
          id: uuid(),
          name: 'style:stroke:width',
        });
      }

      const styleStrokeWidthPropertyIndex = newProperties.findIndex(property => property.name === 'style:stroke:width');
      const strokeWidthProperty = {
        id: uuid(),
        name: 'style:stroke:width',
        value: styleValue.width,
      };
      if (styleStrokeWidthPropertyIndex < 0) {
        newProperties.push(strokeWidthProperty);
      } else {
        newProperties[styleStrokeWidthPropertyIndex].value = strokeWidthProperty.value;
      }


      const styleStrokeColorFieldIndex = newFields.findIndex(field => field.name === 'style:stroke:color');
      if (styleStrokeColorFieldIndex < 0) {
        newFields.push({
          id: uuid(),
          name: 'style:stroke:color',
        });
      }

      const styleStrokeColorPropertyIndex = newProperties.findIndex(property => property.name === 'style:stroke:color');
      const strokeColorProperty = {
        id: uuid(),
        name: 'style:stroke:color',
        value: styleValue.color,
      };
      if (styleStrokeColorPropertyIndex < 0) {
        newProperties.push(strokeColorProperty);
      } else {
        newProperties[styleStrokeColorPropertyIndex].value = strokeColorProperty.value;
      }
    } else if (styleName === 'fill') {

      const styleFillFieldIndex = newFields.findIndex(field => field.name === 'style:fill');
      if (styleFillFieldIndex < 0) {
        newFields.push({
          id: uuid(),
          name: 'style:fill',
        });
      }

      const styleFillPropertyIndex = newProperties.findIndex(property => property.name === 'style:fill');
      const fillProperty = {
        id: uuid(),
        name: 'style:fill',
        value: styleValue.enabled,
      };
      if (styleFillPropertyIndex < 0) {
        newProperties.push(fillProperty);
      } else {
        newProperties[styleFillPropertyIndex].value = fillProperty.value;
      }


      const styleFillColorFieldIndex = newFields.findIndex(field => field.name === 'style:fill:color');
      if (styleFillColorFieldIndex < 0) {
        newFields.push({
          id: uuid(),
          name: 'style:fill:color',
        });
      }

      const styleFillColorPropertyIndex = newProperties.findIndex(property => property.name === 'style:fill:color');
      const fillColorProperty = {
        id: uuid(),
        name: 'style:fill:color',
        value: styleValue.color,
      };
      console.log(styleFillColorPropertyIndex);
      if (styleFillColorPropertyIndex < 0) {
        newProperties.push(fillColorProperty);
      } else {
        newProperties[styleFillColorPropertyIndex].value = fillColorProperty.value;
      }
    }

    const newFeature = {
      ...feature,
      geometry_style_id: newGeometryStyle.id,
      geometry_style: newGeometryStyle,
      fields: newFields,
      properties: newProperties,
    };
    console.log(newFeature);

    this.context.updateFeature(newFeature);
  }

  render() {
    const { selectedFeature } = this.context;
    const { geometry_style } = selectedFeature;
    const { geometry_type, style } = geometry_style;

    const components = [];
    if (geometry_type === 'Point') {
      // TODO:
    } else if (geometry_type === 'Curve') {
      components.push(
        <StrokePropertiesEditor
          key="stroke_properties_editor"
          value={style.stroke}
          onChange={this.handleStyleChange(selectedFeature, 'stroke')}
        />,
      );
    } else if (geometry_type === 'Surface') {
      components.push(
        <FillPropertiesEditor
          key="fill_properties_editor"
          value={style.fill}
          onChange={this.handleStyleChange(selectedFeature, 'fill')}
        />,

        <StrokePropertiesEditor
          key="stroke_properties_editor"
          value={style.stroke}
          onChange={this.handleStyleChange(selectedFeature, 'stroke')}
        />,
      );
    }

    return components;
  }
}
