import { useEffect } from 'react'
import { getAuth } from '../context/SpotifyActions'

function Callback() {
    useEffect(() => {
        async function fetchAuth() {
            const params = new Proxy(
                new URLSearchParams(window.location.search),
                {
                    get: (searchParams, prop) => searchParams.get(prop),
                }
            )

            const code = params.code
            //console.log(code)

            const auth = await getAuth(code)

            localStorage.setItem('sp_auth', JSON.stringify(auth))
            window.close()
        }
        fetchAuth()
    }, [])

    return <div>Redirecting...</div>
}

export default Callback
