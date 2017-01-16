// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import country from './country';
import skill from './skill';
import developerList from './developerList';
import repoList from './repoList';
import developer from './developer';

const rootReducer = combineReducers({
  country,
  skill,
  developerList,
  repoList,
  developer,
  routing
});

export default rootReducer;
