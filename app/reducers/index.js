// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import country from './country';
import skill from './skill';
import developerList from './developerList';
import repoList from './repoList';
import developer from './developer';
import commentList from './commentList';

const rootReducer = combineReducers({
  country,
  skill,
  developerList,
  repoList,
  developer,
  commentList,
  routing
});

export default rootReducer;
