import { denormalize } from 'normalizr';
import * as schemas from './schemas';
import { createSelector, createStructuredSelector } from 'reselect';


export const getCartogramCollection = state => denormalize(state.cartogramCollection, schemas.cartogramCollection, state.entities);


export const getCartogramsOfCartogramCollection = createSelector(
  getCartogramCollection,
  cartogramCollection => cartogramCollection ? cartogramCollection.cartograms : [],
);


export const getCartogramRoutes = state => denormalize(state.cartogramRoutes, schemas.cartogramRoutes, state.entities);


export const getCreatingCartogramRoute = state => state.creatingCartogramRoute;


export const getFeatures = state => denormalize(state.features, schemas.features, state.entities);


export const getMode = state => state.mode;


export const getTablePagination = state => state.tablePagination;


export const getTableLoading = state => state.tableLoading;


export const getPositions = createSelector(
  getCartogramsOfCartogramCollection,
  getFeatures,
  (cartograms, features) => {
    return cartograms.map(cartogram => {
      const { id, name } = cartogram;
      const featuresInCartogram = features.filter(feature => feature.cartogram_id === id);

      const children = featuresInCartogram.map(feature => ({
        label: feature.formattedProperties.title || `[ID: ${feature.id}]`,
        value: feature.id,
      }));

      return {
        label: name,
        value: id,
        disabled: !children.length,
        children,
      };
    });
  },
);


export const isCreating = state => state.isCreating;


export const isUpdating = state => state.isUpdating;


export const getEdittingCartogramRoute = state => {
  const cartogramRoute = denormalize(state.edittingCartogramRoute, schemas.cartogramRoute, state.entities);

  if (!cartogramRoute) { return null; }

  return {
    ...cartogramRoute,
    from_position: [cartogramRoute.from_feature.cartogram_id, cartogramRoute.from_feature_id],
    to_position: [cartogramRoute.to_feature.cartogram_id, cartogramRoute.to_feature_id],
  };
};


export const getProps = createStructuredSelector({
  mode: getMode,

  cartogramCollection: getCartogramCollection,
  cartograms: getCartogramsOfCartogramCollection,
  cartogramRoutes: getCartogramRoutes,
  positions: getPositions,

  edittingCartogramRoute: getEdittingCartogramRoute,

  tablePagination: getTablePagination,
  tableLoading: getTableLoading,

  isCreating,
  isUpdating,
});
