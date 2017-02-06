import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Setting from '../components/Setting';
import * as Filters from '../actions/filter';
import * as Sorter from '../actions/sort';
import * as Getters from '../actions/get';

function mapStateToProps(state) {
  return {
    country: state.country,
    skill: state.skill,
    developerList: state.developerList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, Filters, Sorter, Getters), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);