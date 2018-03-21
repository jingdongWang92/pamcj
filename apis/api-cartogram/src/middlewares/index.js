'use strict';

const {
  batchCreateDumbBeacons,
  batchRemoveDumbBeacons,
} = require('./dumb-beacon');
const {
  authCreateCartogram,
  createCartogram,
  searchCartograms,
  fetchCartogram,
  fetchCartogramGeoJSON,
  updateCartogram,
  removeCartogram,
  duplicateCartogram,
} = require('./cartogram');


exports.authCreateCartogram = authCreateCartogram;
exports.createCartogram = createCartogram;
exports.searchCartograms = searchCartograms;
exports.fetchCartogram = fetchCartogram;
exports.fetchCartogramGeoJSON = fetchCartogramGeoJSON;
exports.updateCartogram = updateCartogram;
exports.removeCartogram = removeCartogram;
exports.duplicateCartogram = duplicateCartogram;

exports.batchCreateDumbBeacons = batchCreateDumbBeacons;
exports.batchRemoveDumbBeacons = batchRemoveDumbBeacons;
