import MonsterForm from '../components/MonsterForm'
import MonsterList from '../components/MonsterList'
import { useMonsters } from '../context/MonstersContext'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GiBroadsword } from 'react-icons/gi'

export default function MonsterManagementPage() {
  const { monsters, addMonster, deleteMonster } = useMonsters()
  const [sort, setSort] = useState<'name' | 'attack' | 'speed'>('name')

  const sortedMonsters = useMemo(() => {
    return [...monsters].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'attack') return b.attack - a.attack
      return b.speed - a.speed
    })
  }, [monsters, sort])

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-display text-white">Gerenciamento de Monstros</h1>
      <MonsterForm onAddMonster={addMonster} />
      <div className="flex items-center gap-2">
        <label>Ordenar por:</label>
        <select
          className="bg-gray-700 border border-purple-500 text-white rounded-lg p-2"
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as 'name' | 'attack' | 'speed')
          }
        >
          <option value="name">Nome</option>
          <option value="attack">Ataque</option>
          <option value="speed">Velocidade</option>
        </select>
        <Link
          to="/battle"
          className="ml-auto flex items-center gap-1 bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          <GiBroadsword /> Ir para Batalha
        </Link>
      </div>
      <MonsterList monsters={sortedMonsters} onDelete={deleteMonster} />
    </div>
  )
}
