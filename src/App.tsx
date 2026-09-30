import { Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Privacy } from './pages/Privacy'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  )
}

export default App
