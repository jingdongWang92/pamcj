import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const fetchProfile = createAction(constants.PROFILE_FETCH);
export const fetchProfileSuccess = createAction(constants.PROFILE_FETCH_SUCCESS,
  res => normalize(Object.assign(res.payload, res.meta), schemas.user),
);
export const fetchProfileFailed = createAction(constants.PROFILE_FETCH_FAILED);

export const searchOrders = createAction(constants.ORDERS_SEARCH);
export const searchOrdersSuccess = createAction(constants.ORDERS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.orders),
);
export const searchOrdersFailed = createAction(constants.ORDERS_SEARCH_FAILED);

export const searchInvoices = createAction(constants.INVOICES_SEARCH);
export const searchInvoicesSuccess = createAction(constants.INVOICES_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.invoices),
);
export const searchInvoicesFailed = createAction(constants.INVOICES_SEARCH_FAILED);

export const createInvoice = createAction(constants.INVOICE_CREATE);
export const createInvoiceSuccess = createAction(constants.INVOICE_CREATE_SUCCESS);
export const createInvoiceFailed = createAction(constants.INVOICE_CREATE_FAILED);

export const selectOrders = createAction(constants.ORDERS_SELECT);

export const computeTotalAmount = createAction(constants.TOTAL_AMOUNT_COMPUTE);

export const openModal = createAction(constants.MODAL_OPEN);
export const closeModal = createAction(constants.MODAL_CLOSE);

export const resetPassword = createAction(constants.PASSWORD_RESET);
export const resetPasswordSuccess = createAction(constants.PASSWORD_RESET_SUCCESS);
export const resetPasswordFailed = createAction(constants.PASSWORD_RESET_FAILED);

export const updateProfile = createAction(constants.PROFILE_UPDATE);
export const updateProfileSuccess = createAction(constants.PROFILE_UPDATE_SUCCESS);
export const updateProfileFailed = createAction(constants.PROFILE_UPDATE_FAILED);
