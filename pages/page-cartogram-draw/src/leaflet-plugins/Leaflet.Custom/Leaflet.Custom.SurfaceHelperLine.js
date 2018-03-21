import L from 'leaflet';
import './Leaflet.Layer.Custom';


L.Custom.SurfaceHelperLine = L.Polygon.extend({
  options: {
    color: 'red',
  },
});


L.custom.surfaceHelperLine = function (latlngs, options) {
  return new L.Custom.SurfaceHelperLine(latlngs, options);
}
