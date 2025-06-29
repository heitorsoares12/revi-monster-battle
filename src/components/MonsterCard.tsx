import { memo, useState } from "react";
import { motion } from "framer-motion";
import { FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import type { Monster } from "../types/monster.types";

interface MonsterCardProps {
  monster: Monster;
  onDelete: (id: string) => void;
}

function MonsterCardComponent({ monster, onDelete }: MonsterCardProps) {
  const [confirm, setConfirm] = useState(false);
  const clamp = (v: number) => Math.min(100, v);
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-600 rounded-xl p-4 shadow-lg hover:shadow-red-500/30 transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] before:from-red-500/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none flex flex-col items-center">
      <img
        src={monster.image_url}
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src = "https://via.placeholder.com/100";
        }}
        alt={monster.name}
        className="w-24 h-24 object-cover mb-2 rounded-full border border-purple-600"
      />
      <h3 className="font-bold mb-2 text-white font-display text-lg">
        {monster.name}
      </h3>
      <div className="w-full space-y-2">
        <div>
          <span className="text-red-400 text-xs">Ataque {monster.attack}</span>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-red-600 h-2 rounded"
              style={{ width: `${clamp(monster.attack)}%` }}
            />
          </div>
        </div>
        <div>
          <span className="text-blue-400 text-xs">
            Defesa {monster.defense}
          </span>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${clamp(monster.defense)}%` }}
            />
          </div>
        </div>
        <div>
          <span className="text-purple-400 text-xs">
            Velocidade {monster.speed}
          </span>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-purple-500 h-2 rounded"
              style={{ width: `${clamp(monster.speed)}%` }}
            />
          </div>
        </div>
        <div>
          <span className="text-green-400 text-xs">Vida {monster.hp}</span>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${clamp(monster.hp)}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 h-10 pointer-events-auto">
        {!confirm ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-red-700 to-red-800 text-white w-full p-3 rounded-full shadow-lg flex items-center justify-center gap-2"
            onClick={() => setConfirm(true)}
            aria-label={`Excluir ${monster.name}`}
          >
            <FaTrashAlt className="text-lg" />
            <span>Excluir</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex gap-2 pt-1"
          >
            <button
              className="bg-gradient-to-r from-red-600 to-red-800 text-white flex-1 p-3 rounded-full shadow flex items-center justify-center gap-2"
              onClick={() => {
                onDelete(monster.id)
                toast.success(`${monster.name} excluído!`)
              }}
              aria-label="Confirmar exclusão"
            >
              <FaCheck className="text-lg" />
            </button>
            <button
              className="bg-gradient-to-r from-gray-600 to-gray-800 text-white flex-1 p-3 rounded-full shadow flex items-center justify-center gap-2"
              onClick={() => setConfirm(false)}
              aria-label="Cancelar exclusão"
            >
              <FaTimes className="text-lg" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export const MonsterCard = memo(MonsterCardComponent);
