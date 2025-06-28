import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import MonsterManagementPage from './pages/MonsterManagementPage'
import BattlePage from './pages/BattlePage'
import { MonstersProvider } from './context/MonstersContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <MonstersProvider>
      <BrowserRouter>
        <nav className="p-4 flex gap-4 bg-dark text-white font-display text-xl">
          <Link to="/">Monstros</Link>
          <Link to="/battle">Batalha</Link>
        </nav>
        <Routes>
          <Route path="/" element={<MonsterManagementPage />} />
          <Route path="/battle" element={<BattlePage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </MonstersProvider>
  )
}
