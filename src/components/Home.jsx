import { useContext } from 'react'
import { authenticate } from '../context/SpotifyActions'
import SpotifyContext from '../context/SpotifyContext'

import ErrorMessage from './ErrorMessage'

function Home() {
    const { auth_error, dispatch } = useContext(SpotifyContext)

    const onClick = async (e) => {
        e.preventDefault()
        const auth = await authenticate()
        dispatch({
            type: 'SET_TOKEN_REFRESH',
            payload: auth,
        })
    }

    return <div className='container'>{auth_error && <ErrorMessage />}</div>
}
export default Home
