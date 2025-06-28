import { useState, useEffect } from 'react'
import { useMonsters } from '../context/MonstersContext'
import { runBattle, type BattleResult, type RoundLog } from '../logic/battle'
import type { Monster } from '../types'
import { motion } from 'framer-motion'

interface BarProps { hp: number; maxHp: number }
const AnimatedHealthBar = ({ hp, maxHp }: BarProps) => {
  const pct = Math.max(0, (hp / maxHp) * 100)
  return (
    <div className="w-48 bg-gray-700 rounded h-4 overflow-hidden mb-2">
      <motion.div
        className="h-full bg-gradient-to-r from-green-500 to-lime-500"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  )
}

const TurnIndicator = ({ attacker }: { attacker: Monster | null }) => {
  if (!attacker) return null
  return (
    <motion.div
      key={attacker.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-white font-display text-xl"
    >
      {attacker.name} ataca!
    </motion.div>
  )
}

const FloatingDamage = ({ value }: { value: number | null }) => {
  if (value == null) return null
  return (
    <motion.div
      key={Math.random()}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -40 }}
      transition={{ duration: 1 }}
      className="absolute text-red-500 font-bold text-lg"
    >
      -{value}
    </motion.div>
  )
}

interface TimelineProps { rounds: RoundLog[]; monsters: Monster[] }
const BattleTimeline = ({ rounds, monsters }: TimelineProps) => (
  <ul className="space-y-2">
    {rounds.map((r, i) => {
      const attacker = monsters.find((m) => m.id === r.attackerId)
      const defender = monsters.find((m) => m.id === r.defenderId)
      return (
        <li
          key={i}
          className="flex items-center gap-2 bg-gray-800/70 rounded p-2"
        >
          <img src={attacker?.image_url} alt="a" className="w-6 h-6" />
          <span>⚔️</span>
          <img src={defender?.image_url} alt="d" className="w-6 h-6" />
          <span className="ml-auto text-sm text-amber-200">
            dano {r.damage} - HP {r.remainingHp}
          </span>
        </li>
      )
    })}
  </ul>
)

const VictoryScreen = ({ winner, onReset }: { winner: Monster; onReset: () => void }) => (
  <div className="mt-8 text-center space-y-4">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="text-3xl font-display text-yellow-400"
    >
      🏆 {winner.name} venceu!
    </motion.div>
    <button
      onClick={onReset}
      className="bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      Revanche
    </button>
  </div>
)

export default function BattlePage() {
  const { monsters } = useMonsters()
  const [firstId, setFirstId] = useState('')
  const [secondId, setSecondId] = useState('')
  const [result, setResult] = useState<BattleResult | null>(null)
  const [logs, setLogs] = useState<RoundLog[]>([])
  const [hp1, setHp1] = useState(0)
  const [hp2, setHp2] = useState(0)
  const [attacker, setAttacker] = useState<Monster | null>(null)
  const [damage, setDamage] = useState<number | null>(null)
  const [currentRound, setCurrentRound] = useState(0)
  const [winner, setWinner] = useState<Monster | null>(null)
  const [paused, setPaused] = useState(false)

  const first = monsters.find((m) => m.id === firstId)
  const second = monsters.find((m) => m.id === secondId)

  const resetState = () => {
    setResult(null)
    setLogs([])
    setHp1(0)
    setHp2(0)
    setAttacker(null)
    setDamage(null)
    setCurrentRound(0)
    setWinner(null)
    setPaused(false)
  }

  const handleBattle = () => {
    if (!first || !second || first.id === second.id) return
    const r = runBattle(first, second)
    setResult(r)
    setHp1(first.hp)
    setHp2(second.hp)
    setLogs([])
    setCurrentRound(0)
    setWinner(null)
  }

  useEffect(() => {
    if (!result || winner || paused) return
    if (currentRound >= result.rounds.length) {
      if (result.winner) setWinner(result.winner)
      return
    }
    const round = result.rounds[currentRound]
    setAttacker(monsters.find((m) => m.id === round.attackerId) || null)
    setDamage(round.damage)
    setLogs((prev) => [...prev, round])
    if (round.defenderId === firstId) setHp1(round.remainingHp)
    else setHp2(round.remainingHp)
    const t = setTimeout(() => setCurrentRound((c) => c + 1), 1500)
    return () => clearTimeout(t)
  }, [result, currentRound, paused, winner, firstId, monsters])

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
      <div className="flex gap-2">
        <button
          className="bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg disabled:opacity-50"
          disabled={!firstId || !secondId || firstId === secondId}
          onClick={() => {
            resetState()
            handleBattle()
          }}
        >
          Iniciar Batalha!
        </button>
        {result && !winner && (
          <button
            onClick={() => setPaused((p) => !p)}
            className="bg-gray-700 text-white px-4 rounded"
          >
            {paused ? 'Continuar' : 'Pausar'}
          </button>
        )}
      </div>

      {result && (
        <div className="arena bg-cover rounded-xl p-8 relative">
          <div className="flex justify-between items-center">
            {/* Monstro 1 */}
            {first && (
              <div className={`fighter ${attacker?.id === first.id ? 'animate-attack' : ''} relative`}>
                <AnimatedHealthBar hp={hp1} maxHp={first.hp} />
                <img src={first.image_url} className="monster-sprite" />
                <div className="monster-name text-white mt-2">{first.name}</div>
                {attacker?.id !== first.id && damage && logs[logs.length - 1]?.defenderId === first.id && (
                  <FloatingDamage value={damage} />
                )}
              </div>
            )}

            {/* Elemento central */}
            <div className="vs-divider">VS</div>

            {/* Monstro 2 */}
            {second && (
              <div className={`fighter ${attacker?.id === second.id ? 'animate-attack' : ''} relative`}>
                <AnimatedHealthBar hp={hp2} maxHp={second.hp} />
                <img src={second.image_url} className="monster-sprite" />
                <div className="monster-name text-white mt-2">{second.name}</div>
                {attacker?.id !== second.id && damage && logs[logs.length - 1]?.defenderId === second.id && (
                  <FloatingDamage value={damage} />
                )}
              </div>
            )}
          </div>

          <div className="battle-log mt-8">
            <TurnIndicator attacker={attacker} />
            <BattleTimeline rounds={logs} monsters={monsters} />
          </div>

          {winner && <VictoryScreen winner={winner} onReset={resetState} />}
        </div>
      )}
    </div>
  )
}