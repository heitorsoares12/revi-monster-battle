import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MonsterManagementPage from './pages/MonsterManagementPage'
import BattlePage from './pages/BattlePage'
import { MonstersProvider } from './context/MonstersContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <MonstersProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MonsterManagementPage />} />
          <Route path="/battle" element={<BattlePage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </MonstersProvider>
  )
}
