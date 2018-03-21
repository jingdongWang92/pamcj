import L from 'leaflet';


const CIRCLE_MARKER_DEFAULT_STYLE = {
  stroke: true,
  color: '#3388ff',
  weight: 3,
  opacity: 1.0,
  fill: true,
  fillOpacity: 0.2,
};
const CIRCLE_MARKER_DEFAULT_RADIUS = 10;


L.DivIcon.CircleMarkerIcon = L.DivIcon.extend({
  options: {
    ...CIRCLE_MARKER_DEFAULT_STYLE,
    radius: CIRCLE_MARKER_DEFAULT_RADIUS,
  },

  createIcon: function (oldIcon) {
    const div = L.DivIcon.prototype.createIcon.call(this, oldIcon);

    div.style.borderRadius = '50%';
    L.DivIcon.CircleMarkerIcon.prototype.setRadius.call(null, div, this.options.radius);
    L.DivIcon.CircleMarkerIcon.prototype.setStyle.call(null, div, this.options);

    return div;
  },

  setRadius: function(icon, radius) {
    if (!icon) { return; }

    icon.style.width = icon.style.height = `${radius}px`;
    icon.style.marginLeft = icon.style.marginTop = `-${radius / 2}px`;
  },

  setStyle: function (icon, options) {
    if (!icon) { return; }

    if (options.stroke) {
      icon.style.borderColor = options.color;
      icon.style.borderWidth = `${options.weight}px`;
    } else {
      icon.style.border = 'none';
    }

    if (options.fill) {
      icon.style.background = options.fillColor || options.color;
    } else {
      icon.style.background = 'none';
    }
  },
});


L.divIcon.circleMarkerIcon = function (options) {
  return new L.DivIcon.CircleMarkerIcon(options);
};


L.Marker.DraggableCircleMarker = L.Marker.extend({
  options: {
    icon: L.divIcon.circleMarkerIcon(),
    draggable: true,
    ...CIRCLE_MARKER_DEFAULT_STYLE,
    radius: CIRCLE_MARKER_DEFAULT_RADIUS,
  },

  initialize: function (latlng, options) {
    L.Marker.prototype.initialize.call(this, latlng, options);
    L.Util.setOptions(this, {
      ...options,
      icon: L.divIcon.circleMarkerIcon(options),
    });
  },

  setRadius: function (radius) {
    this.options.radius = radius;

    L.DivIcon.CircleMarkerIcon.prototype.setRadius.call(null, this._icon, this.options.radius);

    return this;
  },

  getRadius: function () {
    return this.options.radius;
  },

  setStyle: function (style) {
    L.Util.setOptions(this, style);

    L.DivIcon.CircleMarkerIcon.prototype.setStyle.call(null, this._icon, this.options);

    return this;
  },

  getStyle: function () {
    const options = this.options;

    return {
      stroke: options.stroke,
      color: options.color,
      weight: options.weight,
      fill: options.fill,
      fillColor: options.fillColor,
    };
  },

  focus: function (style={}) {
    this._blurStyle = this.getStyle();

    this.setStyle({
      ...this._blurStyle,
      fillColor: 'yellow',
      ...style,
    });
  },

  blur: function () {
    if (this._blurStyle) {
      this.setStyle(this._blurStyle);
      Reflect.deleteProperty(this, '_blurStyle');
    }
  },
});


L.marker.draggableCircleMarker = function (latlng, options) {
  return new L.Marker.DraggableCircleMarker(latlng, options);
};
