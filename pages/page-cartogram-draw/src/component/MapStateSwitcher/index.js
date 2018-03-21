import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/es/button';
import {
  MODE_VIEW,
  MODE_EDIT,
  MODE_EDIT_ADJUST,
} from '../../constants';
import ButtonDraw from './ButtonDraw';


export default class MapStateSwitcher extends React.Component {
  static contextTypes = {
    mapState: PropTypes.string.isRequired,
    switchMapState: PropTypes.func.isRequired,
  }


  render() {
    const {
      mapState,
      switchMapState,
    } = this.context;


    return (
      <Button.Group>
        <Button
          type={mapState === MODE_VIEW ? 'primary' : null}
          onClick={() => switchMapState(MODE_VIEW)}
        >浏览</Button>

        <Button
          type={mapState.startsWith(MODE_EDIT) ? 'primary' : null}
          onClick={() => switchMapState(MODE_EDIT_ADJUST)}
        >编辑</Button>

        <ButtonDraw />
      </Button.Group>
    );
  }
}
