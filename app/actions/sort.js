// @flow
export const SORT_DEVELOPER = 'SORT_DEVELOPER';
export const SORT_REPOS = 'SORT_REPOS';

export function sortDeveloper(columnKey, sortDir) {
  return {
    type: SORT_DEVELOPER,
    columnKey,
    sortDir,
  };
}

export function sortRepo(columnKey, sortDir) {
  return {
    type: SORT_REPOS,
    columnKey,
    sortDir,
  };
}
