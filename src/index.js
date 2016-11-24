import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory, hashHistory } from 'react-router';
import promise from 'redux-promise';
import reducers from './reducers';
import routes from './routes';
import AboutPage from './components/about_the_team';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={hashHistory} routes={routes} />
  </Provider>
  , document.querySelector('.navbar-container'));

ReactDOM.render(<AboutPage />, document.getElementById('about-us'));
