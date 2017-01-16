// @flow
import { STORE_REPOS } from '../actions/get';
import { SORT_REPOS } from '../actions/sort';

export default (state = [], action: {}) => {
  switch (action.type) {
    case STORE_REPOS:
        return action.repos

    case SORT_REPOS:
        var newState = state.slice()
        console.log(newState)
        newState.sort((developerA, developerB) => {
          var valueA = developerA[action.columnKey]
          var valueB = developerB[action.columnKey]
          var sortVal = 0
          if (valueA > valueB) {
            sortVal = 1
          }
          if (valueA < valueB) {
            sortVal = -1
          }
          if (sortVal !== 0 && action.sortDir === 'ASC') {
            sortVal = sortVal * -1
          }

          return sortVal
        });
        console.log(newState)
        return newState

    default:
        return state
  }
}

