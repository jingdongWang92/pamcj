import { createAction } from 'redux-actions';
import * as constants from './constants';


export const verifyUserEmail = createAction(constants.USER_EMAIL_VERIFY);
export const verifyUserEmailSuccess = createAction(constants.USER_EMAIL_VERIFY_SUCCESS);
export const verifyUserEmailFailed = createAction(constants.USER_EMAIL_VERIFY_FAILED);
