import { useContext, useEffect, useState } from 'react'
import SpotifyContext from '../context/SpotifyContext'

import { getPlaylists } from '../context/SpotifyActions'

function PlaylistSelector() {
    const { user, dispatch } = useContext(SpotifyContext)
    const [playlists, setPlaylists] = useState({})

    useEffect(() => {
        async function fetchPlaylists() {
            const userPlaylists = await getPlaylists()
            setPlaylists(userPlaylists)
        }

        fetchPlaylists()
    }, [user])

    return (
        <div className='row'>
            <div className='col'>
                <div className='card border-dark me-3'>
                    <div className='card-header'>Your Playlists</div>
                    <div className='card-body'>
                        {JSON.stringify(playlists) === '{}' ? (
                            <p>No playlists to show</p>
                        ) : (
                            <div>
                                {playlists.map((playlist) => (
                                    <p key={playlist.id}>{playlist.name}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PlaylistSelector
