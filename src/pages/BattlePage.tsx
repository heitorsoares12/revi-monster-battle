import { useState } from 'react'
import { useMonsters } from '../context/MonstersContext'
import { runBattle, type BattleResult } from '../logic/battle'

export default function BattlePage() {
  const { monsters } = useMonsters()
  const [firstId, setFirstId] = useState<string>('')
  const [secondId, setSecondId] = useState<string>('')
  const [result, setResult] = useState<BattleResult | null>(null)

  const handleBattle = () => {
    const m1 = monsters.find((m) => m.id === firstId)
    const m2 = monsters.find((m) => m.id === secondId)
    if (!m1 || !m2 || m1.id === m2.id) return
    setResult(runBattle(m1, m2))
  }

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="border p-2"
          value={firstId}
          onChange={(e) => setFirstId(e.target.value)}
        >
          <option value="">Select first monster</option>
          {monsters.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          className="border p-2"
          value={secondId}
          onChange={(e) => setSecondId(e.target.value)}
        >
          <option value="">Select second monster</option>
          {monsters.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      <button
        className="bg-purple-500 text-white p-2 rounded disabled:opacity-50"
        disabled={!firstId || !secondId || firstId === secondId}
        onClick={handleBattle}
      >
        Battle!
      </button>
      {result && (
        <div>
          <h3 className="font-bold">Winner: {result.winner ? result.winner.name : 'Draw'}</h3>
          <ul className="list-disc ml-6">
            {result.rounds.map((r, i) => (
              <li key={i}>
                {r.attackerId} hit {r.defenderId} for {r.damage} (HP left: {r.remainingHp})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
