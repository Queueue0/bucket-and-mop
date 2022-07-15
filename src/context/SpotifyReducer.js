const spotifyreducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload.user,
            }
        case 'CLEAR_AUTH':
            return {
                ...state,
                user: {},
            }
        case 'SET_ERROR':
            return {
                ...state,
                auth_error: true,
                error_message: action.payload.message,
            }
        case 'CLEAR_ERROR':
            return {
                ...state,
                auth_error: false,
                error_message: '',
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
