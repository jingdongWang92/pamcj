import { createStructuredSelector } from 'reselect';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';


export const getLayers = state => denormalize(state.layers, schemas.layers, state.entities).sort((a, b) => b.sequence - a.sequence);


export const getQueryConditions = state => state.queryConditions;

export const getLoading = state => state.loading;

export const getProps = createStructuredSelector({
  layers: getLayers,
  queryConditions: getQueryConditions,
  loading: getLoading,
});
