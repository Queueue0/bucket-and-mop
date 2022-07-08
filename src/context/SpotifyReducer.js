const spotifyreducer = (state, action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            return {
                ...state,
                logged_in: true,
                access_token: action.payload.access_token,
            }
        case 'SET_REFRESH':
            return {
                ...state,
                logged_in: true,
                refresh_token: action.payload.refresh_token,
            }
        case 'SET_TOKEN_REFRESH':
            return {
                ...state,
                logged_in: true,
                access_token: action.payload.access_token,
                refresh_token: action.payload.refresh_token,
            }
        case 'SET_USER':
            console.log(action)
            return {
                ...state,
                user: action.payload.user,
            }
        case 'CLEAR_TOKENS':
            return {
                ...state,
                logged_in: false,
                access_token: '',
                refresh_token: '',
                user: {},
            }
        case 'SET_AUTH_ERROR':
            return {
                ...state,
                auth_error: true,
            }
        case 'CLEAR_AUTH_ERROR':
            return {
                ...state,
                auth_error: false,
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: true,
            }
        case 'UNSET_LOADING':
            return {
                ...state,
                loading: false,
            }
        default:
            return state
    }
}

export default spotifyreducer
