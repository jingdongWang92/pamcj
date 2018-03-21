import React from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import Layout from 'antd/es/layout';
import defaultLayers from './default_layers';
import sample from './sample.json';


export default class PageCartogramMapboxRender extends React.Component {

  constructor(props) {
    super(props);

    mapboxgl.accessToken = 'pk.eyJ1IjoiemhjaHVhbjciLCJhIjoiY2lzOGx6N2oyMDVodzJ6cGtpeW9naDRmayJ9.brO3TD1ic_qDBZf4pa88UA';
  }

  componentDidMount() {
    this.renderer = new mapboxgl.Map({
      container: this.mapContainer,
      zoom: 18,
      light: {
        anchor: 'viewport',
        color: 'red',
        intensity: 0.4,
      },
      center: turf.getCoord(turf.center(sample)),
      style: {
        version: 8,
        sprite: 'mapbox://sprites/mapbox/bright-v9',
        glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
        sources: {
          'custom-data': {
            type: 'geojson',
            data: sample,
          },
        },
        layers: defaultLayers,
      },
    });
  }

  render() {

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Content>
          <div ref={ref => this.mapContainer = ref} style={{ height: '100vh' }}></div>
        </Layout.Content>
      </Layout>
    );
  }
}
