import React from 'react';
import PropTypes from 'prop-types';
import {
  MODE_DRAW_SURFACE,
} from '../../constants';
import SurfaceDrawingMode from './SurfaceDrawingMode';


export default class DrawingModeSwitcher extends React.Component {
  static contextTypes = {
    mapState: PropTypes.string.isRequired,
  }


  render() {
    const {
      mapState,
    } = this.context;

    if (mapState.startsWith(MODE_DRAW_SURFACE)) {
      return (
        <SurfaceDrawingMode />
      );
    }

    return null;
  }
}
