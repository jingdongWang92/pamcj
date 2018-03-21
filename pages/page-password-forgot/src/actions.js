import { createAction } from 'redux-actions';
import * as constants from './constants';


export const resetPassword = createAction(constants.PASSWORD_RESET);
export const resetPasswordSuccess = createAction(constants.PASSWORD_RESET_SUCCESS);
export const resetPasswordFailed = createAction(constants.PASSWORD_RESET_FAILED);
