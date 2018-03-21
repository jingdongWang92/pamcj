import React, { Component } from 'react';
import PointSample from './PointSample';
import CurveSample from './CurveSample';
import SurfaceSample from './SurfaceSample';


export default class GeometryStyleSample extends Component {


  render() {
    const { geometryStyle } = this.props;

    if (!geometryStyle) { return null; }

    const { geometry_type } = geometryStyle;

    if (geometry_type === 'Point') {
      return (<PointSample geometryStyle={geometryStyle} />);
    } else if (geometry_type === 'Curve') {
      return (<CurveSample geometryStyle={geometryStyle} />);
    } else if (geometry_type === 'Surface') {
      return (<SurfaceSample geometryStyle={geometryStyle} />);
    }
  }
}
