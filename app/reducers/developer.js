// @flow
import { STORE_DEVELOPER } from '../actions/get';

export default (state = {}, action: {}) => {
  switch (action.type) {
    case STORE_DEVELOPER:
        return action.developer

    default:
        return state
  }
}

