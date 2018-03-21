import 'babel-polyfill';
import React from 'react';
import 'antd/dist/antd.css';
import 'sweetalert2/dist/sweetalert2.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import configureStore from './store';
import { Provider } from 'react-redux';
import Container from './container';

const store = configureStore({});

export default function App() {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
}
