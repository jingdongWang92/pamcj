import React from 'react';


export default class SurfaceSample extends React.Component {

  render() {
    const { geometryStyle } = this.props;

    return (
      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="15,5 25,10 25,20 15,25 5,20 5,10"
          style={{
            fill: geometryStyle.style.fill.color,
            stroke: geometryStyle.style.stroke.color,
            strokeWidth: geometryStyle.style.stroke.width,
          }}
        />
      </svg>
    );
  }
}
