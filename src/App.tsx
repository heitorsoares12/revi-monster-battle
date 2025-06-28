import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import MonsterManagementPage from './pages/MonsterManagementPage'
import BattlePage from './pages/BattlePage'
import { MonstersProvider } from './context/MonstersContext'

export default function App() {
  return (
    <MonstersProvider>
      <BrowserRouter>
        <nav className="p-4 flex gap-4 bg-gray-800 text-white">
          <Link to="/">Monsters</Link>
          <Link to="/battle">Battle</Link>
        </nav>
        <Routes>
          <Route path="/" element={<MonsterManagementPage />} />
          <Route path="/battle" element={<BattlePage />} />
        </Routes>
      </BrowserRouter>
    </MonstersProvider>
  )
}
