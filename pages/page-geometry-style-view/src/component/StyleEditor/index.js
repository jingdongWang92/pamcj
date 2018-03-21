import React from 'react';
import PointStyleEditor from './PointStyleEditor';
import CurveStyleEditor from './CurveStyleEditor';
import SurfaceStyleEditor from './SurfaceStyleEditor';


export default class StyleEditor extends React.Component {

  static propTypes = {

  }

  render() {
    const { geometry_type, style } = this.props;

    const components = [
      <input
        key="geometry_type"
        type="hidden"
        {...geometry_type.input}
      />,
    ];

    if (geometry_type.input.value === 'Point') {
      components.push(
        <PointStyleEditor key="editor" {...style.input} />
      );
    } else if (geometry_type.input.value === 'Curve') {
      components.push(
        <CurveStyleEditor key="editor" {...style.input} />
      );
    } else if (geometry_type.input.value === 'Surface') {
      components.push(
        <SurfaceStyleEditor key="editor" {...style.input} />
      );
    }

    return components;
  }
}
