import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as Filters from '../actions/filter';
import * as Sorter from '../actions/sort';

function mapStateToProps(state) {
  return {
    country: state.country,
    skill: state.skill,
    developerList: state.developerList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, Filters, Sorter), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);