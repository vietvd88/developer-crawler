export const STORE_REPOS = 'STORE_REPOS';
export const STORE_DEVELOPER = 'STORE_DEVELOPER';
export const STORE_DEVELOPER_LIST = 'STORE_DEVELOPER_LIST';

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
        var repoModel = getModel('GithubDeveloperRepo')
        return Promise.all([
          developerModel.getAll(),
          repoModel.getAll()])
        .then(values => {
          var developers, repos
          [developers, repos] = values
          developers = developers.filter(function(developer) { return developer.user_name != ''})
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

export function onCrawlingClick() {
    return (dispatch: Function, getState: Function) => {
        startCrawling()
    };
}

