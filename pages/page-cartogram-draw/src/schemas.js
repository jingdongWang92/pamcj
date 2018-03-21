import { schema } from 'normalizr';


export const organization = new schema.Entity('organizations');
export const organizations = [organization];


export const geometryStyle = new schema.Entity('geometryStyles');
export const geometryStyles = [geometryStyle];


export const layerFieldOption = new schema.Entity('layerFieldOptions');
export const layerFieldOptions = [layerFieldOption];


export const layerField = new schema.Entity('layerFields', {
  options: layerFieldOptions,
});
export const layerFields = [layerField];


export const layer = new schema.Entity('layers', {
  geometry_style: geometryStyle,
  fields: layerFields,
});
export const layers = [layer];


export const cartogram = new schema.Entity('cartograms');
export const cartograms = [cartogram];


export const featureField = new schema.Entity('featureFields');
export const featureFields = [featureField];


export const featureProperty = new schema.Entity('featureProperties');
export const featureProperties = [featureProperty];


export const feature = new schema.Entity('features', {
  owner: organization,
  cartogram,
  layer,
  geometry_style: geometryStyle,
  fields: featureFields,
  properties: featureProperties,
}, {
  idAttribute: value => value.uuid,
});
export const features = [feature];


export const cartogramGeoreference = new schema.Entity('cartogramGeoreferences', {
  cartogram,
});
export const cartogramGeoreferences = [cartogramGeoreference];
