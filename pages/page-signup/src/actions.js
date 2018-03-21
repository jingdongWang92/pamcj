import { createAction } from 'redux-actions';
import * as constants from './constants';


export const registeUser = createAction(constants.USER_REGISTE);
export const registeUserSuccess = createAction(constants.USER_REGISTE_SUCCESS);
export const registeUserFailed = createAction(constants.USER_REGISTE_FAILED);
