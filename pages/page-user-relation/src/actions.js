import { createAction } from 'redux-actions';
import * as constants from './constants';


export const bindAccount = createAction(constants.ACCOUNT_BIND);
export const bindAccountSuccess = createAction(constants.ACCOUNT_BIND_SUCCESS);
export const bindAccountFailed = createAction(constants.ACCOUNT_BIND_FAILED);

export const submitting = createAction(constants.SUBMITTING);
