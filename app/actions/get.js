export const STORE_REPOS = 'STORE_REPOS';
export const STORE_DEVELOPER = 'STORE_DEVELOPER';
export const STORE_DEVELOPER_LIST = 'STORE_DEVELOPER_LIST';
export const STORE_QIITA_POST_LIST = 'STORE_QIITA_POST_LIST';
export const STORE_FACEBOOK_JOB_LIST = 'STORE_FACEBOOK_JOB_LIST';

export function storeRepos(repos) {
    return {
        type: STORE_REPOS,
        repos,
    };
}

export function storeDeveloper(developer) {
    return {
        type: STORE_DEVELOPER,
        developer,
    };
}

export function storeDeveloperList(developerList) {
    return {
        type: STORE_DEVELOPER_LIST,
        developerList,
    };
}

export function storeQiitaPostList(qiitaPostList) {
    return {
        type: STORE_QIITA_POST_LIST,
        qiitaPostList,
    };
}

export function storeFacebookJobList(facebookJobList) {
    return {
        type: STORE_FACEBOOK_JOB_LIST,
        facebookJobList,
    };
}

export function getDeveloperAsync(userName) {
    return (dispatch: Function, getState: Function) => {
        var developerModel = getModel('GithubDeveloper')
        developerModel.get([], {user_name: userName}).then(developer => {
            if (developer && developer.length > 0) {
                dispatch(storeDeveloper(developer[0]))
            }
        })
    };
}

export function getDeveloperListAsync(userName) {
    return (dispatch: Function, getState: Function) => {
        var developerModel = getModel('GithubDeveloper')
        var fbDeveloperModel = getModel('FacebookDeveloper')
        var qiitaDeveloperModel = getModel('QiitaDeveloper')
        var repoModel = getModel('GithubDeveloperRepo')
        return Promise.all([
          developerModel.getAll(),
          fbDeveloperModel.getAll(),
          qiitaDeveloperModel.getAll(),
          repoModel.getAll()])
        .then(values => {
          var developers, githubDevelopers, fbDevelopers, qiitaDevelopers, repos
          [githubDevelopers, fbDevelopers, qiitaDevelopers, repos] = values
          githubDevelopers = githubDevelopers.filter(function(developer) { developer.type = 'github'; return developer.user_name != ''})
          fbDevelopers = fbDevelopers.filter(function(developer) { developer.type = 'facebook'; return developer.user_name != ''})
          qiitaDevelopers = qiitaDevelopers.filter(function(developer) { developer.type = 'qiita'; return developer.user_name != ''})

          developers = []
          developers = developers.concat(fbDevelopers)
          developers = developers.concat(githubDevelopers)
          developers = developers.concat(qiitaDevelopers)

          for (var i = 0; i < developers.length; i++) {
            var developer = developers[i]
            var developerUserName = developer.user_name
            var developerRepos = repos.filter(function(repo) {return repo.user_name == developerUserName})
            var developerSkills = developerRepos.map(function(repo) { return repo.language })
            developerSkills = developerSkills.filter(function(item, pos) {
                return developerSkills.indexOf(item) == pos && item !== '';
            })
            developer.skill = developerSkills.join(' ')
            developer.age = Math.floor((Math.random() * 50) + 1)
            developer.score = Math.floor((Math.random() * 100) + 1)
          }
          dispatch(storeDeveloperList(developers))
          // return developers
        })
    };
}


export function getRepoAsync(userName) {
    return (dispatch: Function, getState: Function) => {
        var repoModel = getModel('GithubDeveloperRepo')
        repoModel.get([], {user_name: userName}).then(repos => {
            for (var i = 0; i < repos.length; i++) {
                var repo = repos[i]
                if (repo.star == '') {
                    repo.star = 0
                }
                repo.score = Math.floor((Math.random() * 100) + 1)
            }
            dispatch(storeRepos(repos))
        })
    };
}

export function getQiitaDeveloperAsync(userName) {
    return (dispatch: Function, getState: Function) => {
        var developerModel = getModel('QiitaDeveloper')
        developerModel.get([], {user_name: userName}).then(developer => {
            if (developer && developer.length > 0) {
                dispatch(storeDeveloper(developer[0]))
            }
        })
    };
}

export function getQittaPostAsync(userName) {
    console.log('getQittaPostAsync userName: ', userName)
    userName = userName.replace(/@/g , "")
    console.log('getQittaPostAsync userName2 2: ', userName)
    return (dispatch: Function, getState: Function) => {
        var postModel = getModel('QiitaDeveloperPost')
        postModel.get([], {user_name: userName}).then(posts => {
            dispatch(storeQiitaPostList(posts))
        })
    };
}

export function getFacebookDeveloperAsync(userName) {
    return (dispatch: Function, getState: Function) => {
        var developerModel = getModel('FacebookDeveloper')
        developerModel.get([], {user_name: userName}).then(developer => {
            if (developer && developer.length > 0) {
                dispatch(storeDeveloper(developer[0]))
            }
        })
    };
}

export function getFacebookJobAsync(userName) {
    return (dispatch: Function, getState: Function) => {
        var postModel = getModel('FacebookDeveloperJob')
        postModel.get([], {user_name: userName}).then(jobs => {
            dispatch(storeFacebookJobList(jobs))
        })
    };
}

export function startCrawling(url, type) {
    return (dispatch: Function, getState: Function) => {
        startCrawlingDeveloper(url, type)
    };
}

export function stopCrawling() {
    return (dispatch: Function, getState: Function) => {
        stopCrawlingDeveloper()
    };
}

export function onCrawlDeveloperInfoClick() {
    return (dispatch: Function, getState: Function) => {
        crawlDeveloperInfo()
    };
}
