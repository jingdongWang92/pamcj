import L from 'leaflet';


L.Custom = L.Layer.extend({ });


L.custom = function (options) {
  return new L.Custom(options);
}
