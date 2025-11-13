const inintialState = {
    users: [],
    currUser: {},
    token: "",
    myMessages: [],
    userMessages: [], 
    posts: [],
    postsToShow: [],
    refreshUsers: false,
    refreshPosts: false,
    replyFlag: false,
    rooms: []
};
const reducer = (state = inintialState, action) => {
    switch(action.type)
    {
        case "GET_USERS":
            state = {...state, users: [...action.payload]}
            return state
        case "GET_TOKEN":
            state = {...state, token: action.payload}
            return state
        case "GET_CURRUSER":
            state = {...state, currUser: {...action.payload}}
            return state
        case "GET_MESSAGES":
            state = {...state, myMessages: [...action.payload]}
            return state
        case "GET_USER_MESSAGES":
            state = {...state, userMessages: [...action.payload]}
            return state
        case "GET_POSTS":
            state = {...state, posts: [...action.payload]}
            return state
        case "CLEAR_POSTS":
            state = {...state, posts: []}
            state = {...state, postsToShow: []}
            return state
        case "POSTS_TO_SHOW":
            state = {...state, postsToShow: [...action.payload]}
            return state
        case "ADD_NEW_MESSAGE":
            state = {...state, myMessages: [...state.myMessages, action.payload]}
            return state
        case "REFRESH_USERS":
            state = {...state, refreshUsers: action.payload}
            return state
        case "REFRESH_POSTS":
            state = {...state, refreshPosts: action.payload}
            return state
        case "REPLY_FLAG":
            state = {...state, replyFlag: action.payload}
            return state
        case "GET_ROOMS":
            state = {...state, rooms: [...action.payload]}
            return state
        default:
            console.log("Invalid action, state remains the same!")
            return state
    }
}

export default reducer;