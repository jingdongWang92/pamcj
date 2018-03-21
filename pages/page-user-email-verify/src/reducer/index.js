import { combineReducers } from 'redux';
import verified from './verified';
import verifyStatus from './verify_status';


export default combineReducers({
  verified,
  verifyStatus,
});
