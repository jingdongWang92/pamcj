import L from 'leaflet';
import './Leaflet.Layer.Custom';


L.Custom.Point = L.Marker.extend({
  getCenter: function () {
    return this.getLatLng();
  },
});


L.custom.point = function (latlng, options) {
  return new L.Custom.Point(latlng, options);
}
