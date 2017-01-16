// @flow
export const FILTER_DEVELOPER = 'FILTER_DEVELOPER';
export const CHANGE_COUNTRY = 'CHANGE_COUNTRY';
export const CHANGE_SKILL = 'CHANGE_FILTER';

export function filterDeveloper(country, skill) {
  return {
    type: FILTER_DEVELOPER,
    country,
    skill,
  };
}

export function changeCountry(country) {
  return {
    type: CHANGE_COUNTRY,
    country: country,
  };
}

export function changeSkill(skill) {
  return {
    type: CHANGE_SKILL,
    skill: skill,
  };
}

