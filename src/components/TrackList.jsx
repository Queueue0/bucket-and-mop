import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

function TrackList({ tracks }) {
  return (
    <ul className='pl-list list-group list-group-flush bg-transparent overflow-auto'>
      {tracks.map((track) => {
        return (
          <li className='list-group-item' key={track.track.id}>
            <div className='row'>
              <div className='col-2'>
                <img
                  src={
                    track.track.album.images[
                      track.track.album.images.length - 1
                    ].url
                  }
                  alt={`Cover art for ${track.track.name}`}
                  style={{ maxHeight: 'auto', maxWidth: '64px' }}
                />
              </div>
              <div className='col'>
                <div className='row'>
                  <div className='col'>
                    <a
                      className='fw-bolder '
                      href={track.track.external_urls.spotify}
                    >
                      {track.track.name}{' '}
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        size='2xs'
                      />
                    </a>
                    <p className='fw-lighter fs-6'>
                      {track.track.artists.reduce((result, artist) => {
                        if (result === '') {
                          result += artist.name
                        } else {
                          result += `, ${artist.name}`
                        }

                        return result
                      }, '')}
                    </p>
                  </div>
                </div>
              </div>
              <div className='col-2'>
                {track.track.explicit && (
                  <span className='badge bg-light ms-auto'>E</span>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

TrackList.propTypes = {
  tracks: PropTypes.array.isRequired,
}

export default TrackList
