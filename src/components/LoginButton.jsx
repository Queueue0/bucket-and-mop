import { useContext } from 'react'
import SpotifyContext from '../context/SpotifyContext'
import { authenticate, getUser } from '../context/SpotifyActions'

import spotifyIcon from '../assets/Spotify_Icon_RGB_White.png'

function LoginButton() {
    const { dispatch } = useContext(SpotifyContext)

    const login = async () => {
        const auth = await authenticate()
        if (auth) {
            dispatch({ type: 'SET_TOKEN_REFRESH', payload: auth })

            const current_user = await getUser()

            dispatch({ type: 'SET_USER', payload: { user: current_user } })
        } else {
            dispatch({ type: 'SET_AUTH_ERROR' })
            setTimeout(() => {
                dispatch({ type: 'CLEAR_AUTH_ERROR' })
            }, 10000)
        }
    }

    return (
        <button className='btn btn-primary' onClick={login}>
            Sign In With Spotify
            <img src={spotifyIcon} className='logo-btn ms-1' />
        </button>
    )
}
export default LoginButton
