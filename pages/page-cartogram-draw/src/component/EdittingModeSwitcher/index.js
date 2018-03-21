import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/es/button';
import {
  MODE_EDIT_ADJUST,
  MODE_EDIT_MOVE,
  MODE_EDIT_ROTATE,
  MODE_EDIT_COPY,
} from '../../constants';


export default class EdittingModeSwitcher extends React.Component {

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
          type={mapState.startsWith(MODE_EDIT_ADJUST) ? 'primary' : null}
          onClick={() => switchMapState(MODE_EDIT_ADJUST)}
        >调整模式</Button>

        <Button
          type={mapState.startsWith(MODE_EDIT_MOVE) ? 'primary' : null}
          onClick={() => switchMapState(MODE_EDIT_MOVE)}
        >移动模式</Button>

        <Button
          type={mapState.startsWith(MODE_EDIT_ROTATE) ? 'primary' : null}
          onClick={() => switchMapState(MODE_EDIT_ROTATE)}
        >旋转模式</Button>

        <Button
          type={mapState.startsWith(MODE_EDIT_COPY) ? 'primary' : null}
          onClick={() => switchMapState(MODE_EDIT_COPY)}
        >复制模式</Button>
      </Button.Group>
    );
  }
}
