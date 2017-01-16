// @flow
import { FILTER_DEVELOPER } from '../actions/filter';
import { SORT_DEVELOPER } from '../actions/sort';

export default (state = developerList, action: {}) => {
  switch (action.type) {
    case FILTER_DEVELOPER:
        var newState = []
        for (var i = 0; i < state.length; i++) {
            var developer = state[i];
            var belongSkill = (action.skill != '')? developer.skill.indexOf(action.skill) !== -1: true
            var belongCountry = (action.country != '')? developer.location.indexOf(action.country) !== -1: true
            if (belongCountry && belongSkill) {
                newState.push(developer)
            }
        }
        return newState

    case SORT_DEVELOPER:
        var newState = state.slice()
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
        return newState

    default:
        return state
  }
}

