import type { Monster } from '../types/monster.types'
import { MonsterCard } from './MonsterCard'

interface Props {
  monsters: Monster[]
  onDelete: (id: string) => void
}

export default function MonsterList({ monsters, onDelete }: Props) {
  if (monsters.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {monsters.map((m) => (
        <MonsterCard key={m.id} monster={m} onDelete={onDelete} />
      ))}
    </div>
  )
}
