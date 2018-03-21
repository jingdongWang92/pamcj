import { createAction } from 'redux-actions';
import * as constants from './constants';
import { normalize } from 'normalizr';
import * as schemas from './schemas';


export const fetchGeometryStyle = createAction(constants.GEOMETRY_STYLE_FETCH);
export const fetchGeometryStyleSuccess = createAction(constants.GEOMETRY_STYLE_FETCH_SUCCESS,
  res => normalize(res.payload, schemas.geometryStyle),
);
export const fetchGeometryStyleFailed = createAction(constants.GEOMETRY_STYLE_FETCH_FAILED);


export const updateGeometryStyle = createAction(constants.GEOMETRY_STYLE_UPDATE);
export const updateGeometryStyleSuccess = createAction(constants.GEOMETRY_STYLE_UPDATE_SUCCESS);
export const updateGeometryStyleFailed = createAction(constants.GEOMETRY_STYLE_UPDATE_FAILED);
