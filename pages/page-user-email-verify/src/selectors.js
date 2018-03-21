import { createStructuredSelector } from 'reselect';


export const isVerified = state => state.verified;


export const getVerifyStatus = state => state.verifyStatus;


export const getProps = createStructuredSelector({
  verified: isVerified,
  verifyStatus: getVerifyStatus,
});
