import type { Monster } from '../types'

interface Props {
  monster: Monster
  initialHp: number
  finalHp: number
  isWinner: boolean
}

export default function MonsterResultCard({ monster, initialHp, finalHp, isWinner }: Props) {
  const pct = (finalHp / initialHp) * 100
  return (
    <div
      className={`border-2 ${isWinner ? 'border-yellow-400 shadow-glow' : 'border-gray-600'} rounded-xl p-4 text-center`}
    >
      <img src={monster.image_url} className="w-32 h-32 mx-auto object-cover" />
      <h3 className="text-xl font-bold mt-2">{monster.name}</h3>
      <div className="mt-3">
        <div className="flex justify-between text-sm">
          <span>HP Inicial: {initialHp}</span>
          <span>HP Final: {finalHp}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-red-500 to-green-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {isWinner && <div className="mt-2 text-yellow-400 font-bold">VENCEDOR!</div>}
    </div>
  )
}