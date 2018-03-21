import React from 'react';
import FillStateEditor from './FillStateEditor';
import FillColorEditor from './FillColorEditor';


export default class FillPropertiesEditor extends React.Component {

  handleFillChange = (fill, propertyName) => value => {
    const newFill = {
      ...fill,
      [propertyName]: value,
    };
    this.props.onChange(newFill);
  }

  render() {
    const { value: fill } = this.props;

    return [
      <FillStateEditor
        key="fill_enabled"
        value={fill.enabled}
        onChange={this.handleFillChange(fill, 'enabled')}
      />,
      <FillColorEditor
        key="fill_color"
        value={fill.color}
        enabled={fill.enabled}
        onChange={this.handleFillChange(fill, 'color')}
      />,
    ];
  }
}
