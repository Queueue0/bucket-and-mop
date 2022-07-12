import { useEffect, useContext, useState } from 'react'
import { getUser, refreshAuth } from '../context/SpotifyActions'
import SpotifyContext from '../context/SpotifyContext'

import ErrorMessage from './ErrorMessage'
import PlaylistSelector from './PlaylistSelector'

function Home() {
    const { auth_error, user, dispatch } = useContext(SpotifyContext)

    const [auth, setAuth] = useState(
        JSON.parse(localStorage.getItem('sp_auth'))
    )

    const attemptRefresh = async () => {
        const refresh = await refreshAuth()

        if (JSON.stringify(refresh) !== JSON.stringify(auth)) {
            if (!refresh.refresh_token && auth.refresh_token) {
                refresh.refresh_token = auth.refresh_token
            }

            setAuth(refresh)
            localStorage.setItem('sp_auth', JSON.stringify(refresh))
        }
    }

    useEffect(() => {
        attemptRefresh()
    })

    return (
        <div className='container'>
            {auth_error && <ErrorMessage />}
            {JSON.stringify(user) === '{}' ? (
                <div>Placeholder</div>
            ) : (
                <PlaylistSelector />
            )}
        </div>
    )
}
export default Home
