import React from 'react';


export default class CurveSample extends React.Component {

  render() {
    const { geometryStyle } = this.props;
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <polyline
          points="5,25 10,15 17.5,20 25,5"
          style={{
            stroke: geometryStyle.style.stroke.color,
            strokeWidth: geometryStyle.style.stroke.width,
          }}
        />
      </svg>
    );
  }
}
