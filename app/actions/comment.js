export const STORE_COMMENT = 'STORE_COMMENT';
export const POST_COMMENT = 'POST_COMMENT';

export function storeComment(comments) {
    return {
        type: STORE_COMMENT,
        comments,
    };
}

export function postComment(userName, comment) {
    return {
        type: POST_COMMENT,
        userName,
        comment,
    };
}

// export function getAsyncComment(userName) {
//     return (dispatch: Function, getState: Function) => {
//         var developerModel = getModel('GithubDeveloper')
//         developerModel.get([], {user_name: userName}).then(developer => {
//             if (developer && developer.length > 0) {
//                 dispatch(storeDeveloper(developer[0]))
//             }
//         })
//     };
// }
