import { denormalize } from 'normalizr';
import * as schemas from './schemas';
import { createStructuredSelector } from 'reselect';


export const getCartogram = state => denormalize(state.cartogram, schemas.cartogram, state.entities)


export const getGeoreference = state => denormalize(state.cartogramGeoreference, schemas.cartogramGeoreference, state.entities)


export const getLayers = state => denormalize(state.layers, schemas.layers, state.entities);


export const getSelectedFeature = state => denormalize(state.selectedFeature, schemas.feature, state.entities);


export const isDataLoaded = state => state.dataLoaded;


export const getEntities = state => state.entities;


export const getCreatedFeatures = state => denormalize(state.createdFeatures, schemas.features, state.entities);


export const getUpdatedFeatures = state => denormalize(state.updatedFeatures, schemas.features, state.entities);


export const getRemovedFeatures = state => denormalize(state.removedFeatures, schemas.features, state.entities);


export const getFeatures = state => denormalize(state.features, schemas.features, state.entities);


export const getDrawingLayer = state => denormalize(state.drawingLayer, schemas.layer, state.entities);


export const getMapState = state => state.mapState;


export const getDrawingMode = state => state.drawingMode;


export const getLayerVisiabilities = state => state.layerVisiabilities;


export const getProps = createStructuredSelector({
  mapState: getMapState,
  drawingMode: getDrawingMode,
  drawingLayer: getDrawingLayer,
  layers: getLayers,
  layerVisiabilities: getLayerVisiabilities,
  cartogram: getCartogram,
  cartogramGeoreference: getGeoreference,
  features: getFeatures,
  selectedFeature: getSelectedFeature,
  dataLoaded: isDataLoaded,
  entities: getEntities,
  createdFeatures: getCreatedFeatures,
  updatedFeatures: getUpdatedFeatures,
  removedFeatures: getRemovedFeatures,
});
