import React from 'react';
import Button from 'antd/es/button';
import ImageUpload from '@jcmap/component-image-upload';
import merge from 'lodash/fp/merge';
import Form from 'antd/es/form';
import { TYPE_EXTERNAL_GRAPHIC } from '@jcmap/constant-style-types';


export default class ExternalGraphicEditor extends React.Component {

  static propTypes = {

  }

  handlePropertyChange = propertyName => property => {
    this.props.onChange(merge(this.props.value, {
      type: TYPE_EXTERNAL_GRAPHIC,
      enabled: true,
      [propertyName]: property,
    }));
  }

  render() {
    const { value } = this.props;
    if (!value) { return null; }

    const { link } = value;

    return (
      <Form.Item label="图标">
        <ImageUpload value={link} onChange={this.handlePropertyChange('link')}>
          <Button>Click to Upload</Button>
        </ImageUpload>
      </Form.Item>
    );
  }
}
