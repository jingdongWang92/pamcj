import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const searchUsers = createAction(constants.USERS_SEARCH);
export const searchUsersSuccess = createAction(constants.USERS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.users),
  res => res.meta,
);
export const searchUsersFailed = createAction(constants.USERS_SEARCH_FAILED);

export const searchPlans = createAction(constants.PLANS_SEARCH);
export const searchPlansSuccess = createAction(constants.PLANS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.plans),
);
export const searchPlansFailed = createAction(constants.PLANS_SEARCH_FAILED);


export const updateUser = createAction(constants.USER_UPDATE);
export const updateUserSuccess = createAction(constants.USER_UPDATE_SUCCESS,
  res => normalize(res.payload, schemas.user),
);
export const updateUserFailed = createAction(constants.USER_UPDATE_FAILED);


export const editUser = createAction(constants.USER_EDIT,
  user => normalize(user, schemas.user),
);


export const changeQueryCondition = createAction(constants.QUERY_CONDITION_CHANGE);
export const changeQueryConditionSuccess = createAction(constants.QUERY_CONDITION_CHANGE_SUCCESS);
export const changeQueryConditionFailed = createAction(constants.QUERY_CONDITION_CHANGE_FAILED);


export const sendRegisterEmail = createAction(constants.REGISTER_EMAIL_SEND);
export const sendRegisterEmailSuccess = createAction(constants.REGISTER_EMAIL_SEND_SUCCESS);
export const sendRegisterEmailFailed = createAction(constants.REGISTER_EMAIL_SEND_FAILED);


export const fetchUserSelf = createAction(constants.USER_SELF_FETCH);
export const fetchUserSelfSuccess = createAction(constants.USER_SELF_FETCH_SUCCESS,
  user => normalize(user, schemas.user),
);
export const fetchUserSelfFailed = createAction(constants.USER_SELF_FETCH_FAILED);


export const impersonateUser = createAction(constants.USER_IMPERSONATE);
export const impersonateUserSuccess = createAction(constants.USER_IMPERSONATE_SUCCESS);
export const impersonateUserFailed = createAction(constants.USER_IMPERSONATE_FAILED);
