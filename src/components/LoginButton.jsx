import { useContext } from 'react'
import SpotifyContext from '../context/SpotifyContext'
import { authenticate, getUser } from '../context/SpotifyActions'

import spotifyIcon from '../assets/Spotify_Icon_RGB_White.png'

function LoginButton() {
    const { dispatch } = useContext(SpotifyContext)

    const login = async () => {
        const auth = await authenticate()
        if (auth) {
            const res = await getUser()

            if (res instanceof Error) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: {
                        message:
                            'We were unable to fetch your Spotify user data at this time, please try again later!',
                    },
                })
                setTimeout(() => {
                    dispatch({ type: 'CLEAR_ERROR' })
                }, 10000)
            } else {
                dispatch({ type: 'SET_USER', payload: { user: res } })
                localStorage.setItem('sp_user', JSON.stringify(res))
            }
        } else {
            dispatch({
                type: 'SET_ERROR',
                payload: {
                    message:
                        "We weren't able to sign you in to Spotify at this time, please try again later!",
                },
            })
            setTimeout(() => {
                dispatch({ type: 'CLEAR_ERROR' })
            }, 10000)
        }
    }

    return (
        <button className='btn btn-primary btn-signin' onClick={login}>
            Sign In With Spotify
            <img src={spotifyIcon} alt='' className='logo-btn ms-1' />
        </button>
    )
}
export default LoginButton
