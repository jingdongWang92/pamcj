import React from 'react';


export default class PointSample extends React.Component {

  render() {
    const { geometryStyle } = this.props;
    const styleValue = geometryStyle.style.graphic.value

    if(!styleValue) return 'coming soon';

    const { type, shape, link } = styleValue;

    if(type === 'mark') {
      if(shape === 'square') {
        return (
          <svg width="30" style={{marginLeft: '5'}} height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
            <rect
              width="20" height="20"
              style={{
                fill: styleValue.fill.color,
                strokeWidth: styleValue.stroke.width,
              }}
            />
          </svg>
        );
      } else if(shape === 'circle') {
        return (
          <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
            <circle
              r="10"
              cx="15"
              cy="15"
              style={{
                fill: styleValue.fill.color,
                stroke: styleValue.stroke.color,
                strokeWidth: styleValue.stroke.width,
              }}/>
          </svg>
        );
      } else {
        return 'comming soon'
      }
    } else {
      if(!link) return 'comming soon';
      return(
        <img
          alt="point-style"
          width="30"
          height="30"
          src={link}
        />
      );
    }
  }
}
