// @flow
export const SORT_DEVELOPER = 'SORT_DEVELOPER';
export const SORT_REPOS = 'SORT_REPOS';
export const SORT_QIITA_POST = 'SORT_QIITA_POST';
export const SORT_FACEBOOK_JOB = 'SORT_FACEBOOK_JOB';

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

export function sortQiitaPost(columnKey, sortDir) {
  return {
    type: SORT_QIITA_POST,
    columnKey,
    sortDir,
  };
}

export function sortFacebookJob(columnKey, sortDir) {
  return {
    type: SORT_FACEBOOK_JOB,
    columnKey,
    sortDir,
  };
}
