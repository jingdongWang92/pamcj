import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/es/button';


export default class PropertyCreatingButton extends React.Component {
  static contextTypes = {
    enableCreating: PropTypes.func.isRequired,
  }


  render() {
    const { enableCreating } = this.context;

    return (
      <Button type="primary" size="small" style={{width: '100%'}} onClick={enableCreating}>增加属性</Button>
    );
  }
}
