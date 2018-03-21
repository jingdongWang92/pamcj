import { createAction } from 'redux-actions';
import * as constants from './constants';
import { normalize } from 'normalizr';
import * as schemas from './schemas';
import uuid from 'uuid';
import merge from 'lodash/merge';


export const fetchLayer = createAction(constants.LAYER_FETCH);
export const fetchLayerSuccess = createAction(constants.LAYER_FETCH_SUCCESS,
  res => {
    const layer = merge({}, res.payload, {
      fields: res.payload.fields.map(field => {
        const _field = {
          id: uuid(),
          ...field,
        };
        if (field.options) {
          _field.options = field.options.map(option => ({
            id: uuid(),
            ...option,
          }));
        }

        return _field;
      }),
    });
    return normalize(layer, schemas.layer);
  }
);
export const fetchLayerFailed = createAction(constants.LAYER_FETCH_FAILED);


export const updateLayer = createAction(constants.LAYER_UPDATE);
export const updateLayerSuccess = createAction(constants.LAYER_UPDATE_SUCCESS);
export const updateLayerFailed = createAction(constants.LAYER_UPDATE_FAILED);
