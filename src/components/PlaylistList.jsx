import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

function PlaylistList({ playlists, showClean, setActivePlaylist }) {
  const [activeId, setActiveId] = useState(playlists[0].id)

  useEffect(() => {
    if (activeId === playlists[0].id) setActivePlaylist(playlists[0])
  }, [setActivePlaylist, playlists])

  return (
    <div className='pl-list list-group list-group-flush bg-transparent overflow-auto'>
      {/* Generating content to display */}
      {playlists.reduce((result, playlist) => {
        // Used to determine the minimum number of explicit tracks before displaying
        let threshold = 1

        // If the user wants to see playlists with no explicit tracks,
        // set threshold to 0
        if (showClean) threshold = 0
        if (
          playlist.explicit_count === undefined ||
          playlist.explicit_count >= threshold
        ) {
          result.push(
            <button
              key={playlist.id}
              className={`list-group-item list-group-item-action ${
                activeId === playlist.id && 'active'
              }`}
              onClick={() => {
                setActiveId(playlist.id)
                setActivePlaylist(playlist)
              }}
            >
              <div className='row'>
                <div className='col-12'>
                  <div className='row'>
                    <div className='col-10 ps-0'>
                      <p className='ps-0 mb-0 fw-bolder text-truncate'>
                        {playlist.name}
                      </p>
                    </div>
                    <div className='col-2'>
                      <span
                        className={`badge ${
                          playlist.explicit_count !== undefined &&
                          playlist.explicit_count === 0
                            ? 'bg-success'
                            : 'bg-danger'
                        } ms-auto`}
                      >
                        {playlist.explicit_count !== undefined ? (
                          playlist.explicit_count
                        ) : (
                          <div className='lds-ellipsis'>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )
        }

        return result
      }, [])}
    </div>
  )
}

PlaylistList.propTypes = {
  playlists: PropTypes.array.isRequired,
  showClean: PropTypes.bool,
  setActivePlaylist: PropTypes.func.isRequired,
}

export default PlaylistList
