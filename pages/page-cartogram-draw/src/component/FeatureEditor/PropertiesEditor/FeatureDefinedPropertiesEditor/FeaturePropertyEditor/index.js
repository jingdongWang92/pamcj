import React from 'react';
import PropTypes from 'prop-types';
import KeyEditor from './KeyEditor';
import ValueEditor from './ValueEditor';
import Button from 'antd/es/button';
import Icon from 'antd/es/icon';
import Input from 'antd/es/input';
import Col from 'antd/es/col';


export default class FeaturePropertyEditor extends React.Component {
  static contextTypes = {
    selectedFeature: PropTypes.object,
    updateFeature: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    field: PropTypes.object.isRequired,
  }


  getChildContext() {
    return {
      field: this.props.field,
    };
  }


  handlePropertyRemove = (feature, field) => {
    const newProperties = feature.properties.filter(_property => _property.name !== field.name);
    const newFields = feature.fields.filter(_field => _field.name !== field.name);
    const newFeature = {
      ...feature,
      fields: newFields,
      properties: newProperties,
    };
    this.context.updateFeature(newFeature);
  }

  render() {
    const { selectedFeature } = this.context;
    const { field } = this.props;

    return (
      <Input.Group>
        <Col span={18}>
          <KeyEditor />
        </Col>

        <Col span={6} style={{ textAlign: 'right' }}>
          <Button type="danger" onClick={() => this.handlePropertyRemove(selectedFeature, field)}>
            <Icon type="delete" />
          </Button>
        </Col>

        <Col>
          <ValueEditor />
        </Col>
      </Input.Group>
    );
  }
}
