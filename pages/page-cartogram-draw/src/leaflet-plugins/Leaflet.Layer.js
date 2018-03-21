import L from 'leaflet';


// 重载Layer的某些方法，实现自动显示和移除feature title
L.Layer.include({
  options: {
    label: '',
  },

  _createLabelIcon: function (label) {
    return L.divIcon({
      html: label,
      className: 'leaflet-edge-title',
      iconSize: [23, 23],
    });
  },

  setLabel: function (label) {
    if (!this._titleElem) { return; }
    this._titleElem.setIcon(this._createLabelIcon(label));
  },
});


L.Layer.addInitHook(function () {
  // 只显示`Custom.Point`、`Custom.Curve`和`Custom.Surface`的 `title`, 或者没有`feature`属性时也不显示
  if ((!(this instanceof L.Custom.Point) && !(this instanceof L.Custom.Curve) && !(this instanceof L.Custom.Surface)) || !this.options.feature) { return; }

  this
    .once('add', () => {
      const center = this.getCenter();
      const elem = this._titleElem = L.marker(center, {
        interactive: false,
        icon: this._createLabelIcon(this.options.label),
      });
      elem.addTo(this._map);
    })
    .once('remove', () => {
      this._titleElem && this._titleElem.remove();
    });
});
