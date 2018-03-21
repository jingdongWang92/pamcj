import React from 'react';
import PropTypes from 'prop-types';
import logo from '../imgs/logo.png';
import styled from 'styled-components';


export default class Logo extends React.Component {

  static contextTypes = {
    bannerHeight: PropTypes.number.isRequired,
  }

  render() {
    const { bannerHeight } = this.context;

    return (
      <LogoContainer bannerHeight={bannerHeight}>
        <LogoImage srcSet={logo} alt="JCMAP" />
      </LogoContainer>
    );
  }
}


const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${props => props.bannerHeight}px;
`;

const LogoImage = styled.img`
  height: 80%;
  width: auto;
`;
