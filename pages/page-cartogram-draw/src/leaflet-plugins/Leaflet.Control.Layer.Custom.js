import L from 'leaflet';

const {
  DomUtil,
  Util,
  DomEvent,
  Browser,
} = L;


L.Control.Layers.Custom = L.Control.Layers.extend({

  initialize: function (baseLayers, diagramLayers, overlays,  options) {
    Util.setOptions(this, options);

		this._layerControlInputs = [];
		this._layers = [];
		this._lastZIndex = 0;
		this._handlingClick = false;

		for (var i in baseLayers) {
			this._addLayer(baseLayers[i], i, 'tile');
		}

    for (i in diagramLayers) {
      this._addLayer(diagramLayers[i], i, 'diagram');
    }

		for (i in overlays) {
			this._addLayer(overlays[i], i, 'overlay');
		}
  },

  addDiagramLayer: function (layer, name) {
    this._addLayer(layer, name);
    return (this._map) ? this._update() : this;
  },

  _initLayout: function () {
    var className = 'leaflet-control-layers',
        container = this._container = DomUtil.create('div', className),
        collapsed = this.options.collapsed;

    // makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
    container.setAttribute('aria-haspopup', true);

    DomEvent.disableClickPropagation(container);
    DomEvent.disableScrollPropagation(container);

    var form = this._form = DomUtil.create('form', className + '-list');

    if (collapsed) {
      this._map.on('click', this.collapse, this);

      if (!Browser.android) {
        DomEvent.on(container, {
          mouseenter: this.expand,
          mouseleave: this.collapse
        }, this);
      }
    }

    var link = this._layersLink = DomUtil.create('a', className + '-toggle', container);
    link.href = '#';
    link.title = 'Layers';

    if (Browser.touch) {
      DomEvent.on(link, 'click', DomEvent.stop);
      DomEvent.on(link, 'click', this.expand, this);
    } else {
      DomEvent.on(link, 'focus', this.expand, this);
    }

    if (!collapsed) {
      this.expand();
    }

    this._baseLayersList = DomUtil.create('div', className + '-base', form);
    this._separator = DomUtil.create('div', className + '-separator', form);
    this._diagramLayersList = DomUtil.create('div', className + 'diagram', form);
    this._separator = DomUtil.create('div', className + '-separator', form);
    this._overlaysList = DomUtil.create('div', className + '-overlays', form);

    container.appendChild(form);
  },

  _addLayer: function (layer, name, type) {
		if (this._map) {
			layer.on('add remove', this._onLayerChange, this);
		}

		this._layers.push({
			layer: layer,
			name: name,
			type: type,
		});

		if (this.options.sortLayers) {
			this._layers.sort(Util.bind(function (a, b) {
				return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
			}, this));
		}

		if (this.options.autoZIndex && layer.setZIndex) {
			this._lastZIndex++;
			layer.setZIndex(this._lastZIndex);
		}

		this._expandIfNotCollapsed();
	},

  _update: function () {
		if (!this._container) { return this; }

		DomUtil.empty(this._baseLayersList);
    DomUtil.empty(this._diagramLayersList);
		DomUtil.empty(this._overlaysList);

		this._layerControlInputs = [];
		var baseLayersPresent, diagramLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;

		for (i = 0; i < this._layers.length; i++) {
			obj = this._layers[i];
			this._addItem(obj);
			overlaysPresent = overlaysPresent || obj.type === 'overlay';
			diagramLayersPresent = diagramLayersPresent || obj.type === 'diagram';
			baseLayersPresent = baseLayersPresent || obj.type === 'tile';
			baseLayersCount += obj.type === 'tile' ? 1 : 0;
		}

		// Hide base layers section if there's only one layer.
		if (this.options.hideSingleBase) {
			baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
			this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
		}

		this._separator.style.display = overlaysPresent && diagramLayersPresent && baseLayersPresent ? '' : 'none';

		return this;
	},

  _onLayerChange: function (e) {
    if (!this._handlingClick) {
      this._update();
    }

    var obj = this._getLayer(Util.stamp(e.target));

    // @namespace Map
    // @section Layer events
    // @event baselayerchange: LayersControlEvent
    // Fired when the base layer is changed through the [layer control](#control-layers).
    // @event overlayadd: LayersControlEvent
    // Fired when an overlay is selected through the [layer control](#control-layers).
    // @event overlayremove: LayersControlEvent
    // Fired when an overlay is deselected through the [layer control](#control-layers).
    // @namespace Control.Layers
    var type = null;
    if (obj.type === 'overlay') {
      type = e.type === 'add' ? 'overlayadd' : 'overlayremove';
    } else if (obj.type === 'diagram') {
      type = e.type === 'add' ? 'diagramadd' : 'diagramremove';
    } else {
      type = e.type === 'add' ? 'baselayerchange' : null;
    }

    if (type) {
      this._map.fire(type, obj);
    }
  },

  _addItem: function (obj) {
		var label = document.createElement('label'),
		    checked = this._map.hasLayer(obj.layer),
		    input;

		if (obj.type === 'overlay') {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else if (obj.type === 'diagram') {
      input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
    } else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}

		this._layerControlInputs.push(input);
		input.layerId = Util.stamp(obj.layer);

		DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		// Helps from preventing layer control flicker when checkboxes are disabled
		// https://github.com/Leaflet/Leaflet/issues/2771
		var holder = document.createElement('div');

		label.appendChild(holder);
		holder.appendChild(input);
		holder.appendChild(name);

		var container;
    if (obj.type === 'overlay') {
      container = this._overlaysList;
    } else if (obj.type === 'diagram') {
      container = this._diagramLayersList;
    } else {
      container = this._baseLayersList;
    };
		container.appendChild(label);

		this._checkDisabledLayers();
		return label;
	},
});

L.control.layers.custom = function (baselayers, diagramLayers, overlays, options) {
  return new L.Control.Layers.Custom(baselayers, diagramLayers, overlays, options);
}
