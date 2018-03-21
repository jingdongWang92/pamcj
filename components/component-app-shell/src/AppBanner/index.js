import React from 'react';
import PropTypes from 'prop-types';
import Avatar from './Avatar';
import Logo from './Logo';
import styled from 'styled-components';


export default class AppBanner extends React.Component {

  static contextTypes = {
    bannerHeight: PropTypes.number.isRequired,
  }

  render() {
    const { bannerHeight } = this.context;

    return (
      <BannerContainer bannerHeight={bannerHeight}>
        <BannerItem>
          <Logo />
        </BannerItem>

        <BannerItem style={{ float: 'right' }}>
          <Avatar />
        </BannerItem>
      </BannerContainer>
    );
  }
}


const BannerContainer = styled.div`
  background: #fff;
  display: block;
  padding: 0;
  border-bottom: 1px solid #e4e5e7;
  height: ${props => props.bannerHeight}px;
  line-height: ${props => props.bannerHeight}px;
`;

const BannerItem = styled.div`
  display: inline-block;
  width: 200px;
  text-align: center;
`;
