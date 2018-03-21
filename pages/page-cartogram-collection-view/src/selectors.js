import * as constants from './constants';
import get from 'lodash/get';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';
import { createSelector } from 'reselect';


export const getCartogramCollection = state => denormalize(state.cartogramCollection, schemas.cartogramCollection, state.entities);


export const getSelectedCartogramIds = state => get(state.form[constants.MODULE_NAME], 'values.cartogram_ids', []);


export const getCartograms = state => denormalize(state.cartograms, schemas.cartograms, state.entities);


export const getMarkedCartograms = createSelector(
  getCartograms,
  getSelectedCartogramIds,
  (cartograms, selectedCartogramIds) => cartograms.map(markCartogram(selectedCartogramIds)),
);



function markCartogram(selectedCartogramIds) {
  return cartogram => {
    if (selectedCartogramIds.includes(cartogram.id)) {
      cartogram.__disabled = true;
    }
    return cartogram;
  }
}
