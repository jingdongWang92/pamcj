import React from 'react';
import URI from '@jcnetwork/util-uri';

class TokenStorge extends React.Component {

  componentWillMount() {
    const accessToken = (new URI()).hash(true).access_token;
    console.log('tokenStorge:'+accessToken);
    this.props.tokenStorge(accessToken);
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default TokenStorge;
