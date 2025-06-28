/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Monster } from '../types/monster.types'

interface MonstersContextValue {
  monsters: Monster[]
  addMonster: (monster: Monster) => void
  deleteMonster: (id: string) => void
}

const MonstersContext = createContext<MonstersContextValue | undefined>(undefined)

export function MonstersProvider({ children }: { children: ReactNode }) {
  const [monsters, setMonsters] = useState<Monster[]>([])

  const addMonster = (monster: Monster) => {
    setMonsters((prev) => [...prev, monster])
  }

  const deleteMonster = (id: string) => {
    if (confirm('Delete this monster?')) {
      setMonsters((prev) => prev.filter((m) => m.id !== id))
    }
  }

  return (
    <MonstersContext.Provider value={{ monsters, addMonster, deleteMonster }}>
      {children}
    </MonstersContext.Provider>
  )
}

export const useMonsters = () => {
  const ctx = useContext(MonstersContext)
  if (!ctx) throw new Error('useMonsters must be used within MonstersProvider')
  return ctx
}
