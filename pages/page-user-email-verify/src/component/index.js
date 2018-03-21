import React from 'react';
import PropTypes from 'prop-types';
import VerifyProcessing from './VerifyProcessing';
import VerifySuccess from './VerifySuccess';
import VerifyFailed from './VerifyFailed';


export default class PageUserEmailVerify extends React.Component {
  static propTypes = {
    verifyUserEmail: PropTypes.func.isRequired,
  }


  componentDidMount() {
    this.props.verifyUserEmail();
  }


  render() {
    const { verified, verifyStatus } = this.props;

    return (
      <div>
        {!verified && (<VerifyProcessing />)}
        {verified && verifyStatus === 'success' && (<VerifySuccess />)}
        {verified && verifyStatus === 'failed' && (<VerifyFailed />)}
      </div>
    );
  }
}
