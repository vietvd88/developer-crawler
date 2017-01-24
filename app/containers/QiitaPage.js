import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Qiita from '../components/Qiita';
import * as Sorters from '../actions/sort';
import * as Getters from '../actions/get';
import * as Comments from '../actions/comment';

function mapStateToProps(state) {
  return {
    developer: state.developer,
    repoList: state.repoList,
    commentList: state.commentList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, Sorters, Getters, Comments), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Qiita);