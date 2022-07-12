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
                    <img
                        src={playlist.images[0].url}
                        alt={`Album art for ${playlist.name}`}
                        className='me-3'
                        style={{ maxHeight: 'auto', maxWidth: '80px' }}
                    />
                    {playlist.name}
                </button>
            ))}
        </div>
    )
}

PlaylistList.propTypes = {
    playlists: PropTypes.array.isRequired,
}

export default PlaylistList
