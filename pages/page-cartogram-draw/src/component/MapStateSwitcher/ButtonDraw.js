import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'antd/es/menu';
import DropDown from 'antd/es/dropdown';
import Button from 'antd/es/button';
import Icon from 'antd/es/icon';
import {
  MODE_DRAW,
  MODE_DRAW_POINT,
  MODE_DRAW_CURVE,
  MODE_DRAW_SURFACE_FREEHAND,
} from '../../constants';


export default class ButtonDraw extends React.Component {

  static contextTypes = {
    mapState: PropTypes.string.isRequired,
    layers: PropTypes.array.isRequired,
    drawingLayer: PropTypes.object,
    switchMapState: PropTypes.func.isRequired,
  }


  switchDrawingLayer = layers => evt => {
    const { key } = evt;
    const drawingLayer = layers.find(_layer => _layer.id === key);

    if (!drawingLayer) {
      this.context.switchMapState(MODE_DRAW);
    } else {
      const { geometry_type } = drawingLayer;

      if (geometry_type === 'Point') {
        this.context.switchMapState(MODE_DRAW_POINT, { drawingLayer });
      } else if (geometry_type === 'Curve') {
        this.context.switchMapState(MODE_DRAW_CURVE, { drawingLayer });
      } else if (geometry_type === 'Surface') {
        this.context.switchMapState(MODE_DRAW_SURFACE_FREEHAND, { drawingLayer });
      }
    }
  }


  render() {
    const {
      mapState,
      layers,
      drawingLayer,
    } = this.context;


    const menu = (
      <Menu onClick={this.switchDrawingLayer(layers)}>
        <Menu.Item>
          <Row>
            <Cell>图层类别</Cell>
            <Cell>显示顺序</Cell>
            <Cell>几何类型</Cell>
            <Cell>图层名称</Cell>
          </Row>
        </Menu.Item>

        {layers.map(layer => (
          <Menu.Item key={layer.id}>
            <Row style={{ backgroundColor: drawingLayer && drawingLayer.id === layer.id ? 'rgb(109, 118, 214)' : 'white' }}>
              <Cell>{layer.is_created_by_system ? 'system' : 'custom'}</Cell>
              <Cell>{layer.sequence}</Cell>
              <Cell>{layer.geometry_type}</Cell>
              <Cell>{layer.name}</Cell>
            </Row>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <DropDown overlay={menu}>
        <Button type={mapState.startsWith(MODE_DRAW) ? 'primary' : null}>
          {mapState.startsWith(MODE_DRAW) && drawingLayer ? `${drawingLayer.sequence} - ${drawingLayer.geometry_type} - ${drawingLayer.name}` : '绘制'} <Icon type="down" />
        </Button>
      </DropDown>
    );
  }
}


function Row({ style, children }) {
  return (
    <div style={{ ...style, display: 'flex', }}>
      {children}
    </div>
  );
}


function Cell({ children }) {
  return (
    <div style={{ flex: 1, padding: '0 0.5em' }}>{children}</div>
  );
}
