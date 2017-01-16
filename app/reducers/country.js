// @flow
import { CHANGE_COUNTRY } from '../actions/filter';

export default (state = '', action: {}) => {
  switch (action.type) {
    case CHANGE_COUNTRY:
      return action.country.target.value
    default:
      return state
  }
}
