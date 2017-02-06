import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Facebook from '../components/Facebook';
import * as Sorters from '../actions/sort';
import * as Getters from '../actions/get';
import * as Comments from '../actions/comment';

function mapStateToProps(state) {
  return {
    developer: state.developer,
    facebookJobList: state.facebookJobList,
    commentList: state.commentList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, Sorters, Getters, Comments), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Facebook);