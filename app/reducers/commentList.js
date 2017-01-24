// @flow
import { POST_COMMENT } from '../actions/comment';

export default (state = [], action: {}) => {
  switch (action.type) {
    case POST_COMMENT:
        var newState = state.slice()
        newState.push({
            comment: action.comment,
        })
        return newState
        
    default:
      return state
  }
}
