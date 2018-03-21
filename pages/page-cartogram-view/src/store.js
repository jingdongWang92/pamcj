import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducer';
import rootSaga from './saga';


export default function createStoreWidthMiddleware(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  let middleware = applyMiddleware(
    sagaMiddleware,
  );
  if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
    middleware = compose(middleware, window.devToolsExtension());
  }
  const store = middleware(createStore)(rootReducer, initialState);
  sagaMiddleware.run(rootSaga);
  return store;
}
