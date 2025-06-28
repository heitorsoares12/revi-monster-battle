import { memo } from 'react'
import type { Monster } from '../types/monster.types'

interface MonsterCardProps {
  monster: Monster
  onDelete: (id: string) => void
}

function MonsterCardComponent({ monster, onDelete }: MonsterCardProps) {
  const clamp = (v: number) => Math.min(100, v)
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-600 rounded-xl p-4 shadow-lg hover:shadow-red-500/30 transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] before:from-red-500/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity flex flex-col items-center">
      <img
        src={monster.image_url}
        onError={(e) => {
          const target = e.currentTarget
          target.onerror = null
          target.src = 'https://via.placeholder.com/100'
        }}
        alt={monster.name}
        className="w-24 h-24 object-cover mb-2 rounded-full border border-purple-600"
      />
      <h3 className="font-bold mb-2 text-white font-display text-lg">{monster.name}</h3>
      <div className="w-full space-y-2">
        <div>
          <span className="text-red-400 text-xs">ATK {monster.attack}</span>
          <div className="w-full bg-gray-700 rounded h-2">
            <div className="bg-red-600 h-2 rounded" style={{ width: `${clamp(monster.attack)}%` }} />
          </div>
        </div>
        <div>
          <span className="text-blue-400 text-xs">DEF {monster.defense}</span>
          <div className="w-full bg-gray-700 rounded h-2">
            <div className="bg-blue-500 h-2 rounded" style={{ width: `${clamp(monster.defense)}%` }} />
          </div>
        </div>
        <div>
          <span className="text-purple-400 text-xs">SPD {monster.speed}</span>
          <div className="w-full bg-gray-700 rounded h-2">
            <div className="bg-purple-500 h-2 rounded" style={{ width: `${clamp(monster.speed)}%` }} />
          </div>
        </div>
        <div>
          <span className="text-green-400 text-xs">HP {monster.hp}</span>
          <div className="w-full bg-gray-700 rounded h-2">
            <div className="bg-green-500 h-2 rounded" style={{ width: `${clamp(monster.hp)}%` }} />
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(monster.id)}
        className="mt-3 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-full text-sm"
      >
        Excluir
      </button>
    </div>
  )
}

export const MonsterCard = memo(MonsterCardComponent)
