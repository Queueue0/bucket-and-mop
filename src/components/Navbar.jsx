import { Link } from 'react-router-dom'
import { useContext } from 'react'
import SpotifyContext from '../context/SpotifyContext'
import { authenticate, clearAuth, getUser } from '../context/SpotifyActions'

import LoginButton from './LoginButton'

function Navbar() {
    const { user, dispatch } = useContext(SpotifyContext)

    const login = async () => {
        const auth = await authenticate()
        if (auth) {
            dispatch({ type: 'SET_TOKEN_REFRESH', payload: auth })

            const current_user = await getUser()

            dispatch({ type: 'SET_USER', payload: { user: current_user } })
        } else {
            dispatch({ type: 'SET_AUTH_ERROR' })
            setTimeout(() => {
                dispatch({ type: 'CLEAR_AUTH_ERROR' })
            }, 10000)
        }
    }

    const logout = (e) => {
        e.preventDefault()
        clearAuth()
        dispatch({ type: 'CLEAR_AUTH' })
    }

    return (
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark mb-3'>
            <div className='container-fluid'>
                <Link to='/' className='navbar-brand'>
                    Bucket & Mop
                </Link>

                {JSON.stringify(user) === '{}' ? (
                    <LoginButton />
                ) : (
                    <div className='dropdown'>
                        <button
                            className='btn btn-outline-primary dropdown-toggle'
                            type='button'
                            id='userDropdownButton'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                        >
                            <img
                                src={user.images[0].url}
                                alt={`{user.display_name}'s avatar`}
                                className='nav-profile-img rounded-circle me-1'
                            />{' '}
                            {user.display_name}
                        </button>
                        <ul
                            className='dropdown-menu dropdown-menu-end'
                            aria-labelledby='userDropdownButton'
                        >
                            <li>
                                <a
                                    href='/'
                                    className='dropdown-item'
                                    onClick={logout}
                                >
                                    Sign Out
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}
export default Navbar
