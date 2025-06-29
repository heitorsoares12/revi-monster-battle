import type { Monster } from '../types/monster.types'

export interface RoundLog {
  attackerId: string
  defenderId: string
  damage: number
  remainingHp: number
}

export interface BattleResult {
  winner: Monster | null
  rounds: RoundLog[]
  duration: number
}

export function runBattle(monster1: Monster, monster2: Monster): BattleResult {
  const m1: Monster = JSON.parse(JSON.stringify(monster1))
  const m2: Monster = JSON.parse(JSON.stringify(monster2))

  const rounds: RoundLog[] = []
  const start = performance.now()

  let attacker = m1
  let defender = m2

  if (m1.speed !== m2.speed) {
    attacker = m1.speed > m2.speed ? m1 : m2
    defender = attacker === m1 ? m2 : m1
  } else if (m1.attack !== m2.attack) {
    attacker = m1.attack > m2.attack ? m1 : m2
    defender = attacker === m1 ? m2 : m1
  }

  while (m1.hp > 0 && m2.hp > 0) {
    const damage = Math.max(1, attacker.attack - defender.defense)
    defender.hp = Math.max(0, defender.hp - damage)
    rounds.push({
      attackerId: attacker.id,
      defenderId: defender.id,
      damage,
      remainingHp: defender.hp,
    })
    if (defender.hp <= 0) break
    ;[attacker, defender] = [defender, attacker]
  }

  const duration = performance.now() - start
  const winner = m1.hp === 0 && m2.hp === 0 ? null : m1.hp > 0 ? m1 : m2
  return { winner, rounds, duration }
}
