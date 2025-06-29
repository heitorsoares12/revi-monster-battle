import MonsterForm from '../components/MonsterForm'
import MonsterList from '../components/MonsterList'
import { useMonsters } from '../context/MonstersContext'
import { Link } from 'react-router-dom'
import { GiBroadsword } from 'react-icons/gi'

export default function MonsterManagementPage() {
  const { monsters, addMonster, deleteMonster } = useMonsters()

  const disabled = monsters.length < 2

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-display text-white">Gerenciamento de Monstros</h1>
      <div className="max-w-2xl mx-auto">
        <MonsterForm onAddMonster={addMonster} />
      </div>
      <div className="flex items-center">
        <Link
          to="/battle"
          onClick={(e) => disabled && e.preventDefault()}
          className={`ml-auto flex items-center gap-1 bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg shadow-lg ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <GiBroadsword /> Ir para Batalha
        </Link>
      </div>
      <MonsterList monsters={monsters} onDelete={deleteMonster} />
    </div>
  )
}
