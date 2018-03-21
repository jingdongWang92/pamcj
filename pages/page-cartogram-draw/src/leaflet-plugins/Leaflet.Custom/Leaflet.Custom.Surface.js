import L from 'leaflet';
import './Leaflet.Layer.Custom';


L.Custom.Surface = L.Polygon.extend({
  options: {
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlurRadiusX: 0,
    shadowBlurRadiusY: 0,
  },
});


L.custom.surface = function (latlngs, options) {
  return new L.Custom.Surface(latlngs, options);
}
