import { useContext, useEffect, useState } from 'react'
import SpotifyContext from '../context/SpotifyContext'
import { getPlaylists, getAllPlaylistTracks } from '../context/SpotifyActions'

import PlaylistList from './PlaylistList'

function PlaylistSelector() {
    const { user, loading, dispatch } = useContext(SpotifyContext)
    const [playlists, setPlaylists] = useState({})

    useEffect(() => {
        async function fetchPlaylists() {
            dispatch({ type: 'SET_LOADING' })
            const userPlaylists = await getPlaylists(0)
            setPlaylists(userPlaylists.data)
            dispatch({ type: 'UNSET_LOADING' })
            userPlaylists.data.items = await Promise.all(
                userPlaylists.data.items.map(async (playlist) => {
                    const tracks = await getAllPlaylistTracks(playlist.id)
                    const count = tracks.reduce(
                        (explicits, track) =>
                            track.track.explicit ? ++explicits : explicits,
                        0
                    )
                    return { ...playlist, explicit_count: count }
                })
            ).then((result) => result)

            const result = { ...userPlaylists.data }

            setPlaylists(result)

            // dumb code from a dumb idea that I might recycle later
            /*await Promise.all(
                userPlaylists.items.map(async (playlist) => {
                    const tracks = await getAllPlaylistTracks(playlist.id)
                    const hasExplicit = tracks.some((track) => {
                        return track.track.explicit
                    })

                    if (hasExplicit) {
                        console.log(playlist)
                        return playlist
                    }
                })
            )
                .then((result) => {
                    setPlaylists(result)
                    dispatch({ type: 'UNSET_LOADING' })
                })
                .catch((err) => {
                    console.err(err)
                })*/
        }

        fetchPlaylists()
    }, [user, dispatch])

    return (
        <div className='row'>
            <div className='col-md-12 col-lg-9 col-xl-8 mx-auto'>
                <div className='card border-dark me-3 mb-3 bg-transparent'>
                    <div className='card-header'>Your Filthy Playlists</div>
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
                <ul className='pagination justify-content-center mx-auto'>
                    <li className='page-item'>
                        <button className='page-link'>&laquo;</button>
                    </li>
                    <li className='page-item'>
                        <button className='page-link'>&raquo;</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default PlaylistSelector
