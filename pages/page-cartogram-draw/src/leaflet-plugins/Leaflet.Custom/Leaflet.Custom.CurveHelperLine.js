import L from 'leaflet';
import './Leaflet.Layer.Custom';


L.Custom.CurveHelperLine = L.Polyline.extend({
  options: {
    color: 'red',
  },
});


L.custom.curveHelperLine = function (latlngs, options) {
  return new L.Custom.CurveHelperLine(latlngs, options);
}
