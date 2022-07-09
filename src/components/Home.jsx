import { useContext } from 'react'
import { authenticate } from '../context/SpotifyActions'
import SpotifyContext from '../context/SpotifyContext'

import ErrorMessage from './ErrorMessage'
import PlaylistSelector from './PlaylistSelector'

function Home() {
    const { auth_error, user, dispatch } = useContext(SpotifyContext)

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
