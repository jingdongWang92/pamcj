import 'leaflet/dist/leaflet.css';
import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/images/layers-2x.png';
import 'leaflet/dist/images/layers.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';


L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.0.3/dist/images/';


const GAODE_TILE_MAP = '//maptile.tools.staging.jcbel.com/amap/{s}?x={x}&y={y}&z={z}';
const MAP_ZOOM = 15;
const DEFAULT_CENTER = [29.563009, 106.551556];
const DEFAULT_ZOOM = 4;


export default class CoordinatePicker extends React.PureComponent {
  static propTypes = {
    value: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onChange: () => {},
  }

  componentDidMount() {
    const map = this.leafletMap = L.map(this.mapContainer, {
      center: this.props.value ? [this.props.value.latitude, this.props.value.longitude] : DEFAULT_CENTER,
      zoom: this.props.value ? MAP_ZOOM : DEFAULT_ZOOM,
      attributionControl: false,
      layers: [
        L.tileLayer(GAODE_TILE_MAP, {
          maxNativeZoom: 18,
          maxZoom: 20,
          minZoom: 3,
          subdomains: '1234',
        }),
      ],
      closePopupOnClick: false,
    });

    if (!this.props.value) {
      map.locate({
        setView: true,
        maxZoom: MAP_ZOOM,
      });
    }

    this.renderMarker(this.props.value);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.value && !this.props.value) {
      this.leafletMap.stopLocate();
    }

    if(nextProps.value && !coordinateEq(nextProps.value, this.props.value)) {
      this.leafletMap.setView([nextProps.value.latitude, nextProps.value.longitude], MAP_ZOOM);

      this.renderMarker(nextProps.value);
    }
  }


  renderMarker(value) {
    if (!value) { return; }

    const { longitude, latitude } = value;
    if (!this.marker) {
      const marker = this.marker = L.marker([latitude, longitude], {
        draggable: true,
      });
      marker.on('moveend', () => {
        const latlng = marker.getLatLng();
        this.props.onChange({
          latitude: latlng.lat,
          longitude: latlng.lng,
        });
      });
      marker.on('click', evt => {
        this.leafletMap.flyTo(evt.latlng, MAP_ZOOM);
      });

      marker.addTo(this.leafletMap);
    }

    this.marker.setLatLng([latitude, longitude]);
  }


  render() {
    return (
      <div ref={mapContainer => this.mapContainer = mapContainer} style={{ width: '100%', height: '500px' }}>
      </div>
    );
  }
}

function coordinateEq(coord1, coord2) {
  return coord1 && coord2 && coord1.latitude === coord2.latitude && coord1.longitude === coord2.longitude;
}
