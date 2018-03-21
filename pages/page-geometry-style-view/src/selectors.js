import { createStructuredSelector } from 'reselect';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';


export const getGeometryStyle = state => denormalize(state.geometryStyle, schemas.geometryStyle, state.entities);


export const getProps = createStructuredSelector({
  initialValues: getGeometryStyle,
});
