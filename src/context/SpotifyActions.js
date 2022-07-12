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

    const expiration = getExpiration(response.data.expires_in)

    return { ...response.data, expiration }
}

// Refresh the access token if it exists and is expired,
// otherwise just return the intitial value
export const refreshAuth = async () => {
    const auth = JSON.parse(localStorage.getItem('sp_auth'))
    if (auth && JSON.stringify(auth) !== '{}') {
        if (Date.parse(auth.expiration) < Date.now()) {
            const params = new URLSearchParams({
                refresh_token: auth.refresh_token,
            })

            const response = await janitor.get(`/refresh-token?${params}`)

            const expiration = getExpiration(response.data.expires_in)

            return { ...response.data, expiration }
        }
    }

    return auth
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
    const response = await spotify.get('/me')

    return response.data
}

// Request and return the user's saved playlists
export const getPlaylists = async (page_offset) => {
    const per_page = 6
    const params = new URLSearchParams({
        offset: page_offset * per_page,
        limit: per_page,
    })
    const response = await spotify.get(`/me/playlists?${params}`)

    return response.data
}

// Return response data from the provided url
// Assumes url is for the Spotify API
export const getUrl = async (url) => {
    const response = await spotify.get(url)

    return response.data
}
