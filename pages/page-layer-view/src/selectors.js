import { createStructuredSelector } from 'reselect';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';


export const getLayer = state => denormalize(state.layer, schemas.layer, state.entities);


export const getProps = createStructuredSelector({
  initialValues: getLayer,
});
