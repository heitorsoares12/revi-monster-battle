import { useForm } from 'react-hook-form'
import type { Monster } from '../types/monster.types'
import { v4 as uuidv4 } from 'uuid'
import { FaSignature, FaFistRaised, FaShieldAlt, FaTachometerAlt, FaHeart, FaImage } from 'react-icons/fa'
import { toast } from 'react-toastify'

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
  } = useForm<FormValues>({ mode: 'onChange' })

  const onSubmit = handleSubmit((data) => {
    const monster: Monster = { id: uuidv4(), ...data }
    onAddMonster(monster)
    toast.success('Monstro cadastrado!')
    reset()
  })

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col">
        <label className="flex items-center gap-2 text-white">
          <FaSignature /> Nome
        </label>
        <input
          className="bg-gray-800 border-2 border-purple-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
          placeholder="Nome do monstro"
          {...register('name', { required: 'Obrigatório' })}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="flex items-center gap-2 text-white">
          <FaFistRaised /> Ataque
        </label>
        <input
          type="number"
          className="bg-gray-800 border-2 border-purple-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
          placeholder="Valor de ataque"
          {...register('attack', {
            required: 'Obrigatório',
            valueAsNumber: true,
            min: { value: 1, message: 'Deve ser > 0' },
          })}
        />
        {errors.attack && (
          <span className="text-red-500 text-sm">{errors.attack.message}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="flex items-center gap-2 text-white">
          <FaShieldAlt /> Defesa
        </label>
        <input
          type="number"
          className="bg-gray-800 border-2 border-purple-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
          placeholder="Valor de defesa"
          {...register('defense', {
            required: 'Obrigatório',
            valueAsNumber: true,
            min: { value: 1, message: 'Deve ser > 0' },
          })}
        />
        {errors.defense && (
          <span className="text-red-500 text-sm">{errors.defense.message}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="flex items-center gap-2 text-white">
          <FaTachometerAlt /> Velocidade
        </label>
        <input
          type="number"
          className="bg-gray-800 border-2 border-purple-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
          placeholder="Valor de velocidade"
          {...register('speed', {
            required: 'Obrigatório',
            valueAsNumber: true,
            min: { value: 1, message: 'Deve ser > 0' },
          })}
        />
        {errors.speed && (
          <span className="text-red-500 text-sm">{errors.speed.message}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="flex items-center gap-2 text-white">
          <FaHeart /> Vida
        </label>
        <input
          type="number"
          className="bg-gray-800 border-2 border-purple-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
          placeholder="Pontos de vida"
          {...register('hp', {
            required: 'Obrigatório',
            valueAsNumber: true,
            min: { value: 1, message: 'Deve ser > 0' },
          })}
        />
        {errors.hp && (
          <span className="text-red-500 text-sm">{errors.hp.message}</span>
        )}
      </div>
      <div className="flex flex-col md:col-span-2">
        <label className="flex items-center gap-2 text-white">
          <FaImage /> URL da imagem
        </label>
        <input
          className="bg-gray-800 border-2 border-purple-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
          placeholder="https://..."
          {...register('image_url', {
            required: 'Obrigatório',
            pattern: { value: urlRegex, message: 'URL inválida' },
          })}
        />
        {errors.image_url && (
          <span className="text-red-500 text-sm">
            {errors.image_url.message}
          </span>
        )}
      </div>
      <button
        disabled={isSubmitting}
        className="md:col-span-2 bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
      >
        Cadastrar Monstro
      </button>
    </form>
  )
}
