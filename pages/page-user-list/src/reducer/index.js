import { combineReducers } from 'redux';
import entities from './entities';
import users from './users';
import plans from './plans';
import edittingUser from './editting_user';
import { reducer as form } from 'redux-form';
import queryConditions from './query_conditions';
import registerEmailSendingStatus from './register_email_sending_status';
import myself from './myself';


export default combineReducers({
  entities,
  users,
  edittingUser,
  plans,
  form,
  queryConditions,
  registerEmailSendingStatus,
  myself,
});
