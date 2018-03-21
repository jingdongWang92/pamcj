import 'babel-polyfill';
import React from 'react';
import 'antd/dist/antd.css';
import 'sweetalert2/dist/sweetalert2.css';
import 'react-widgets/dist/css/react-widgets.css';
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
