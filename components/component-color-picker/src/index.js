import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import tinycolor from 'tinycolor2';
import styled from 'styled-components';
import nanoid from 'nanoid';


class ColorPicker extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }


  static defaultProps = {
    value: tinycolor.random().toString(),
  }


  constructor(props) {
    super(props);

    let color = tinycolor(props.value);
    if (!color.isValid()) {
      color = tinycolor.random();
    }
    this.state = {
      displayColorPicker: false,
      color,
    };

    const popoverRoot = this.colorPickerPopover = window.document.createElement('div');
    popoverRoot.id = `color-picker-${nanoid}`;
    popoverRoot.style.zIndex = 500;
  }

  componentDidMount() {
    window.document.body.appendChild(this.colorPickerPopover);
  }

  componentWillUnmount() {
    window.document.body.removeChild(this.colorPickerPopover);
  }

  componentWillReceiveProps(nextProps) {
    const nextColor = tinycolor(nextProps.value);
    if (nextProps.value && nextColor.isValid() && !tinycolor.equals(this.state.color, nextColor)) {
      this.setState({ color: nextColor });
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  }

  handleChange = (color) => {
    const _color = tinycolor(color.rgb);
    this.setState({ color: _color });
    this.props.onChange(_color.toString());
  }

  render() {
    const { color, displayColorPicker } = this.state;

    const components = [
      <Swatch innerRef={el => this.swatchEl = el} key="swatch" onClick={this.handleClick}>
        <Color color={color.clone()} />
      </Swatch>,
    ];

    if (displayColorPicker) {
      components.push(createPortal(
        <Popover key="popover">
          <Cover onClick={this.handleClose} />

          <PickerContainer>
            <SketchPicker
              color={color.clone()}
              onChangeComplete={this.handleChange}
            />
          </PickerContainer>
        </Popover>,
        this.colorPickerPopover,
      ));
    }


    return components;
  }
}


export default ColorPicker;


const Color = styled.div`
  width: 80px;
  height: 22px;
  border-radius: 2px;
  background: ${props => props.color.toString()};
  text-align: center;
`;

const Swatch = styled.div`
  padding: 5px;
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  cursor: pointer;
`;

const Popover = styled.div`
  position: absolute;
  z-index: 2;
`;

const Cover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const PickerContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
