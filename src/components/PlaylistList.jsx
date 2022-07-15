import PropTypes from 'prop-types'
import { useState } from 'react'

function PlaylistList({ playlists }) {
    const [activeId, setActiveId] = useState(playlists[0].id)

    return (
        <div className='list-group list-group-flush bg-transparent'>
            {playlists.map((playlist) => (
                <button
                    key={playlist.id}
                    className={`list-group-item list-group-item-action ${
                        activeId === playlist.id && 'active'
                    }`}
                    onClick={() => {
                        setActiveId(playlist.id)
                    }}
                >
                    <div className='row'>
                        <div className='col-3'>
                            <img
                                src={playlist.images[0].url}
                                alt={`Album art for ${playlist.name}`}
                                className='me-3'
                                style={{ maxHeight: 'auto', maxWidth: '80px' }}
                            />
                        </div>
                        <div className='col-9'>
                            <div className='row'>
                                <div className='col-9 ps-0'>
                                    <p className='ps-0 mb-0 fw-bolder text-truncate'>
                                        {playlist.name}
                                    </p>
                                    <p className='ps-0 mt-0 fw-light text-truncate'>
                                        By {playlist.owner.display_name}
                                    </p>
                                </div>
                                <div className='col-3'>
                                    <span
                                        className={`badge ${
                                            playlist.explicit_count !==
                                                undefined &&
                                            playlist.explicit_count === 0
                                                ? 'bg-success'
                                                : 'bg-danger'
                                        } ms-auto`}
                                    >
                                        {playlist.explicit_count !== undefined
                                            ? playlist.explicit_count
                                            : '...'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    )
}

PlaylistList.propTypes = {
    playlists: PropTypes.array.isRequired,
}

export default PlaylistList
