import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Github from '../components/Github';
import * as Sorters from '../actions/sort';
import * as Getters from '../actions/get';

function mapStateToProps(state) {
  return {
    developer: state.developer,
    repoList: state.repoList,
    commentList: state.commentList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, Sorters, Getters), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Github);