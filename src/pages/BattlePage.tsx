import { useState } from 'react'
import { useMonsters } from '../context/MonstersContext'
import { runBattle, type BattleResult } from '../logic/battle'
import { motion } from 'framer-motion'

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
          className="bg-gray-700 border border-purple-500 text-white rounded-lg p-2"
          value={firstId}
          onChange={(e) => setFirstId(e.target.value)}
        >
          <option value="">Selecione o primeiro monstro</option>
          {monsters.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          className="bg-gray-700 border border-purple-500 text-white rounded-lg p-2"
          value={secondId}
          onChange={(e) => setSecondId(e.target.value)}
        >
          <option value="">Selecione o segundo monstro</option>
          {monsters.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      <button
        className="bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50"
        disabled={!firstId || !secondId || firstId === secondId}
        onClick={handleBattle}
      >
        Iniciar Batalha!
      </button>
      {result && (
        <div className="space-y-4">
          <h3 className="text-xl font-display text-white">
            Vencedor: {result.winner ? result.winner.name : 'Empate'}
          </h3>
          <div className="flex justify-around">
            <motion.div
              className="text-center"
              animate={{ x: 20 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <p className="text-white font-bold">{monsters.find((m) => m.id === firstId)?.name}</p>
              <div className="w-32 bg-gray-700 rounded h-3">
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{ width: `${Math.max(0, result.rounds.filter(r => r.defenderId === firstId).slice(-1)[0]?.remainingHp ?? monsters.find(m=>m.id===firstId)?.hp)}%` }}
                />
              </div>
            </motion.div>
            <motion.div
              className="text-center"
              animate={{ x: -20 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <p className="text-white font-bold">{monsters.find((m) => m.id === secondId)?.name}</p>
              <div className="w-32 bg-gray-700 rounded h-3">
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{ width: `${Math.max(0, result.rounds.filter(r => r.defenderId === secondId).slice(-1)[0]?.remainingHp ?? monsters.find(m=>m.id===secondId)?.hp)}%` }}
                />
              </div>
            </motion.div>
          </div>
          <div className="bg-amber-50/10 border border-amber-900/30 rounded-lg p-4 font-serif text-amber-200">
            <ul className="list-disc ml-6">
              {result.rounds.map((r, i) => (
                <li key={i}>
                  {r.attackerId} acertou {r.defenderId} causando {r.damage} (HP restante: {r.remainingHp})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
