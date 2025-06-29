import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMonsters } from "../context/MonstersContext";
import { runBattle, type BattleResult, type RoundLog } from "../logic/battle";
import type { Monster } from "../types";
import MonsterResultCard from "../components/MonsterResultCard";
import { motion } from "framer-motion";
import { FaHome, FaArrowDown } from "react-icons/fa";

interface BarProps {
  hp: number;
  maxHp: number;
}
const AnimatedHealthBar = ({ hp, maxHp }: BarProps) => {
  const pct = Math.max(0, (hp / maxHp) * 100);
  return (
    <div className="w-48 bg-gray-700 rounded h-4 overflow-hidden mb-2">
      <motion.div
        className="h-full bg-gradient-to-r from-green-500 to-lime-500"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
};

const TurnIndicator = ({ attacker }: { attacker: Monster | null }) => {
  if (!attacker) return null;
  return (
    <motion.div
      key={attacker.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-white font-display text-xl"
    >
      {attacker.name} ataca!
    </motion.div>
  );
};

const FloatingDamage = ({ value }: { value: number | null }) => {
  if (value == null) return null;
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
  );
};

interface TimelineProps {
  rounds: RoundLog[];
  monsters: Monster[];
  endRef?: React.RefObject<HTMLDivElement | null>;
}
const BattleTimeline = ({ rounds, monsters, endRef }: TimelineProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-gray-800/80">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="py-2">Round</th>
          <th>Atacante</th>
          <th>Dano</th>
          <th>Defensor</th>
          <th>HP Restante</th>
        </tr>
      </thead>
      <tbody>
        {rounds.map((r, i) => {
          const attacker = monsters.find((m) => m.id === r.attackerId);
          const defender = monsters.find((m) => m.id === r.defenderId);
          return (
            <tr
              key={i}
              className="border-b border-gray-700/50 hover:bg-gray-700/30"
            >
              <td className="py-2 text-center">{i + 1}</td>
              <td className="flex items-center gap-2">
                <img
                  src={attacker?.image_url}
                  className="w-8 h-8 rounded-full"
                />
                {attacker?.name}
              </td>
              <td className="text-red-400 font-bold">{r.damage}</td>
              <td className="flex items-center gap-2">
                <img
                  src={defender?.image_url}
                  className="w-8 h-8 rounded-full"
                />
                {defender?.name}
              </td>
              <td>{r.remainingHp}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
    <div ref={endRef} />
  </div>
);

const VictoryScreen = ({ winner }: { winner: Monster }) => {
  return (
    <div className="mt-8 text-center space-y-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-3xl font-display text-yellow-400"
      >
        🏆 {winner.name} venceu!
      </motion.div>
    </div>
  );
};

export default function BattlePage() {
  const navigate = useNavigate();
  const { monsters } = useMonsters();
  const [firstId, setFirstId] = useState("");
  const [secondId, setSecondId] = useState("");
  const [result, setResult] = useState<BattleResult | null>(null);
  const [logs, setLogs] = useState<RoundLog[]>([]);
  const [hp1, setHp1] = useState(0);
  const [hp2, setHp2] = useState(0);
  const [attacker, setAttacker] = useState<Monster | null>(null);
  const [damage, setDamage] = useState<number | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [winner, setWinner] = useState<Monster | null>(null);
  const [paused, setPaused] = useState(false);
  const [viewMode, setViewMode] = useState<"live" | "summary">("summary");
  const [viewLocked, setViewLocked] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const isAtBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 50;
    setAutoScroll(isAtBottom);
  }, []);

  useEffect(() => {
    if (viewMode === "live" && autoScroll && !winner) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, viewMode, winner, autoScroll]);

  const first = monsters.find((m) => m.id === firstId);
  const second = monsters.find((m) => m.id === secondId);

  const resetState = () => {
    setResult(null);
    setLogs([]);
    setHp1(0);
    setHp2(0);
    setAttacker(null);
    setDamage(null);
    setCurrentRound(0);
    setWinner(null);
    setPaused(false);
    setViewLocked(false);
    setAutoScroll(true);
  };

  const handleBattle = () => {
    if (!first || !second || first.id === second.id) return;
    setViewLocked(true);
    const r = runBattle(first, second);
    setResult(r);
    setHp1(first.hp);
    setHp2(second.hp);
    if (viewMode === "summary") {
      setLogs(r.rounds);
      setCurrentRound(r.rounds.length);
      let f1 = first.hp;
      let f2 = second.hp;
      for (const rd of r.rounds) {
        if (rd.defenderId === first.id) f1 = rd.remainingHp;
        if (rd.defenderId === second.id) f2 = rd.remainingHp;
      }
      setHp1(f1);
      setHp2(f2);
      setWinner(r.winner);
      setViewLocked(false);
    } else {
      setLogs([]);
      setCurrentRound(0);
      setWinner(null);
    }
  };

  useEffect(() => {
    if (viewMode !== "live") return;
    if (!result || winner || paused) return;
    if (currentRound >= result.rounds.length) {
      if (result.winner) setWinner(result.winner);
      setViewLocked(false);
      return;
    }
    const round = result.rounds[currentRound];
    setAttacker(monsters.find((m) => m.id === round.attackerId) || null);
    setDamage(round.damage);
    setLogs((prev) => [...prev, round]);
    if (round.defenderId === firstId) setHp1(round.remainingHp);
    else setHp2(round.remainingHp);
    const t = setTimeout(() => setCurrentRound((c) => c + 1), 1500);
    return () => clearTimeout(t);
  }, [result, currentRound, paused, winner, firstId, monsters, viewMode]);

  return (
    <>
      <div className="p-4 space-y-4 max-w-3xl mx-auto">
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
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            disabled={viewLocked}
            className={`px-4 py-1 rounded-r-lg ${
              viewMode === "summary" ? "bg-purple-600" : "bg-gray-700"
            } ${viewLocked ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !viewLocked && setViewMode("summary")}
          >
            Resumida
          </button>
          <button
            disabled={viewLocked}
            className={`px-4 py-1 rounded-l-lg ${
              viewMode === "live" ? "bg-purple-600" : "bg-gray-700"
            } ${viewLocked ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !viewLocked && setViewMode("live")}
          >
            Ao Vivo
          </button>
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            className="bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg disabled:opacity-50"
            disabled={!firstId || !secondId || firstId === secondId}
            onClick={() => {
              resetState();
              handleBattle();
            }}
          >
            Iniciar Batalha!
          </button>
          {result && !winner && (
            <button
              onClick={() => setPaused((p) => !p)}
              className="bg-gray-700 text-white px-4 rounded"
            >
              {paused ? "Continuar" : "Pausar"}
            </button>
          )}
        </div>

        {result && (
          <div className="arena rounded-xl p-8 relative bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 border border-purple-700/50 before:absolute before:inset-0 before:bg-[url('/texture.png')] before:opacity-20">
            {result && (
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                  style={{
                    width: `${(currentRound / result.rounds.length) * 100}%`,
                  }}
                />
              </div>
            )}
            {viewMode === "live" && (
              <div className="flex justify-between items-center">
                {first && (
                  <div
                    className={`fighter ${
                      attacker?.id === first.id ? "animate-attack" : ""
                    } relative`}
                  >
                    <AnimatedHealthBar hp={hp1} maxHp={first.hp} />
                    <img src={first.image_url} className="monster-sprite" />
                    <div className="monster-name text-white mt-2">
                      {first.name}
                    </div>
                    {attacker?.id !== first.id &&
                      damage &&
                      logs[logs.length - 1]?.defenderId === first.id && (
                        <FloatingDamage value={damage} />
                      )}
                  </div>
                )}
                <div className="vs-divider">VS</div>
                {second && (
                  <div
                    className={`fighter ${
                      attacker?.id === second.id ? "animate-attack" : ""
                    } relative`}
                  >
                    <AnimatedHealthBar hp={hp2} maxHp={second.hp} />
                    <img src={second.image_url} className="monster-sprite" />
                    <div className="monster-name text-white mt-2">
                      {second.name}
                    </div>
                    {attacker?.id !== second.id &&
                      damage &&
                      logs[logs.length - 1]?.defenderId === second.id && (
                        <FloatingDamage value={damage} />
                      )}
                  </div>
                )}
              </div>
            )}
            {viewMode === "summary" && first && second && (
              <div className="flex justify-around items-center">
                <MonsterResultCard
                  monster={first}
                  initialHp={first.hp}
                  finalHp={hp1}
                  isWinner={winner?.id === first.id}
                />
                <div className="text-4xl text-yellow-400 mx-8">VS</div>
                <MonsterResultCard
                  monster={second}
                  initialHp={second.hp}
                  finalHp={hp2}
                  isWinner={winner?.id === second.id}
                />
              </div>
            )}
            <div className="battle-log mt-8">
              {viewMode === "live" && <TurnIndicator attacker={attacker} />}
              <div
                className="scroll-container overflow-y-auto"
                onScroll={handleScroll}
                ref={scrollContainerRef}
              >
                <BattleTimeline
                  rounds={logs}
                  monsters={monsters}
                  endRef={logEndRef}
                />
              </div>
              {!autoScroll && !winner && (
                <button
                  className="fixed right-6 bottom-24 bg-purple-600 text-white p-2 rounded-full shadow-lg"
                  onClick={() => {
                    logEndRef.current?.scrollIntoView();
                    setAutoScroll(true);
                  }}
                >
                  <FaArrowDown />
                </button>
              )}
            </div>
            {viewMode === "live" && winner && <VictoryScreen winner={winner} />}
            {viewMode === "summary" && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-800/50 p-3 rounded text-center">
                  <div className="text-2xl font-bold">
                    {result.rounds.length}
                  </div>
                  <div>Rodadas</div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {result.rounds.reduce((acc, r) => acc + r.damage, 0)}
                  </div>
                  <div>Dano Total</div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {result.rounds.filter((r) => r.damage > 20).length}
                  </div>
                  <div>Golpes Críticos</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
        >
          <FaHome /> Voltar ao Início
        </button>
      </div>
    </>
  );
}
