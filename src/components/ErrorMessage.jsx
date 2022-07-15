import { useContext } from 'react'
import SpotifyContext from '../context/SpotifyContext'

function ErrorMessage() {
    const { error_message } = useContext(SpotifyContext)

    return (
        <div className='alert alert-danger'>
            <strong>Oops!</strong> {error_message}
        </div>
    )
}
export default ErrorMessage
