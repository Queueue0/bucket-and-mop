import { createContext, useReducer } from 'react'
import spotifyreducer from './SpotifyReducer'

const SpotifyContext = createContext()

export const SpotifyProvider = ({ children }) => {
    const initialState = {
        loading: false,
        logged_in: false,
        access_token: '',
        refresh_token: '',
        user: {},
        auth_error: false,
    }

    const [state, dispatch] = useReducer(spotifyreducer, initialState)

    return (
        <SpotifyContext.Provider
            value={{
                ...state,
                dispatch,
            }}
        >
            {children}
        </SpotifyContext.Provider>
    )
}

export default SpotifyContext
