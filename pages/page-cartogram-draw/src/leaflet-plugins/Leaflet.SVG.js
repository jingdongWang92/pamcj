import L from 'leaflet';

const { DomUtil, Util: { stamp }, SVG: { create } } = L;


// 重载SVG的显示方法
L.SVG.include({
  _initFilter: function (layer) {
    const filter = layer._filter = create('filter');
    filter.setAttribute('id', genLayerFilterId(layer));

    return filter;
  },

  _addFilter: function (layer) {
    if (layer._filter) {
      this._container.appendChild(layer._filter);
    }
  },

  _removeFilter: function (layer) {
    if (layer._filter) {
      DomUtil.remove(layer._filter);
    }
  },

  _initFilterDropShadow: function (layer) {
    const shadow = layer._filter_drop_shadow = create('feDropShadow');
    shadow.setAttribute('id', genLayerFilterDropShadowId(layer));
    shadow.setAttribute('dx', layer.options.shadowOffsetX);
    shadow.setAttribute('dy', layer.options.shadowOffsetY);
    shadow.setAttribute('stdDeviation', `${layer.options.shadowBlurRadiusX}, ${layer.options.shadowBlurRadiusY}`);

    return shadow;
  },

  _addFilterDropShadow: function (layer) {
    if (layer._filter_drop_shadow && layer._filter) {
      layer._filter.appendChild(layer._filter_drop_shadow);
    }
  },

  _updateFilterDropShadow: function (layer) {
    const shadow = layer._filter_drop_shadow;

    if (!shadow) { return; }

    shadow.setAttribute('dx', layer.options.shadowOffsetX);
    shadow.setAttribute('dy', layer.options.shadowOffsetY);
    shadow.setAttribute('stdDeviation', `${layer.options.shadowBlurRadiusX}, ${layer.options.shadowBlurRadiusY}`);
  },

  _removeFilterDropShadow: function (layer) {
    if (layer._filter_drop_shadow) {
      DomUtil.remove(layer._filter_drop_shadow);
    }
  },

  _initPath: function (layer) {
    if (layer instanceof L.Custom.Surface) {
      this._initFilter(layer);
      this._initFilterDropShadow(layer)
    }

		var path = layer._path = create('path');

		// @namespace Path
		// @option className: String = null
		// Custom class name set on an element. Only for SVG renderer.
		if (layer.options.className) {
			DomUtil.addClass(path, layer.options.className);
		}

		if (layer.options.interactive) {
			DomUtil.addClass(path, 'leaflet-interactive');
		}

		this._updateStyle(layer);
		this._layers[stamp(layer)] = layer;
	},


  _addPath: function (layer) {
		if (!this._rootGroup) { this._initContainer(); }
		this._rootGroup.appendChild(layer._path);
		layer.addInteractiveTarget(layer._path);

    // add shadow filter for the layer
    if (layer instanceof L.Custom.Surface) {
      this._addFilter(layer);
      this._addFilterDropShadow(layer);
    }
	},

	_removePath: function (layer) {
    if (layer instanceof L.Custom.Surface) {
      this._removeFilterDropShadow(layer);
      this._removeFilter(layer);
    }

		DomUtil.remove(layer._path);
		layer.removeInteractiveTarget(layer._path);
		delete this._layers[stamp(layer)];
	},

  _updateStyle: function (layer) {
    // copy & paste from https://github.com/Leaflet/Leaflet/blob/master/src/layer/vector/SVG.js#L140
    var path = layer._path,
        options = layer.options;

    if (!path) { return; }

    if (options.stroke) {
      path.setAttribute('stroke', options.color);
      path.setAttribute('stroke-opacity', options.opacity);
      path.setAttribute('stroke-width', options.weight);
      path.setAttribute('stroke-linecap', options.lineCap);
      path.setAttribute('stroke-linejoin', options.lineJoin);

      if (options.dashArray) {
        path.setAttribute('stroke-dasharray', options.dashArray);
      } else {
        path.removeAttribute('stroke-dasharray');
      }

      if (options.dashOffset) {
        path.setAttribute('stroke-dashoffset', options.dashOffset);
      } else {
        path.removeAttribute('stroke-dashoffset');
      }
    } else {
      path.setAttribute('stroke', 'none');
    }

    if (options.fill) {
      path.setAttribute('fill', options.fillColor || options.color);
      path.setAttribute('fill-opacity', options.fillOpacity);
      path.setAttribute('fill-rule', options.fillRule || 'evenodd');
    } else {
      path.setAttribute('fill', 'none');
    }

    // update shadow filter
    if (layer instanceof L.Custom.Surface) {
      this._updateFilterDropShadow(layer);
      path.setAttribute('filter', `url(#${genLayerFilterId(layer)})`);
    }
  },
});


function genLayerFilterId(layer) {
  return `layer-filter-${layer._leaflet_id}`;
}


function genLayerFilterDropShadowId(layer) {
  return `layer-filter-drop-shadow-${layer._leaflet_id}`;
}
