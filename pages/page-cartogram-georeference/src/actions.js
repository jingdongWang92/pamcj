import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const fetchCartogramGeoreference = createAction(constants.CARTOGRAM_GEOREFERENCE_FETCH);
export const fetchCartogramGeoreferenceSuccess = createAction(constants.CARTOGRAM_GEOREFERENCE_FETCH_SUCCESS,
  cartogramGeoreference => normalize(cartogramGeoreference, schemas.cartogramGeoreference),
);
export const fetchCartogramGeoreferenceFailed = createAction(constants.CARTOGRAM_GEOREFERENCE_FETCH_FAILED);


export const adjustCartogramGeoreference = createAction(constants.CARTOGRAM_GEOREFERENCE_ADJUST);
export const adjustCartogramGeoreferenceSuccess = createAction(constants.CARTOGRAM_GEOREFERENCE_ADJUST_SUCCESS,
  cartogramGeoreference => normalize(cartogramGeoreference, schemas.cartogramGeoreference),
);
export const adjustCartogramGeoreferenceFailed = createAction(constants.CARTOGRAM_GEOREFERENCE_ADJUST_FAILED);


export const updateCartogramGeoreference = createAction(constants.CARTOGRAM_GEOREFERENCE_UPDATE);
export const updateCartogramGeoreferenceSuccess = createAction(constants.CARTOGRAM_GEOREFERENCE_UPDATE_SUCCESS);
export const updateCartogramGeoreferenceFailed = createAction(constants.CARTOGRAM_GEOREFERENCE_UPDATE_FAILED);

export const submitting = createAction(constants.SUBMITTING);
