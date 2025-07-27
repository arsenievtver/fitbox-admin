import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Моки
const mockUsers = Array.from({ length: 10 }, (_, i) => ({
	id: i,
	name: `Боец #${i + 1}`,
	strength: Math.floor(Math.random() * 100),
	tempo: Math.floor(Math.random() * 100),
	energy: Math.floor(Math.random() * 100),
}));

const DisplayPage = () => {
	const [players, setPlayers] = useState([]);

	useEffect(() => {
		const sorted = [...mockUsers].sort((a, b) => b.energy - a.energy);
		setPlayers(sorted);
	}, []);

	return (
		<div className="w-full h-screen bg-black text-white p-8">
			<h1 className="text-5xl font-bold text-center mb-10 text-yellow-400">
				🏆 Рейтинг тренировки
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				<AnimatePresence>
					{players.map((p, i) => (
						<motion.div
							key={p.id}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.1 }}
							className={`relative p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm ${
								i === 0
									? "bg-yellow-500/30 border-yellow-400 animate-pulse"
									: i < 3
										? "bg-white/10 border-blue-400"
										: "bg-white/5"
							}`}
						>
							{/* Вспышка победителя */}
							{i === 0 && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: [0, 0.7, 0] }}
									transition={{ repeat: Infinity, duration: 2 }}
									className="absolute inset-0 rounded-2xl bg-yellow-400/30 pointer-events-none"
								/>
							)}

							<h2 className="text-2xl font-bold text-yellow-300 mb-2 z-10 relative">
								#{i + 1} — {p.name}
							</h2>

							<Stat label="Энергия" value={p.energy} color="bg-green-500" />
							<Stat label="Сила" value={p.strength} color="bg-red-500" />
							<Stat label="Темп" value={p.tempo} color="bg-blue-500" />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
};

const Stat = ({ label, value, color }) => (
	<div className="mb-3">
		<div className="text-sm text-gray-300">
			{label}: <span className="text-white">{value}%</span>
		</div>
		<div className="w-full bg-white/20 rounded h-3 overflow-hidden">
			<motion.div
				className={`h-full ${color}`}
				initial={{ width: 0 }}
				animate={{ width: `${value}%` }}
				transition={{ duration: 1.5 }}
			/>
		</div>
	</div>
);

export default DisplayPage;
