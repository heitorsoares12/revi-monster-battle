import MonsterForm from '../components/MonsterForm'
import MonsterList from '../components/MonsterList'
import { useMonsters } from '../context/MonstersContext'
import { useMemo, useState } from 'react'

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
      <MonsterForm onAddMonster={addMonster} />
      <div className="flex items-center gap-2">
        <label>Order by:</label>
        <select
          className="border p-1"
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as 'name' | 'attack' | 'speed')
          }
        >
          <option value="name">Name</option>
          <option value="attack">Attack</option>
          <option value="speed">Speed</option>
        </select>
      </div>
      <MonsterList monsters={sortedMonsters} onDelete={deleteMonster} />
    </div>
  )
}
