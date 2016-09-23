import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import RepoDisplay from './components/repo_display';

const Greeting = () => <div>Hey there!</div>

export default (
  <Route path="/" component={App}>
    <Route path="repo" component={Greeting} />
  </Route>  
);