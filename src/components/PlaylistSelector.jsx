import { useContext, useEffect, useState } from 'react'
import SpotifyContext from '../context/SpotifyContext'
import { getPlaylists, getAllPlaylistTracks } from '../context/SpotifyActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

import PlaylistList from './PlaylistList'
import TrackList from './TrackList'

function PlaylistSelector() {
  const { user, loading, dispatch } = useContext(SpotifyContext)
  const [playlists, setPlaylists] = useState({})
  const [showClean, setShowClean] = useState(false)
  const [activePlaylist, setActivePlaylist] = useState({})

  // Check if the data needed to display the active playlist has
  // loaded yet
  const activePlaylistLoading = () => {
    return !(
      JSON.stringify(activePlaylist) !== '{}' &&
      activePlaylist !== undefined &&
      'items' in activePlaylist.tracks
    )
  }

  async function fetchPlaylists() {
    dispatch({ type: 'SET_LOADING' })

    let pageSize = 10
    let offset = 0
    let done = false
    let userPlaylists = {}

    let result = await getPlaylists(pageSize, offset)
    userPlaylists = result.data
    setPlaylists({ ...userPlaylists })

    dispatch({ type: 'UNSET_LOADING' })

    do {
      try {
        if (result.data.next != null) {
          offset += pageSize
          result = await getPlaylists(pageSize, offset)

          userPlaylists.items = [...userPlaylists.items, ...result.data.items]
          setPlaylists({ ...userPlaylists })
        } else {
          done = true
        }
      } catch (e) {
        done = true
      }

      const count = await countExplicit(userPlaylists)

      userPlaylists.items = userPlaylists.items.map((playlist) => {
        return playlist.explicit_count !== undefined
          ? playlist
          : {
              ...playlist,
              explicit_count: count[playlist.id],
            }
      })
    } while (!done)

    setPlaylists(userPlaylists)
    //console.log({ ...userPlaylists })
    return userPlaylists
  }

  async function countExplicit(userPlaylists) {
    let pls = { ...userPlaylists }
    pls.items = await Promise.all(
      pls.items.map(async (playlist) => {
        if (playlist.explicit_count === undefined) {
          const tracks = await getAllPlaylistTracks(playlist.id)

          const count = tracks.reduce(
            (explicits, track) =>
              track.track.explicit ? ++explicits : explicits,
            0
          )

          playlist.tracks = { ...playlist.tracks, items: tracks }

          return { ...playlist, explicit_count: count }
        }

        return { ...playlist }
      })
    ).then((result) => result)

    const result = pls.items.reduce(
      (obj, playlist) => ({
        ...obj,
        [playlist.id]: playlist.explicit_count,
      }),
      []
    )

    return result
  }

  useEffect(() => {
    fetchPlaylists()
  }, [user, dispatch])

  const toggleShowClean = () => {
    setShowClean(!showClean)
  }

  return (
    <div className='row'>
      <div className='col-12 mx-auto'>
        <div className='card-group'>
          <div
            className='pl-selector card border-dark mb-3 bg-transparent'
            style={{ flex: '1 0 0%' }}
          >
            <div className='card-header'>
              <div className='d-flex flex-row justify-content-between'>
                <div>
                  {showClean ? 'Your Playlists' : 'Your Filthy Playlists'}{' '}
                </div>
                <div>
                  <div className='form-check form-check-inline form-switch'>
                    <label htmlFor='cleanSwitch' className='form-check-label'>
                      Show clean
                    </label>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id='cleanSwitch'
                      checked={showClean}
                      onChange={toggleShowClean}
                    />
                  </div>
                </div>
              </div>
            </div>
            {loading ? (
              <div className='card-body'>
                <div className='lds-ring'>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              <>
                {JSON.stringify(playlists) === '{}' ? (
                  <div className='card-body'>
                    <p>No playlists to show</p>
                  </div>
                ) : (
                  <PlaylistList
                    playlists={playlists.items}
                    showClean={showClean}
                    setActivePlaylist={setActivePlaylist}
                  />
                )}
              </>
            )}
          </div>
          <div className='card border-dark pl-selector flex flex-md-1 flex-xl-2 flex-xxl-2'>
            <div className='card-header'>
              {!activePlaylistLoading() && (
                <div className='row'>
                  <div className='col-3'>
                    <img
                      src={activePlaylist.images[0].url}
                      alt={`Album art for ${activePlaylist.name}`}
                      className='me-3'
                      style={{
                        maxHeight: 'auto',
                        maxWidth: '80px',
                      }}
                    />
                  </div>
                  <div className='col'>
                    <div className='row'>
                      <div className='col-10 ps-0'>
                        <p className='ps-0 mb-0 fw-bolder'>
                          <a
                            href={activePlaylist.external_urls.spotify}
                            target='_blank'
                          >
                            {activePlaylist.name}{' '}
                            <FontAwesomeIcon
                              icon={faArrowUpRightFromSquare}
                              size='2xs'
                            />
                          </a>
                        </p>
                        <p className='ps-0 mt-0 fw-light text-truncate'>
                          By {activePlaylist.owner.display_name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col fw-light fs-6'>
                    <button className='btn btn-info'>Clean it!</button>
                  </div>
                </div>
              )}
            </div>
            {activePlaylistLoading() ? (
              <div
                className={`card-body ${
                  activePlaylistLoading() && 'align-self-center'
                }`}
              >
                <div className='lds-ring'>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              <TrackList tracks={activePlaylist.tracks.items} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default PlaylistSelector
