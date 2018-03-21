import L from 'leaflet';
import './Leaflet.Layer.Custom';


L.Custom.Curve = L.Polyline.extend({ });


L.custom.curve = function (latlngs, options) {
  return new L.Custom.Curve(latlngs, options);
}
