// @flow
import { CHANGE_SKILL } from '../actions/filter';

export default function skill(state = '', action: Object) {
  switch (action.type) {
    case CHANGE_SKILL:
      return action.skill.target.value
    default:
      return state
  }
}