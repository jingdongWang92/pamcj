import { createStructuredSelector } from 'reselect';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';


export const getUsers = state => denormalize(state.users, schemas.users, state.entities);


export const getPlans = state => denormalize(state.plans, schemas.plans, state.entities);


export const getEdittingUser = state => denormalize(state.edittingUser, schemas.user, state.entities);


export const getQueryConditions = state => state.queryConditions;


export const getRegisterEmailSendingStatus = state => state.registerEmailSendingStatus;


export const getMyself = state => denormalize(state.myself, schemas.user, state.entities);


export const getProps = createStructuredSelector({
  user: getEdittingUser,
  edittingUser: getEdittingUser,
  users: getUsers,
  plans: getPlans,
  queryConditions: getQueryConditions,
  registerEmailSendingStatus: getRegisterEmailSendingStatus,
  myself: getMyself,
});
