import PropTypes from 'prop-types'

function PlaylistList({ playlists }) {
    return (
        <div>
            {playlists.map((playlist) => (
                <p key={playlist.id}>{playlist.name}</p>
            ))}
        </div>
    )
}

PlaylistList.propTypes = {
    playlists: PropTypes.array.isRequired,
}

export default PlaylistList
