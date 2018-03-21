import React from 'react';
import StrokeStateEditor from './StrokeStateEditor';
import StrokeWidthEditor from './StrokeWidthEditor';
import StrokeColorEditor from './StrokeColorEditor';

export default class StrokePropertiesEditor extends React.Component {

  handleStrokeChange = (stroke, propertyName) => value => {
    const newStroke = {
      ...stroke,
      [propertyName]: value,
    };
    this.props.onChange(newStroke);
  }

  render() {
    const { value: stroke } = this.props;

    return [
      <StrokeStateEditor
        key="stroke_state_editor"
        value={stroke.enabled}
        onChange={this.handleStrokeChange(stroke, 'enabled')}
      />,
      <StrokeWidthEditor
        key="stroke_width_editor"
        value={stroke.width}
        enabled={stroke.enabled}
        onChange={this.handleStrokeChange(stroke, 'width')}
      />,
      <StrokeColorEditor
        key="stroke_color_editor"
        value={stroke.color}
        enabled={stroke.enabled}
        onChange={this.handleStrokeChange(stroke, 'color')}
      />,
    ];
  }
}
