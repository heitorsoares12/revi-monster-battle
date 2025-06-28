import { memo } from 'react'
import type { Monster } from '../types/monster.types'

interface MonsterCardProps {
  monster: Monster
  onDelete: (id: string) => void
}

function MonsterCardComponent({ monster, onDelete }: MonsterCardProps) {
  return (
    <div className="border rounded p-4 flex flex-col items-center hover:scale-105 transition-transform">
      <img
        src={monster.image_url}
        onError={(e) => {
          const target = e.currentTarget
          target.onerror = null
          target.src = 'https://via.placeholder.com/100'
        }}
        alt={monster.name}
        className="w-24 h-24 object-cover mb-2"
      />
      <h3 className="font-bold mb-2">{monster.name}</h3>
      <div className="grid grid-cols-2 gap-1 text-sm">
        <span className="text-red-500">ATK: {monster.attack}</span>
        <span className="text-blue-500">DEF: {monster.defense}</span>
        <span className="text-purple-500">SPD: {monster.speed}</span>
        <span className="text-green-500">HP: {monster.hp}</span>
      </div>
      <button
        onClick={() => onDelete(monster.id)}
        className="mt-2 bg-red-600 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  )
}

export const MonsterCard = memo(MonsterCardComponent)
