import type { Monster } from '../types/monster.types'
import { MonsterCard } from './MonsterCard'

interface Props {
  monsters: Monster[]
  onDelete: (id: string) => void
}

export default function MonsterList({ monsters, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {monsters.map((m) => (
        <MonsterCard key={m.id} monster={m} onDelete={onDelete} />
      ))}
    </div>
  )
}
