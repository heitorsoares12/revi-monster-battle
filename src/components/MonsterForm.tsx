import { useForm } from 'react-hook-form'
import type { Monster } from '../types/monster.types'
import { v4 as uuidv4 } from 'uuid'

interface MonsterFormProps {
  onAddMonster: (monster: Monster) => void
}

interface FormValues {
  name: string
  attack: number
  defense: number
  speed: number
  hp: number
  image_url: string
}

const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i

export default function MonsterForm({ onAddMonster }: MonsterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const onSubmit = handleSubmit((data) => {
    const monster: Monster = { id: uuidv4(), ...data }
    onAddMonster(monster)
    reset()
  })

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col">
        <label>Name</label>
        <input
          className="border p-2"
          {...register('name', { required: true })}
        />
        {errors.name && <span className="text-red-500">Required</span>}
      </div>
      <div className="flex flex-col">
        <label>Attack</label>
        <input
          type="number"
          className="border p-2"
          {...register('attack', { required: true, valueAsNumber: true, min: 1 })}
        />
        {errors.attack && <span className="text-red-500">Attack &gt; 0</span>}
      </div>
      <div className="flex flex-col">
        <label>Defense</label>
        <input
          type="number"
          className="border p-2"
          {...register('defense', { required: true, valueAsNumber: true, min: 1 })}
        />
        {errors.defense && <span className="text-red-500">Defense &gt; 0</span>}
      </div>
      <div className="flex flex-col">
        <label>Speed</label>
        <input
          type="number"
          className="border p-2"
          {...register('speed', { required: true, valueAsNumber: true, min: 1 })}
        />
        {errors.speed && <span className="text-red-500">Speed &gt; 0</span>}
      </div>
      <div className="flex flex-col">
        <label>HP</label>
        <input
          type="number"
          className="border p-2"
          {...register('hp', { required: true, valueAsNumber: true, min: 1 })}
        />
        {errors.hp && <span className="text-red-500">HP &gt; 0</span>}
      </div>
      <div className="flex flex-col md:col-span-2">
        <label>Image URL</label>
        <input
          className="border p-2"
          {...register('image_url', {
            required: true,
            pattern: urlRegex,
          })}
        />
        {errors.image_url && <span className="text-red-500">Invalid URL</span>}
      </div>
      <button
        disabled={isSubmitting}
        className="md:col-span-2 bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        Add Monster
      </button>
    </form>
  )
}
