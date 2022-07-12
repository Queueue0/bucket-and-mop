import { useContext, useEffect, useState } from 'react'
import SpotifyContext from '../context/SpotifyContext'
import { getPlaylists } from '../context/SpotifyActions'

import PlaylistList from './PlaylistList'

function PlaylistSelector() {
    const { auth, user, loading, dispatch } = useContext(SpotifyContext)
    const [playlists, setPlaylists] = useState({})

    useEffect(() => {
        async function fetchPlaylists() {
            dispatch({ type: 'SET_LOADING' })
            const userPlaylists = await getPlaylists(0)
            setPlaylists(userPlaylists)
            console.log(JSON.stringify(playlists))
            dispatch({ type: 'UNSET_LOADING' })
        }

        fetchPlaylists()
    }, [user, auth])

    return (
        <div className='row'>
            <div className='col'>
                <div className='card border-dark me-3 bg-transparent'>
                    <div className='card-header'>Your Playlists</div>
                    {loading ? (
                        <div className='card-body'>
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <>
                            {JSON.stringify(playlists) === '{}' ? (
                                <div className='card-body'>
                                    <p>No playlists to show</p>
                                </div>
                            ) : (
                                <PlaylistList playlists={playlists.items} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
export default PlaylistSelector
