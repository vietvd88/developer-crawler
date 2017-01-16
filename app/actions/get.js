export const STORE_REPOS = 'STORE_REPOS';
export const STORE_DEVELOPER = 'STORE_DEVELOPER';

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
