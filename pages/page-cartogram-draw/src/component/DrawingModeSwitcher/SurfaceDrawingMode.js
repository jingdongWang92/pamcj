import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/es/button';
import {
  MODE_DRAW_SURFACE_FREEHAND,
  MODE_DRAW_SURFACE_RECTANGLE,
} from '../../constants';


export default class SurfaceDrawingMode extends React.Component {
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
          type={mapState.startsWith(MODE_DRAW_SURFACE_FREEHAND) ? 'primary' : null}
          onClick={() => switchMapState(MODE_DRAW_SURFACE_FREEHAND)}
        >自由模式</Button>

        <Button
          type={mapState.startsWith(MODE_DRAW_SURFACE_RECTANGLE) ? 'primary' : null}
          onClick={() => switchMapState(MODE_DRAW_SURFACE_RECTANGLE)}
        >矩形模式</Button>
      </Button.Group>
    );
  }
}
