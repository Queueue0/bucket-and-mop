import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth } from '../context/SpotifyActions'

function Callback() {
    const nav = useNavigate()

    useEffect(() => {
        async function fetchAuth() {
            // Get url params
            const params = new Proxy(
                new URLSearchParams(window.location.search),
                {
                    get: (searchParams, prop) => searchParams.get(prop),
                }
            )

            // Get code from url params
            const { code } = params

            // If the code exists
            if (code) {
                // Use code to get the tokens
                const auth = await getAuth(code)

                // Store tokens and other useful information in localStorage
                localStorage.setItem('sp_auth', JSON.stringify(auth))

                // Since this is meant to only appear in a popup, close the window right after
                window.close()
            } else {
                // If the code doesn't exist, redirect to home
                nav('/')
            }
        }
        fetchAuth()
    }, [])

    return <div>Redirecting...</div>
}

export default Callback
