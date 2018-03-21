import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/es/button';


export default class PersistFeatureButtonGroup extends React.Component {
  static contextTypes = {
    persistFeature: PropTypes.func.isRequired,
  }


  render() {
    const {
      persistFeature,
    } = this.context;


    return (
      <Button.Group>
        <Button
          onClick={() => persistFeature()}
        >上传</Button>
      </Button.Group>
    );
  }
}
