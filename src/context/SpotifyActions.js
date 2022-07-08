import axios from 'axios'

const janitor = axios.create({
    baseURL: 'http://localhost:8000',
})

const spotify = axios.create({
    baseURL: 'https://api.spotify.com/v1',
})

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

export const getAuth = async (code) => {
    const params = new URLSearchParams({
        code: code,
    })

    const response = await janitor.get(`/get-token?${params}`)

    return { ...response.data }
}

export const authenticate = () => {
    const params = new URLSearchParams({
        client_id: '832851d76290442c838fa31e4622cc46',
        response_type: 'code',
        redirect_uri: 'http://localhost:3000/callback/',
        scope: 'playlist-read-private playlist-read-collaborative playlist-modify-public',
    })

    const authWindow = window.open(
        `https://accounts.spotify.com/authorize?${params}`,
        'Login with Spotify',
        'width=800,height=600'
    )

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

export const clearAuth = () => {
    localStorage.removeItem('sp_auth')
}

export const getUser = async () => {
    const response = await spotify.get('/me')

    return response.data
}
