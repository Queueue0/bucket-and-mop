import axios from 'axios'

// Axios config for janitor's closet
const janitor = axios.create({
    baseURL: 'http://localhost:8000',
})

// Axios config for Spotify API
const spotify = axios.create({
    baseURL: 'https://api.spotify.com/v1',
})

// Interceptor to add auth token to Spotify API requests
// This is here so that the token we send is always up
// to date, since it's possible for the token to change
// during a refresh, for example.
spotify.interceptors.request.use((config) => {
    const auth = localStorage.getItem('sp_auth')

    if (auth) {
        const token = JSON.parse(auth).access_token
        config.headers.Authorization = `Bearer ${token}`
    } else {
        config.headers.Authorization = ''
    }

    return config
})

// Calculate and return when token will expire given
// the time in seconds until expiration
const getExpiration = (expiresIn) => {
    const result = new Date()
    result.setSeconds(result.getSeconds() + expiresIn)

    return result
}

// Go through the authentication process
// Uses the Authorization Code Flow
export const authenticate = () => {
    const params = new URLSearchParams({
        client_id: '832851d76290442c838fa31e4622cc46',
        response_type: 'code',
        redirect_uri: 'http://localhost:3000/callback/',
        scope: 'playlist-read-private playlist-read-collaborative playlist-modify-public',
    })

    // Open a popup window for authentication
    const authWindow = window.open(
        `https://accounts.spotify.com/authorize?${params}`,
        'Login with Spotify',
        'width=800,height=600'
    )

    // Return the auth data once the window is closed
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            if (authWindow.closed) {
                clearInterval(timer)

                const auth = JSON.parse(localStorage.getItem('sp_auth'))

                resolve(auth)
            }
        }, 1000)
    })
}

// Given an authorization code, request and return
// authorization credentials from janitor's closet
export const getAuth = async (code) => {
    const params = new URLSearchParams({
        code: code,
    })

    const response = await janitor.get(`/get-token?${params}`)

    return { ...response.data }
}

// Refresh the access token and return the callback or an error if something went wrong
export const refreshAuth = async (callback) => {
    const auth = JSON.parse(localStorage.getItem('sp_auth'))
    if (auth && JSON.stringify(auth) !== '{}') {
        const params = new URLSearchParams({
            refresh_token: auth.refresh_token,
        })

        try {
            const response = await janitor.get(`/refresh-token?${params}`)
            let refreshed = response.data

            if (refreshed.refresh_token === undefined && auth.refresh_token) {
                refreshed.refresh_token = auth.refresh_token
            }

            localStorage.setItem('sp_auth', JSON.stringify(refreshed))
            console.log('refreshed auth', new Date())
        } catch (err) {
            return err
        }

        return callback()
    }

    return new Error('User not logged in')
}

// Clear auth and user data from localStorage
// Used when logging out
export const clearAuth = () => {
    localStorage.removeItem('sp_auth')
    localStorage.removeItem('sp_user')
}

// Request and return the currently authenticated user
// from the Spotify API
export const getUser = async () => {
    let response
    try {
        response = await spotify.get('/me')
    } catch (err) {
        if (err.response) {
            // Intentional use of == here because for this project I'm too
            // lazy to check if err.response.status is a string or a number
            if (err.response.status == 401) {
                response = await refreshAuth(getUser)
            } else {
                return err
            }
        } else {
            clearAuth()
            return err
        }
    }
    return response.data
}

// Request and return the user's saved playlists
export const getPlaylists = async (pageOffset) => {
    const pageSize = 6
    const offset = pageOffset || 0
    const params = new URLSearchParams({
        offset: offset * pageSize,
        limit: pageSize,
    })

    let response
    try {
        response = await spotify.get(`/me/playlists?${params}`)
    } catch (err) {
        if (err.response) {
            // Intentional use of == here because for this project I'm too
            // lazy to check if err.response.status is a string or a number
            if (err.response.status == 401) {
                response = await refreshAuth(() => getPlaylists(offset))
            } else {
                return err
            }
        } else {
            return err
        }
    }

    return response
}

// Get tracks from a playlist
// May optionally specify fields to reduce response size
export const getPlaylistTracks = async (
    playlistId,
    pageSize,
    offset,
    fields
) => {
    const params = new URLSearchParams({
        limit: pageSize,
        offset: offset,
        ...(fields && { fields: fields }),
    })

    let response
    try {
        response = await spotify.get(
            `/playlists/${playlistId}/tracks?${params}`
        )
    } catch (err) {
        if (err.response) {
            // Intentional use of == here because for this project I'm too
            // lazy to check if err.response.status is a string or a number
            if (err.response.status == 401) {
                response = await refreshAuth(() =>
                    getPlaylistTracks(playlistId, pageSize, offset, fields)
                )
            } else {
                return err
            }
        } else {
            return err
        }
    }

    return response
}

// Get all tracks in a playlist
// May optionally specify fields to reduce response size
export const getAllPlaylistTracks = async (playlistId, fields) => {
    let pageSize = 50
    let offset = 0
    let done = false
    let tracks = []

    let result = await getPlaylistTracks(playlistId, pageSize, offset, fields)

    do {
        tracks = [...tracks, ...result.data.items]

        try {
            if (result.next != null) {
                offset += pageSize
                result = await getPlaylistTracks(
                    playlistId,
                    pageSize,
                    offset,
                    fields
                )
            } else {
                done = true
            }
        } catch (e) {
            done = true
        }
    } while (!done)

    return tracks
}

// Return response data from the provided url
// Assumes url is for the Spotify API
export const getUrl = async (url) => {
    const response = await spotify.get(url)

    return response
}
