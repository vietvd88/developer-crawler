// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import GithubPage from './containers/GithubPage';
import QiitaPage from './containers/QiitaPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/github" component={GithubPage} />
    <Route path="/qiita" component={QiitaPage} />
  </Route>
);
