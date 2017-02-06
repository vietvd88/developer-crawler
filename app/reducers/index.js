// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import country from './country';
import skill from './skill';
import developerList from './developerList';
import repoList from './repoList';
import developer from './developer';
import commentList from './commentList';
import qiitaPostList from './qiitaPostList';
import facebookJobList from './facebookJobList';

const rootReducer = combineReducers({
  country,
  skill,
  developerList,
  repoList,
  developer,
  commentList,
  qiitaPostList,
  facebookJobList,
  routing
});

export default rootReducer;
