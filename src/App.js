import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { SpotifyProvider } from './context/SpotifyContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Callback from './components/Callback'

function App() {
    return (
        <SpotifyProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/callback' element={<Callback />} />
                </Routes>
            </Router>
        </SpotifyProvider>
    )
}

export default App
