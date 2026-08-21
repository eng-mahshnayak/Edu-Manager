



//=============================== final running code==========================

// import React, { useState, useEffect, useRef } from 'react';

// const API_BASE = 'http://localhost:5000/api';

// type GameTab = 'number' | 'alphabet' | 'animal' | 'word';
// type GameMode = 'answer' | 'watch';

// const shuffleArray = <T,>(arr: T[]): T[] => {
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// };

// // ============================================================
// // 1. NUMBER MEMORY GAME
// // ============================================================
// const NumberMemoryGame: React.FC = () => {
//   const [digits, setDigits] = useState<2 | 4 | 6 | 8>(4);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [mode, setMode] = useState<GameMode>('answer');
//   const [number, setNumber] = useState('');
//   const [showNumber, setShowNumber] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);
//   const autoNextRef = useRef<number | null>(null);

//   const fetchNumber = async () => {
//     setLoading(true);
//     setStatus('idle');
//     setUserInput('');
//     setShowNumber(false);
//     try {
//       const res = await fetch(`${API_BASE}/number/${digits}`);
//       const data = await res.json();
//       setNumber(data.number);
//       setTimeout(() => setShowNumber(true), 200);
//     } catch {
//       setStatus('wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNumber();
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (autoNextRef.current) clearTimeout(autoNextRef.current);
//     };
//   }, [digits]);

//   useEffect(() => {
//     if (showNumber) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowNumber(false);
//         if (mode === 'watch') {
//           autoNextRef.current = setTimeout(() => fetchNumber(), 600);
//         }
//       }, displayTime * 1000);
//     }
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [showNumber, displayTime, mode]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;
//     try {
//       const res = await fetch(`${API_BASE}/verify`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ number, input: userInput.trim() }),
//       });
//       const data = await res.json();
//       if (data.correct) {
//         setStatus('correct');
//         setTimeout(() => fetchNumber(), 1000);
//       } else {
//         setStatus('wrong');
//       }
//     } catch {
//       setStatus('wrong');
//     }
//   };

//   const handleRetry = () => {
//     setStatus('idle');
//     setUserInput('');
//     fetchNumber();
//   };

//   const digitOptions = [2, 4, 6, 8] as const;
//   const timeOptions = [1, 2, 3, 5, 10];

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
//         <div className="flex gap-1 flex-wrap">
//           {digitOptions.map(d => (
//             <button
//               key={d}
//               onClick={() => setDigits(d)}
//               className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
//                 digits === d
//                   ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg scale-105'
//                   : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
//               }`}
//             >
//               {d}‑digit
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-300">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 outline-none"
//           >
//             {timeOptions.map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//         </div>
//       </div>

//       <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
//         <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
//         <button
//           onClick={() => setMode('answer')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'answer'
//               ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           ✍️ Answer
//         </button>
//         <button
//           onClick={() => setMode('watch')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'watch'
//               ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           👁️ Watch
//         </button>
//         {mode === 'watch' && (
//           <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>
//         )}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <>
//           {showNumber ? (
//             <div className="relative bg-gradient-to-br from-yellow-300/20 via-orange-300/20 to-pink-300/20 border-2 border-yellow-400/50 rounded-3xl p-10 text-center shadow-2xl shadow-yellow-500/20 backdrop-blur-sm transform transition-all duration-500 scale-100 animate-bounce-in">
//               <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/30 rounded-full blur-2xl"></div>
//               <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-pink-400/30 rounded-full blur-2xl"></div>
//               <div className="text-6xl font-mono font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
//                 {number}
//               </div>
//               <p className="text-sm text-yellow-200 mt-3 animate-pulse">🧠 Memorize this number!</p>
//             </div>
//           ) : mode === 'watch' ? (
//             <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next number loading...</div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 placeholder={`Type ${digits} digits`}
//                 disabled={status === 'correct'}
//                 className="w-full px-6 py-4 text-center text-2xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 disabled={status === 'correct'}
//                 className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-yellow-400/30 text-lg"
//               >
//                 ✅ Check Answer
//               </button>
//             </form>
//           )}

//           {status === 'correct' && (
//             <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
//               ✅ Correct! Next number...
//             </div>
//           )}
//           {status === 'wrong' && mode === 'answer' && (
//             <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
//               <p>❌ Oops! The number was <span className="font-mono font-bold text-white text-2xl">{number}</span></p>
//               <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
//                 🔄 Try Again
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // 2. ALPHABET MEMORY GAME
// // ============================================================
// const AlphabetMemoryGame: React.FC = () => {
//   const [length, setLength] = useState<5 | 8 | 10>(5);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [mode, setMode] = useState<GameMode>('answer');
//   const [sequence, setSequence] = useState('');
//   const [showSequence, setShowSequence] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);
//   const autoNextRef = useRef<number | null>(null);

//   const fetchLetters = async () => {
//     setLoading(true);
//     setStatus('idle');
//     setUserInput('');
//     setShowSequence(false);
//     try {
//       const res = await fetch(`${API_BASE}/alphabet/${length}`);
//       const data = await res.json();
//       setSequence(data.letters);
//       setTimeout(() => setShowSequence(true), 200);
//     } catch {
//       setStatus('wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLetters();
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (autoNextRef.current) clearTimeout(autoNextRef.current);
//     };
//   }, [length]);

//   useEffect(() => {
//     if (showSequence) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowSequence(false);
//         if (mode === 'watch') {
//           autoNextRef.current = setTimeout(() => fetchLetters(), 600);
//         }
//       }, displayTime * 1000);
//     }
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [showSequence, displayTime, mode]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;
//     try {
//       const res = await fetch(`${API_BASE}/verify`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ number: sequence, input: userInput.trim().toUpperCase() }),
//       });
//       const data = await res.json();
//       if (data.correct) {
//         setStatus('correct');
//         setTimeout(() => fetchLetters(), 1000);
//       } else {
//         setStatus('wrong');
//       }
//     } catch {
//       setStatus('wrong');
//     }
//   };

//   const handleRetry = () => {
//     setStatus('idle');
//     setUserInput('');
//     fetchLetters();
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
//         <div className="flex gap-1 flex-wrap">
//           {[5, 8, 10].map(len => (
//             <button
//               key={len}
//               onClick={() => setLength(len as typeof length)}
//               className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
//                 length === len
//                   ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-gray-900 shadow-lg scale-105'
//                   : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
//               }`}
//             >
//               {len} letters
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-300">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none"
//           >
//             {[1, 2, 3, 5, 10].map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//         </div>
//       </div>

//       <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
//         <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
//         <button
//           onClick={() => setMode('answer')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'answer'
//               ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           ✍️ Answer
//         </button>
//         <button
//           onClick={() => setMode('watch')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'watch'
//               ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           👁️ Watch
//         </button>
//         {mode === 'watch' && (
//           <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>
//         )}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <>
//           {showSequence ? (
//             <div className="relative bg-gradient-to-br from-cyan-300/20 via-blue-300/20 to-indigo-300/20 border-2 border-cyan-400/50 rounded-3xl p-10 text-center shadow-2xl shadow-cyan-500/20 backdrop-blur-sm animate-bounce-in">
//               <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-400/30 rounded-full blur-2xl"></div>
//               <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-400/30 rounded-full blur-2xl"></div>
//               <div className="text-5xl font-mono font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
//                 {sequence.split('').join('  ')}
//               </div>
//               <p className="text-sm text-cyan-200 mt-3 animate-pulse">🧠 Remember the order!</p>
//             </div>
//           ) : mode === 'watch' ? (
//             <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next set loading...</div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value.toUpperCase())}
//                 placeholder="Type letters in order"
//                 disabled={status === 'correct'}
//                 className="w-full px-6 py-4 text-center text-2xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 disabled={status === 'correct'}
//                 className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-cyan-400/30 text-lg"
//               >
//                 ✅ Check Answer
//               </button>
//             </form>
//           )}

//           {status === 'correct' && (
//             <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
//               ✅ Correct! Next set...
//             </div>
//           )}
//           {status === 'wrong' && mode === 'answer' && (
//             <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
//               <p>❌ Oops! The sequence was <span className="font-mono font-bold text-white text-2xl">{sequence}</span></p>
//               <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
//                 🔄 Try Again
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // 3. ANIMAL MEMORY GAME
// // ============================================================
// const AnimalMemoryGame: React.FC = () => {
//   const [count, setCount] = useState<5 | 8 | 10>(5);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [mode, setMode] = useState<GameMode>('answer');
//   const [animals, setAnimals] = useState<string[]>([]);
//   const [showAnimals, setShowAnimals] = useState(false);
//   const [question, setQuestion] = useState<{ position: number; options: string[]; correct: string } | null>(null);
//   const [score, setScore] = useState(0);
//   const [status, setStatus] = useState<'idle' | 'answered' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);
//   const autoNextRef = useRef<number | null>(null);

//   const fetchAnimals = async () => {
//     setLoading(true);
//     setStatus('idle');
//     setShowAnimals(false);
//     setQuestion(null);
//     try {
//       const res = await fetch(`${API_BASE}/animals/${count}`);
//       const data = await res.json();
//       setAnimals(data.animals);
//       setTimeout(() => setShowAnimals(true), 200);
//     } catch {
//       setStatus('wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnimals();
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (autoNextRef.current) clearTimeout(autoNextRef.current);
//     };
//   }, [count]);

//   useEffect(() => {
//     if (showAnimals) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowAnimals(false);
//         if (mode === 'watch') {
//           autoNextRef.current = setTimeout(() => fetchAnimals(), 600);
//         } else {
//           generateQuestion();
//         }
//       }, displayTime * 1000);
//     }
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [showAnimals, displayTime, mode]);

//   const generateQuestion = () => {
//     if (animals.length === 0) return;
//     const pos = Math.floor(Math.random() * animals.length);
//     const correct = animals[pos];
//     const pool = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🐣','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🪲','🪰','🪱','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔'];
//     const wrongOptions = shuffleArray(pool.filter(e => e !== correct)).slice(0, 3);
//     const options = shuffleArray([correct, ...wrongOptions]);
//     setQuestion({ position: pos + 1, options, correct });
//     setStatus('idle');
//   };

//   const handleAnswer = (selected: string) => {
//     if (!question) return;
//     if (selected === question.correct) {
//       setScore(prev => prev + 10);
//       setStatus('correct');
//     } else {
//       setStatus('wrong');
//     }
//     setStatus('answered');
//   };

//   const handleNext = () => fetchAnimals();

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
//         <div className="flex gap-1 flex-wrap">
//           {[5, 8, 10].map(n => (
//             <button
//               key={n}
//               onClick={() => setCount(n as typeof count)}
//               className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
//                 count === n
//                   ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 shadow-lg scale-105'
//                   : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
//               }`}
//             >
//               {n} animals
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-300">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/50 outline-none"
//           >
//             {[1, 2, 3, 5, 10].map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//           <span className="text-sm font-bold text-yellow-300">🏆 {score}</span>
//         </div>
//       </div>

//       <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
//         <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
//         <button
//           onClick={() => setMode('answer')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'answer'
//               ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           ✍️ Answer
//         </button>
//         <button
//           onClick={() => setMode('watch')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'watch'
//               ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           👁️ Watch
//         </button>
//         {mode === 'watch' && (
//           <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>
//         )}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <>
//           {showAnimals ? (
//             <div className="relative bg-gradient-to-br from-green-300/20 via-emerald-300/20 to-teal-300/20 border-2 border-green-400/50 rounded-3xl p-8 text-center shadow-2xl shadow-green-500/20 backdrop-blur-sm animate-bounce-in">
//               <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-400/30 rounded-full blur-2xl"></div>
//               <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-teal-400/30 rounded-full blur-2xl"></div>
//               <div className="text-4xl font-mono tracking-widest flex flex-wrap justify-center gap-3">
//                 {animals.map((a, i) => (
//                   <span key={i} className="inline-block bg-gray-700/50 px-4 py-2 rounded-2xl shadow-inner text-2xl text-white">{a}</span>
//                 ))}
//               </div>
//               <p className="text-sm text-green-200 mt-3 animate-pulse">🐾 Remember the positions!</p>
//             </div>
//           ) : question && mode === 'answer' ? (
//             <div className="bg-gray-800/70 border-2 border-blue-400/30 rounded-3xl p-6 text-center shadow-xl backdrop-blur-sm animate-bounce-in">
//               <p className="text-xl font-bold text-gray-200 mb-4">
//                 Which animal was at position <span className="text-yellow-300 text-2xl">#{question.position}</span>?
//               </p>
//               <div className="flex flex-wrap justify-center gap-4">
//                 {question.options.map((opt, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => handleAnswer(opt)}
//                     disabled={status === 'answered'}
//                     className={`px-6 py-4 text-4xl rounded-2xl border-2 transition-all duration-300 ${
//                       status === 'answered'
//                         ? opt === question.correct
//                           ? 'border-green-500 bg-green-400/30 text-green-200 shadow-lg shadow-green-500/30 scale-105'
//                           : 'border-red-500 bg-red-400/30 text-red-200 shadow-lg shadow-red-500/30'
//                         : 'border-gray-600 bg-gray-700/70 hover:border-green-400 hover:bg-gray-600 hover:scale-110 hover:shadow-lg'
//                     }`}
//                   >
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//               {status === 'correct' && (
//                 <div className="mt-4 p-3 bg-green-400/20 text-green-200 rounded-2xl border border-green-400/30 animate-bounce">
//                   ✅ Correct! +10 points
//                   <button onClick={handleNext} className="ml-4 px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30">
//                     Next ➜
//                   </button>
//                 </div>
//               )}
//               {status === 'wrong' && (
//                 <div className="mt-4 p-3 bg-red-400/20 text-red-200 rounded-2xl border border-red-400/30">
//                   ❌ Oops! The correct was <span className="font-bold text-white text-2xl">{question.correct}</span>
//                   <button onClick={handleNext} className="ml-4 px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30">
//                     Next ➜
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : mode === 'watch' ? (
//             <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next set loading...</div>
//           ) : (
//             <div className="text-center py-6 text-gray-400">Loading question...</div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // 4. WORD MEMORY GAME
// // ============================================================
// const WordMemoryGame: React.FC = () => {
//   const [wordCount, setWordCount] = useState<4 | 6 | 8>(4);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [mode, setMode] = useState<GameMode>('answer');
//   const [words, setWords] = useState<string[]>([]);
//   const [showWords, setShowWords] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);
//   const autoNextRef = useRef<number | null>(null);

//   const wordPool = {
//     animals: ['Dog', 'Cat', 'Elephant', 'Lion', 'Tiger', 'Bear', 'Monkey', 'Giraffe', 'Zebra', 'Horse', 'Cow', 'Sheep', 'Duck', 'Chicken', 'Rabbit'],
//     colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White', 'Gray', 'Cyan', 'Magenta', 'Teal', 'Lime'],
//     family: ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Grandfather', 'Grandmother', 'Cousin', 'Nephew', 'Niece', 'Son', 'Daughter', 'Husband', 'Wife'],
//     school: ['Teacher', 'Student', 'Classroom', 'Library', 'Principal', 'Exam', 'Homework', 'Subject', 'Math', 'Science', 'History', 'English', 'Computer', 'Garden', 'Playground']
//   };
//   const allWords = [...wordPool.animals, ...wordPool.colors, ...wordPool.family, ...wordPool.school];

//   const fetchWords = () => {
//     setLoading(true);
//     setStatus('idle');
//     setUserInput('');
//     setShowWords(false);
//     const shuffled = shuffleArray([...allWords]);
//     const selected = shuffled.slice(0, wordCount);
//     setWords(selected);
//     setTimeout(() => setShowWords(true), 200);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchWords();
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (autoNextRef.current) clearTimeout(autoNextRef.current);
//     };
//   }, [wordCount]);

//   useEffect(() => {
//     if (showWords) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowWords(false);
//         if (mode === 'watch') {
//           autoNextRef.current = setTimeout(() => fetchWords(), 600);
//         }
//       }, displayTime * 1000);
//     }
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [showWords, displayTime, mode]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;
//     const userWords = userInput.split(/[, ]+/).filter(w => w.trim() !== '').map(w => w.trim());
//     if (userWords.length === words.length && userWords.every((w, idx) => w.toLowerCase() === words[idx].toLowerCase())) {
//       setStatus('correct');
//       setTimeout(() => fetchWords(), 1000);
//     } else {
//       setStatus('wrong');
//     }
//   };

//   const handleRetry = () => {
//     setStatus('idle');
//     setUserInput('');
//     fetchWords();
//   };

//   const wordCountOptions = [4, 6, 8] as const;
//   const timeOptions = [1, 2, 3, 5, 10];

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
//         <div className="flex gap-1 flex-wrap">
//           {wordCountOptions.map(n => (
//             <button
//               key={n}
//               onClick={() => setWordCount(n)}
//               className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
//                 wordCount === n
//                   ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-gray-900 shadow-lg scale-105'
//                   : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
//               }`}
//             >
//               {n} words
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-300">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none"
//           >
//             {timeOptions.map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//         </div>
//       </div>

//       <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
//         <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
//         <button
//           onClick={() => setMode('answer')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'answer'
//               ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           ✍️ Answer
//         </button>
//         <button
//           onClick={() => setMode('watch')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'watch'
//               ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           👁️ Watch
//         </button>
//         {mode === 'watch' && (
//           <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>
//         )}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <>
//           {showWords ? (
//             <div className="relative bg-gradient-to-br from-purple-300/20 via-pink-300/20 to-rose-300/20 border-2 border-purple-400/50 rounded-3xl p-8 text-center shadow-2xl shadow-purple-500/20 backdrop-blur-sm animate-bounce-in">
//               <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-400/30 rounded-full blur-2xl"></div>
//               <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-pink-400/30 rounded-full blur-2xl"></div>
//               <div className="text-2xl font-mono font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 flex flex-wrap justify-center gap-3">
//                 {words.map((w, idx) => (
//                   <span key={idx} className="bg-gray-700/50 px-5 py-2 rounded-2xl shadow-inner text-white text-xl">{w}</span>
//                 ))}
//               </div>
//               <p className="text-sm text-purple-200 mt-3 animate-pulse">📝 Remember the order!</p>
//             </div>
//           ) : mode === 'watch' ? (
//             <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next set loading...</div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 placeholder={`Type ${wordCount} words separated by commas or spaces`}
//                 disabled={status === 'correct'}
//                 className="w-full px-6 py-4 text-center text-xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 disabled={status === 'correct'}
//                 className="w-full py-4 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-purple-400/30 text-lg"
//               >
//                 ✅ Check Answer
//               </button>
//             </form>
//           )}

//           {status === 'correct' && (
//             <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
//               ✅ Correct! Next set...
//             </div>
//           )}
//           {status === 'wrong' && mode === 'answer' && (
//             <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
//               <p>❌ Oops! The words were: <span className="font-bold text-white">{words.join(' → ')}</span></p>
//               <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
//                 🔄 Try New Words
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // MAIN COMPONENT – Dark Theme
// // ============================================================
// const MemoryGames: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<GameTab>('number');

//   const tabs: { id: GameTab; label: string; icon: string }[] = [
//     { id: 'number', label: 'Number Memory', icon: '🔢' },
//     { id: 'alphabet', label: 'Alphabet Memory', icon: '🔤' },
//     { id: 'animal', label: 'Animal Memory', icon: '🐘' },
//     { id: 'word', label: 'Word Memory', icon: '📝' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
//       <div className="max-w-5xl mx-auto">
//         <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl shadow-indigo-500/10">
//           <h1 className="text-5xl font-extrabold text-center text-white mb-8 flex items-center justify-center gap-4">
//             <span className="text-6xl">🧠</span>
//             <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
//               Memory Games
//             </span>
//           </h1>

//           <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
//             {tabs.map(tab => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-lg ${
//                   activeTab === tab.id
//                     ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-gray-900 shadow-lg shadow-yellow-400/30 scale-105'
//                     : 'text-gray-400 hover:text-white hover:bg-white/10'
//                 }`}
//               >
//                 {tab.icon} {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="mt-4">
//             {activeTab === 'number' && <NumberMemoryGame />}
//             {activeTab === 'alphabet' && <AlphabetMemoryGame />}
//             {activeTab === 'animal' && <AnimalMemoryGame />}
//             {activeTab === 'word' && <WordMemoryGame />}
//           </div>

//           <div className="mt-8 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
//             🎯 Play, watch, and improve your memory!
//           </div>
//         </div>
//       </div>

//       {/* Custom animations */}
//       <style>{`
//         @keyframes bounce-in {
//           0% { transform: scale(0.8); opacity: 0; }
//           60% { transform: scale(1.05); }
//           100% { transform: scale(1); opacity: 1; }
//         }
//         .animate-bounce-in {
//           animation: bounce-in 0.5s ease-out;
//         }
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-8px); }
//         }
//         .animate-bounce {
//           animation: bounce 0.6s infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MemoryGames;





//=============================== final running code update Math without time ==========================




// import React, { useState, useEffect, useRef } from 'react';

// type GameTab = 'number' | 'alphabet' | 'animal' | 'word' | 'math';
// type GameMode = 'answer' | 'watch';

// const shuffleArray = <T,>(arr: T[]): T[] => {
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// };

// // ============================================================
// // 1. NUMBER MEMORY GAME (Mock)
// // ============================================================
// const NumberMemoryGame: React.FC = () => {
//   const [digits, setDigits] = useState<2 | 4 | 6 | 8>(4);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [mode, setMode] = useState<GameMode>('answer');
//   const [number, setNumber] = useState('');
//   const [showNumber, setShowNumber] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);
//   const autoNextRef = useRef<number | null>(null);

//   const generateNumber = () => {
//     setLoading(true);
//     setStatus('idle');
//     setUserInput('');
//     setShowNumber(false);
//     // Generate random number with given digits
//     const min = Math.pow(10, digits - 1);
//     const max = Math.pow(10, digits) - 1;
//     const num = String(Math.floor(Math.random() * (max - min + 1)) + min);
//     setNumber(num);
//     setTimeout(() => setShowNumber(true), 200);
//     setLoading(false);
//   };

//   useEffect(() => {
//     generateNumber();
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (autoNextRef.current) clearTimeout(autoNextRef.current);
//     };
//   }, [digits]);

//   useEffect(() => {
//     if (showNumber) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowNumber(false);
//         if (mode === 'watch') {
//           autoNextRef.current = setTimeout(() => generateNumber(), 600);
//         }
//       }, displayTime * 1000);
//     }
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [showNumber, displayTime, mode]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;
//     if (userInput.trim() === number) {
//       setStatus('correct');
//       setTimeout(() => generateNumber(), 1000);
//     } else {
//       setStatus('wrong');
//     }
//   };

//   const handleRetry = () => {
//     setStatus('idle');
//     setUserInput('');
//     generateNumber();
//   };

//   const digitOptions = [2, 4, 6, 8] as const;
//   const timeOptions = [1, 2, 3, 5, 10];

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
//         <div className="flex gap-1 flex-wrap">
//           {digitOptions.map(d => (
//             <button
//               key={d}
//               onClick={() => setDigits(d)}
//               className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
//                 digits === d
//                   ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg scale-105'
//                   : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
//               }`}
//             >
//               {d}‑digit
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-300">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 outline-none"
//           >
//             {timeOptions.map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//         </div>
//       </div>

//       <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
//         <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
//         <button
//           onClick={() => setMode('answer')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'answer'
//               ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           ✍️ Answer
//         </button>
//         <button
//           onClick={() => setMode('watch')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'watch'
//               ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           👁️ Watch
//         </button>
//         {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <>
//           {showNumber ? (
//             <div className="relative bg-gradient-to-br from-yellow-300/20 via-orange-300/20 to-pink-300/20 border-2 border-yellow-400/50 rounded-3xl p-10 text-center shadow-2xl shadow-yellow-500/20 backdrop-blur-sm animate-bounce-in">
//               <div className="text-6xl font-mono font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
//                 {number}
//               </div>
//               <p className="text-sm text-yellow-200 mt-3 animate-pulse">🧠 Memorize this number!</p>
//             </div>
//           ) : mode === 'watch' ? (
//             <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next number loading...</div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 placeholder={`Type ${digits} digits`}
//                 disabled={status === 'correct'}
//                 className="w-full px-6 py-4 text-center text-2xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 disabled={status === 'correct'}
//                 className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-yellow-400/30 text-lg"
//               >
//                 ✅ Check Answer
//               </button>
//             </form>
//           )}

//           {status === 'correct' && (
//             <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
//               ✅ Correct! Next number...
//             </div>
//           )}
//           {status === 'wrong' && mode === 'answer' && (
//             <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
//               <p>❌ Oops! The number was <span className="font-mono font-bold text-white text-2xl">{number}</span></p>
//               <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
//                 🔄 Try Again
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // 2. ALPHABET MEMORY GAME (Mock)
// // ============================================================
// const AlphabetMemoryGame: React.FC = () => {
//   const [length, setLength] = useState<5 | 8 | 10>(5);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [mode, setMode] = useState<GameMode>('answer');
//   const [sequence, setSequence] = useState('');
//   const [showSequence, setShowSequence] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);
//   const autoNextRef = useRef<number | null>(null);

//   const generateSequence = () => {
//     setLoading(true);
//     setStatus('idle');
//     setUserInput('');
//     setShowSequence(false);
//     const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     let seq = '';
//     for (let i = 0; i < length; i++) {
//       seq += letters[Math.floor(Math.random() * 26)];
//     }
//     setSequence(seq);
//     setTimeout(() => setShowSequence(true), 200);
//     setLoading(false);
//   };

//   useEffect(() => {
//     generateSequence();
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (autoNextRef.current) clearTimeout(autoNextRef.current);
//     };
//   }, [length]);

//   useEffect(() => {
//     if (showSequence) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowSequence(false);
//         if (mode === 'watch') {
//           autoNextRef.current = setTimeout(() => generateSequence(), 600);
//         }
//       }, displayTime * 1000);
//     }
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [showSequence, displayTime, mode]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;
//     if (userInput.trim().toUpperCase() === sequence) {
//       setStatus('correct');
//       setTimeout(() => generateSequence(), 1000);
//     } else {
//       setStatus('wrong');
//     }
//   };

//   const handleRetry = () => {
//     setStatus('idle');
//     setUserInput('');
//     generateSequence();
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
//         <div className="flex gap-1 flex-wrap">
//           {[5, 8, 10].map(len => (
//             <button
//               key={len}
//               onClick={() => setLength(len as typeof length)}
//               className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
//                 length === len
//                   ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-gray-900 shadow-lg scale-105'
//                   : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
//               }`}
//             >
//               {len} letters
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-300">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none"
//           >
//             {[1, 2, 3, 5, 10].map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//         </div>
//       </div>

//       <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
//         <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
//         <button
//           onClick={() => setMode('answer')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'answer'
//               ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           ✍️ Answer
//         </button>
//         <button
//           onClick={() => setMode('watch')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'watch'
//               ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           👁️ Watch
//         </button>
//         {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <>
//           {showSequence ? (
//             <div className="relative bg-gradient-to-br from-cyan-300/20 via-blue-300/20 to-indigo-300/20 border-2 border-cyan-400/50 rounded-3xl p-10 text-center shadow-2xl shadow-cyan-500/20 backdrop-blur-sm animate-bounce-in">
//               <div className="text-5xl font-mono font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
//                 {sequence.split('').join('  ')}
//               </div>
//               <p className="text-sm text-cyan-200 mt-3 animate-pulse">🧠 Remember the order!</p>
//             </div>
//           ) : mode === 'watch' ? (
//             <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next set loading...</div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value.toUpperCase())}
//                 placeholder="Type letters in order"
//                 disabled={status === 'correct'}
//                 className="w-full px-6 py-4 text-center text-2xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 disabled={status === 'correct'}
//                 className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-cyan-400/30 text-lg"
//               >
//                 ✅ Check Answer
//               </button>
//             </form>
//           )}

//           {status === 'correct' && (
//             <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
//               ✅ Correct! Next set...
//             </div>
//           )}
//           {status === 'wrong' && mode === 'answer' && (
//             <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
//               <p>❌ Oops! The sequence was <span className="font-mono font-bold text-white text-2xl">{sequence}</span></p>
//               <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
//                 🔄 Try Again
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // 3. ANIMAL MEMORY GAME (Mock)
// // ============================================================
// const AnimalMemoryGame: React.FC = () => {
//   const [count, setCount] = useState<5 | 8 | 10>(5);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [mode, setMode] = useState<GameMode>('answer');
//   const [animals, setAnimals] = useState<string[]>([]);
//   const [showAnimals, setShowAnimals] = useState(false);
//   const [question, setQuestion] = useState<{ position: number; options: string[]; correct: string } | null>(null);
//   const [score, setScore] = useState(0);
//   const [status, setStatus] = useState<'idle' | 'answered' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);
//   const autoNextRef = useRef<number | null>(null);

//   const animalEmojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🐣','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔'];

//   const generateAnimals = () => {
//     setLoading(true);
//     setStatus('idle');
//     setShowAnimals(false);
//     setQuestion(null);
//     const shuffled = shuffleArray([...animalEmojis]);
//     const selected = shuffled.slice(0, count);
//     setAnimals(selected);
//     setTimeout(() => setShowAnimals(true), 200);
//     setLoading(false);
//   };

//   useEffect(() => {
//     generateAnimals();
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (autoNextRef.current) clearTimeout(autoNextRef.current);
//     };
//   }, [count]);

//   useEffect(() => {
//     if (showAnimals) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowAnimals(false);
//         if (mode === 'watch') {
//           autoNextRef.current = setTimeout(() => generateAnimals(), 600);
//         } else {
//           generateQuestion();
//         }
//       }, displayTime * 1000);
//     }
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [showAnimals, displayTime, mode]);

//   const generateQuestion = () => {
//     if (animals.length === 0) return;
//     const pos = Math.floor(Math.random() * animals.length);
//     const correct = animals[pos];
//     const pool = animalEmojis.filter(e => e !== correct);
//     const wrongOptions = shuffleArray(pool).slice(0, 3);
//     const options = shuffleArray([correct, ...wrongOptions]);
//     setQuestion({ position: pos + 1, options, correct });
//     setStatus('idle');
//   };

//   const handleAnswer = (selected: string) => {
//     if (!question) return;
//     if (selected === question.correct) {
//       setScore(prev => prev + 10);
//       setStatus('correct');
//     } else {
//       setStatus('wrong');
//     }
//     setStatus('answered');
//   };

//   const handleNext = () => generateAnimals();

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
//         <div className="flex gap-1 flex-wrap">
//           {[5, 8, 10].map(n => (
//             <button
//               key={n}
//               onClick={() => setCount(n as typeof count)}
//               className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
//                 count === n
//                   ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 shadow-lg scale-105'
//                   : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
//               }`}
//             >
//               {n} animals
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-300">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/50 outline-none"
//           >
//             {[1, 2, 3, 5, 10].map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//           <span className="text-sm font-bold text-yellow-300">🏆 {score}</span>
//         </div>
//       </div>

//       <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
//         <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
//         <button
//           onClick={() => setMode('answer')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'answer'
//               ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           ✍️ Answer
//         </button>
//         <button
//           onClick={() => setMode('watch')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'watch'
//               ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           👁️ Watch
//         </button>
//         {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <>
//           {showAnimals ? (
//             <div className="relative bg-gradient-to-br from-green-300/20 via-emerald-300/20 to-teal-300/20 border-2 border-green-400/50 rounded-3xl p-8 text-center shadow-2xl shadow-green-500/20 backdrop-blur-sm animate-bounce-in">
//               <div className="text-4xl font-mono tracking-widest flex flex-wrap justify-center gap-3">
//                 {animals.map((a, i) => (
//                   <span key={i} className="inline-block bg-gray-700/50 px-4 py-2 rounded-2xl shadow-inner text-2xl text-white">{a}</span>
//                 ))}
//               </div>
//               <p className="text-sm text-green-200 mt-3 animate-pulse">🐾 Remember the positions!</p>
//             </div>
//           ) : question && mode === 'answer' ? (
//             <div className="bg-gray-800/70 border-2 border-blue-400/30 rounded-3xl p-6 text-center shadow-xl backdrop-blur-sm animate-bounce-in">
//               <p className="text-xl font-bold text-gray-200 mb-4">
//                 Which animal was at position <span className="text-yellow-300 text-2xl">#{question.position}</span>?
//               </p>
//               <div className="flex flex-wrap justify-center gap-4">
//                 {question.options.map((opt, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => handleAnswer(opt)}
//                     disabled={status === 'answered'}
//                     className={`px-6 py-4 text-4xl rounded-2xl border-2 transition-all duration-300 ${
//                       status === 'answered'
//                         ? opt === question.correct
//                           ? 'border-green-500 bg-green-400/30 text-green-200 shadow-lg shadow-green-500/30 scale-105'
//                           : 'border-red-500 bg-red-400/30 text-red-200 shadow-lg shadow-red-500/30'
//                         : 'border-gray-600 bg-gray-700/70 hover:border-green-400 hover:bg-gray-600 hover:scale-110 hover:shadow-lg'
//                     }`}
//                   >
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//               {status === 'correct' && (
//                 <div className="mt-4 p-3 bg-green-400/20 text-green-200 rounded-2xl border border-green-400/30 animate-bounce">
//                   ✅ Correct! +10 points
//                   <button onClick={handleNext} className="ml-4 px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30">
//                     Next ➜
//                   </button>
//                 </div>
//               )}
//               {status === 'wrong' && (
//                 <div className="mt-4 p-3 bg-red-400/20 text-red-200 rounded-2xl border border-red-400/30">
//                   ❌ Oops! The correct was <span className="font-bold text-white text-2xl">{question.correct}</span>
//                   <button onClick={handleNext} className="ml-4 px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30">
//                     Next ➜
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : mode === 'watch' ? (
//             <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next set loading...</div>
//           ) : (
//             <div className="text-center py-6 text-gray-400">Loading question...</div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // 4. WORD MEMORY GAME (already working locally)
// // ============================================================
// const WordMemoryGame: React.FC = () => {
//   const [wordCount, setWordCount] = useState<4 | 6 | 8>(4);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [mode, setMode] = useState<GameMode>('answer');
//   const [words, setWords] = useState<string[]>([]);
//   const [showWords, setShowWords] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);
//   const autoNextRef = useRef<number | null>(null);

//   const wordPool = {
//     animals: ['Dog', 'Cat', 'Elephant', 'Lion', 'Tiger', 'Bear', 'Monkey', 'Giraffe', 'Zebra', 'Horse', 'Cow', 'Sheep', 'Duck', 'Chicken', 'Rabbit'],
//     colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White', 'Gray', 'Cyan', 'Magenta', 'Teal', 'Lime'],
//     family: ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Grandfather', 'Grandmother', 'Cousin', 'Nephew', 'Niece', 'Son', 'Daughter', 'Husband', 'Wife'],
//     school: ['Teacher', 'Student', 'Classroom', 'Library', 'Principal', 'Exam', 'Homework', 'Subject', 'Math', 'Science', 'History', 'English', 'Computer', 'Garden', 'Playground']
//   };
//   const allWords = [...wordPool.animals, ...wordPool.colors, ...wordPool.family, ...wordPool.school];

//   const fetchWords = () => {
//     setLoading(true);
//     setStatus('idle');
//     setUserInput('');
//     setShowWords(false);
//     const shuffled = shuffleArray([...allWords]);
//     const selected = shuffled.slice(0, wordCount);
//     setWords(selected);
//     setTimeout(() => setShowWords(true), 200);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchWords();
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (autoNextRef.current) clearTimeout(autoNextRef.current);
//     };
//   }, [wordCount]);

//   useEffect(() => {
//     if (showWords) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowWords(false);
//         if (mode === 'watch') {
//           autoNextRef.current = setTimeout(() => fetchWords(), 600);
//         }
//       }, displayTime * 1000);
//     }
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [showWords, displayTime, mode]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;
//     const userWords = userInput.split(/[, ]+/).filter(w => w.trim() !== '').map(w => w.trim());
//     if (userWords.length === words.length && userWords.every((w, idx) => w.toLowerCase() === words[idx].toLowerCase())) {
//       setStatus('correct');
//       setTimeout(() => fetchWords(), 1000);
//     } else {
//       setStatus('wrong');
//     }
//   };

//   const handleRetry = () => {
//     setStatus('idle');
//     setUserInput('');
//     fetchWords();
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
//         <div className="flex gap-1 flex-wrap">
//           {[4, 6, 8].map(n => (
//             <button
//               key={n}
//               onClick={() => setWordCount(n as typeof wordCount)}
//               className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
//                 wordCount === n
//                   ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-gray-900 shadow-lg scale-105'
//                   : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
//               }`}
//             >
//               {n} words
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-300">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none"
//           >
//             {[1, 2, 3, 5, 10].map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//         </div>
//       </div>

//       <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
//         <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
//         <button
//           onClick={() => setMode('answer')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'answer'
//               ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           ✍️ Answer
//         </button>
//         <button
//           onClick={() => setMode('watch')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'watch'
//               ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           👁️ Watch
//         </button>
//         {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <>
//           {showWords ? (
//             <div className="relative bg-gradient-to-br from-purple-300/20 via-pink-300/20 to-rose-300/20 border-2 border-purple-400/50 rounded-3xl p-8 text-center shadow-2xl shadow-purple-500/20 backdrop-blur-sm animate-bounce-in">
//               <div className="text-2xl font-mono font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 flex flex-wrap justify-center gap-3">
//                 {words.map((w, idx) => (
//                   <span key={idx} className="bg-gray-700/50 px-5 py-2 rounded-2xl shadow-inner text-white text-xl">{w}</span>
//                 ))}
//               </div>
//               <p className="text-sm text-purple-200 mt-3 animate-pulse">📝 Remember the order!</p>
//             </div>
//           ) : mode === 'watch' ? (
//             <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next set loading...</div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 placeholder={`Type ${wordCount} words separated by commas or spaces`}
//                 disabled={status === 'correct'}
//                 className="w-full px-6 py-4 text-center text-xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 disabled={status === 'correct'}
//                 className="w-full py-4 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-purple-400/30 text-lg"
//               >
//                 ✅ Check Answer
//               </button>
//             </form>
//           )}

//           {status === 'correct' && (
//             <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
//               ✅ Correct! Next set...
//             </div>
//           )}
//           {status === 'wrong' && mode === 'answer' && (
//             <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
//               <p>❌ Oops! The words were: <span className="font-bold text-white">{words.join(' → ')}</span></p>
//               <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
//                 🔄 Try New Words
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // 5. MATH MEMORY GAME
// // ============================================================
// const MathMemoryGame: React.FC = () => {
//   const [mode, setMode] = useState<GameMode>('answer');
//   const [problem, setProblem] = useState<string>('');
//   const [correctAnswer, setCorrectAnswer] = useState<number | string>('');
//   const [userInput, setUserInput] = useState<string>('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
//   const [showProblem, setShowProblem] = useState(false);
//   const [explanation, setExplanation] = useState<string>('');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);
//   const autoNextRef = useRef<number | null>(null);

//   const generateProblem = () => {
//     setLoading(true);
//     setStatus('idle');
//     setUserInput('');
//     setShowProblem(false);
//     setExplanation('');

//     const ops = ['+', '-', '×', '÷', '%'];
//     const op = ops[Math.floor(Math.random() * ops.length)];

//     let num1: number, num2: number;
//     let answer: number | string;
//     let problemText = '';
//     let expl = '';

//     switch (op) {
//       case '+':
//         num1 = randInt(1, 50);
//         num2 = randInt(1, 50);
//         answer = num1 + num2;
//         problemText = `${num1} + ${num2} = ?`;
//         expl = `${num1} + ${num2} = ${answer}`;
//         break;

//       case '-':
//         num1 = randInt(1, 50);
//         num2 = randInt(1, num1);
//         answer = num1 - num2;
//         problemText = `${num1} − ${num2} = ?`;
//         expl = `${num1} − ${num2} = ${answer}`;
//         break;

//       case '×':
//         num1 = randInt(1, 12);
//         num2 = randInt(1, 12);
//         answer = num1 * num2;
//         problemText = `${num1} × ${num2} = ?`;
//         expl = `${num1} × ${num2} = ${answer}`;
//         break;

//       case '÷':
//         num1 = randInt(1, 100);
//         num2 = randInt(1, 20);
//         if (num1 < num2) [num1, num2] = [num2, num1];
//         const quotient = Math.floor(num1 / num2);
//         const remainder = num1 % num2;
//         if (remainder === 0) {
//           answer = quotient;
//           problemText = `${num1} ÷ ${num2} = ?`;
//           expl = `${num1} ÷ ${num2} = ${quotient} (exact division)`;
//         } else {
//           answer = quotient;
//           problemText = `${num1} ÷ ${num2} = ? (Quotient only)`;
//           expl = `${num1} ÷ ${num2} gives quotient ${quotient} and remainder ${remainder}. Remainder is the amount left over after division.`;
//         }
//         break;

//       case '%':
//         const percent = randInt(1, 100);
//         const value = randInt(1, 200);
//         const result = (percent / 100) * value;
//         const rounded = Math.round(result * 100) / 100;
//         answer = rounded;
//         problemText = `What is ${percent}% of ${value}?`;
//         expl = `${percent}% of ${value} = (${percent}/100) × ${value} = ${rounded}`;
//         break;

//       default:
//         return;
//     }

//     setProblem(problemText);
//     setCorrectAnswer(answer);
//     setExplanation(expl);
//     setTimeout(() => setShowProblem(true), 200);
//     setLoading(false);
//   };

//   const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

//   useEffect(() => {
//     generateProblem();
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (autoNextRef.current) clearTimeout(autoNextRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (showProblem) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowProblem(false);
//         if (mode === 'watch') {
//           autoNextRef.current = setTimeout(() => generateProblem(), 600);
//         }
//       }, 3000);
//     }
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [showProblem, mode]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;
//     const userAns = parseFloat(userInput.trim());
//     if (isNaN(userAns)) {
//       setStatus('wrong');
//       return;
//     }
//     const isCorrect = Math.abs(userAns - Number(correctAnswer)) < 0.01;
//     if (isCorrect) {
//       setStatus('correct');
//       setTimeout(() => generateProblem(), 1000);
//     } else {
//       setStatus('wrong');
//     }
//   };

//   const handleRetry = () => {
//     setStatus('idle');
//     setUserInput('');
//     generateProblem();
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
//         <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
//         <button
//           onClick={() => setMode('answer')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'answer'
//               ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           ✍️ Answer
//         </button>
//         <button
//           onClick={() => setMode('watch')}
//           className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//             mode === 'watch'
//               ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
//               : 'text-gray-400 hover:text-white hover:bg-white/10'
//           }`}
//         >
//           👁️ Watch
//         </button>
//         {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <>
//           {showProblem ? (
//             <div className="relative bg-gradient-to-br from-purple-300/20 via-pink-300/20 to-rose-300/20 border-2 border-purple-400/50 rounded-3xl p-10 text-center shadow-2xl shadow-purple-500/20 backdrop-blur-sm animate-bounce-in">
//               <div className="text-4xl font-mono font-bold tracking-widest text-white">
//                 {problem}
//               </div>
//               <p className="text-sm text-purple-200 mt-3 animate-pulse">🧠 Solve this!</p>
//             </div>
//           ) : mode === 'watch' ? (
//             <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next problem loading...</div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 placeholder="Type your answer"
//                 disabled={status === 'correct'}
//                 className="w-full px-6 py-4 text-center text-2xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 disabled={status === 'correct'}
//                 className="w-full py-4 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-purple-400/30 text-lg"
//               >
//                 ✅ Check Answer
//               </button>
//             </form>
//           )}

//           {status === 'correct' && (
//             <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
//               ✅ Correct! {explanation}
//               <div className="text-sm text-green-300 mt-1">Next problem loading...</div>
//             </div>
//           )}
//           {status === 'wrong' && mode === 'answer' && (
//             <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
//               <p>❌ Oops! The correct answer is: <span className="font-bold text-white text-2xl">{correctAnswer}</span></p>
//               <p className="text-sm text-yellow-300 mt-2">{explanation}</p>
//               <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
//                 🔄 Try Another
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // MAIN COMPONENT
// // ============================================================
// const MemoryGames: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<GameTab>('number');

//   const tabs: { id: GameTab; label: string; icon: string }[] = [
//     { id: 'number', label: 'Number Memory', icon: '🔢' },
//     { id: 'alphabet', label: 'Alphabet Memory', icon: '🔤' },
//     { id: 'animal', label: 'Animal Memory', icon: '🐘' },
//     { id: 'word', label: 'Word Memory', icon: '📝' },
//     { id: 'math', label: 'Math', icon: '🧮' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
//       <div className="max-w-5xl mx-auto">
//         <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl shadow-indigo-500/10">
//           <h1 className="text-5xl font-extrabold text-center text-white mb-8 flex items-center justify-center gap-4">
//             <span className="text-6xl">🧠</span>
//             <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
//               Memory Games
//             </span>
//           </h1>

//           <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
//             {tabs.map(tab => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-lg ${
//                   activeTab === tab.id
//                     ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-gray-900 shadow-lg shadow-yellow-400/30 scale-105'
//                     : 'text-gray-400 hover:text-white hover:bg-white/10'
//                 }`}
//               >
//                 {tab.icon} {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="mt-4">
//             {activeTab === 'number' && <NumberMemoryGame />}
//             {activeTab === 'alphabet' && <AlphabetMemoryGame />}
//             {activeTab === 'animal' && <AnimalMemoryGame />}
//             {activeTab === 'word' && <WordMemoryGame />}
//             {activeTab === 'math' && <MathMemoryGame />}
//           </div>

//           <div className="mt-8 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
//             🎯 Play, watch, and improve your memory!
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes bounce-in {
//           0% { transform: scale(0.8); opacity: 0; }
//           60% { transform: scale(1.05); }
//           100% { transform: scale(1); opacity: 1; }
//         }
//         .animate-bounce-in {
//           animation: bounce-in 0.5s ease-out;
//         }
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-8px); }
//         }
//         .animate-bounce {
//           animation: bounce 0.6s infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MemoryGames;







import React, { useState, useEffect, useRef } from 'react';

type GameTab = 
  | 'number' 
  | 'alphabet' 
  | 'animals' 
  | 'aroundus' 
  | 'hindivarnamala' 
  | 'word' 
  | 'math';

type GameMode = 'answer' | 'watch';

const shuffleArray = <T,>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// ============================================================
// 1. NUMBER MEMORY
// ============================================================
const NumberMemoryGame: React.FC = () => {
  const [digits, setDigits] = useState<2 | 4 | 6 | 8>(4);
  const [displayTime, setDisplayTime] = useState<number>(3);
  const [mode, setMode] = useState<GameMode>('answer');
  const [number, setNumber] = useState('');
  const [showNumber, setShowNumber] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const autoNextRef = useRef<number | null>(null);

  const generateNumber = () => {
    setLoading(true);
    setStatus('idle');
    setUserInput('');
    setShowNumber(false);
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const num = String(Math.floor(Math.random() * (max - min + 1)) + min);
    setNumber(num);
    setTimeout(() => setShowNumber(true), 200);
    setLoading(false);
  };

  useEffect(() => {
    generateNumber();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
    };
  }, [digits]);

  useEffect(() => {
    if (showNumber) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowNumber(false);
        if (mode === 'watch') {
          autoNextRef.current = setTimeout(() => generateNumber(), 600);
        }
      }, displayTime * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showNumber, displayTime, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    if (userInput.trim() === number) {
      setStatus('correct');
      setTimeout(() => generateNumber(), 1000);
    } else {
      setStatus('wrong');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setUserInput('');
    generateNumber();
  };

  const digitOptions = [2, 4, 6, 8] as const;
  const timeOptions = [1, 2, 3, 5, 10];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
        <div className="flex gap-1 flex-wrap">
          {digitOptions.map(d => (
            <button
              key={d}
              onClick={() => setDigits(d)}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                digits === d
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg scale-105'
                  : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
              }`}
            >
              {d}‑digit
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-300">⏱️</span>
          <select
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
            className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 outline-none"
          >
            {timeOptions.map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
        <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
        <button
          onClick={() => setMode('answer')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'answer'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          ✍️ Answer
        </button>
        <button
          onClick={() => setMode('watch')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'watch'
              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          👁️ Watch
        </button>
        {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {showNumber ? (
            <div className="relative bg-gradient-to-br from-yellow-300/20 via-orange-300/20 to-pink-300/20 border-2 border-yellow-400/50 rounded-3xl p-10 text-center shadow-2xl shadow-yellow-500/20 backdrop-blur-sm animate-bounce-in">
              <div className="text-6xl font-mono font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                {number}
              </div>
              <p className="text-sm text-yellow-200 mt-3 animate-pulse">🧠 Memorize this number!</p>
            </div>
          ) : mode === 'watch' ? (
            <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next number loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Type ${digits} digits`}
                disabled={status === 'correct'}
                className="w-full px-6 py-4 text-center text-2xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={status === 'correct'}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-yellow-400/30 text-lg"
              >
                ✅ Check Answer
              </button>
            </form>
          )}

          {status === 'correct' && (
            <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
              ✅ Correct! Next number...
            </div>
          )}
          {status === 'wrong' && mode === 'answer' && (
            <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
              <p>❌ Oops! The number was <span className="font-mono font-bold text-white text-2xl">{number}</span></p>
              <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
                🔄 Try Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// 2. ALPHABET MEMORY (English)
// ============================================================
const AlphabetMemoryGame: React.FC = () => {
  const [length, setLength] = useState<5 | 8 | 10>(5);
  const [displayTime, setDisplayTime] = useState<number>(3);
  const [mode, setMode] = useState<GameMode>('answer');
  const [sequence, setSequence] = useState('');
  const [showSequence, setShowSequence] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const autoNextRef = useRef<number | null>(null);

  const generateSequence = () => {
    setLoading(true);
    setStatus('idle');
    setUserInput('');
    setShowSequence(false);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let seq = '';
    for (let i = 0; i < length; i++) {
      seq += letters[Math.floor(Math.random() * 26)];
    }
    setSequence(seq);
    setTimeout(() => setShowSequence(true), 200);
    setLoading(false);
  };

  useEffect(() => {
    generateSequence();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
    };
  }, [length]);

  useEffect(() => {
    if (showSequence) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowSequence(false);
        if (mode === 'watch') {
          autoNextRef.current = setTimeout(() => generateSequence(), 600);
        }
      }, displayTime * 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [showSequence, displayTime, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    if (userInput.trim().toUpperCase() === sequence) {
      setStatus('correct');
      setTimeout(() => generateSequence(), 1000);
    } else {
      setStatus('wrong');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setUserInput('');
    generateSequence();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
        <div className="flex gap-1 flex-wrap">
          {[5, 8, 10].map(len => (
            <button
              key={len}
              onClick={() => setLength(len as typeof length)}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                length === len
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-gray-900 shadow-lg scale-105'
                  : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
              }`}
            >
              {len} letters
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-300">⏱️</span>
          <select
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
            className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none"
          >
            {[1, 2, 3, 5, 10].map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
        <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
        <button
          onClick={() => setMode('answer')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'answer'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          ✍️ Answer
        </button>
        <button
          onClick={() => setMode('watch')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'watch'
              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          👁️ Watch
        </button>
        {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {showSequence ? (
            <div className="relative bg-gradient-to-br from-cyan-300/20 via-blue-300/20 to-indigo-300/20 border-2 border-cyan-400/50 rounded-3xl p-10 text-center shadow-2xl shadow-cyan-500/20 backdrop-blur-sm animate-bounce-in">
              <div className="text-5xl font-mono font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                {sequence.split('').join('  ')}
              </div>
              <p className="text-sm text-cyan-200 mt-3 animate-pulse">🧠 Remember the order!</p>
            </div>
          ) : mode === 'watch' ? (
            <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next set loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                placeholder="Type letters in order"
                disabled={status === 'correct'}
                className="w-full px-6 py-4 text-center text-2xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={status === 'correct'}
                className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-cyan-400/30 text-lg"
              >
                ✅ Check Answer
              </button>
            </form>
          )}

          {status === 'correct' && (
            <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
              ✅ Correct! Next set...
            </div>
          )}
          {status === 'wrong' && mode === 'answer' && (
            <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
              <p>❌ Oops! The sequence was <span className="font-mono font-bold text-white text-2xl">{sequence}</span></p>
              <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
                🔄 Try Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// 3. ANIMALS MEMORY (existing, renamed)
// ============================================================
const AnimalsMemoryGame: React.FC = () => {
  const [count, setCount] = useState<5 | 8 | 10>(5);
  const [displayTime, setDisplayTime] = useState<number>(3);
  const [mode, setMode] = useState<GameMode>('answer');
  const [animals, setAnimals] = useState<string[]>([]);
  const [showAnimals, setShowAnimals] = useState(false);
  const [question, setQuestion] = useState<{ position: number; options: string[]; correct: string } | null>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'answered' | 'correct' | 'wrong'>('idle');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const autoNextRef = useRef<number | null>(null);

  const animalEmojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🐣','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔'];

  const generateAnimals = () => {
    setLoading(true);
    setStatus('idle');
    setShowAnimals(false);
    setQuestion(null);
    const shuffled = shuffleArray([...animalEmojis]);
    const selected = shuffled.slice(0, count);
    setAnimals(selected);
    setTimeout(() => setShowAnimals(true), 200);
    setLoading(false);
  };

  useEffect(() => {
    generateAnimals();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
    };
  }, [count]);

  useEffect(() => {
    if (showAnimals) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowAnimals(false);
        if (mode === 'watch') {
          autoNextRef.current = setTimeout(() => generateAnimals(), 600);
        } else {
          generateQuestion();
        }
      }, displayTime * 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [showAnimals, displayTime, mode]);

  const generateQuestion = () => {
    if (animals.length === 0) return;
    const pos = Math.floor(Math.random() * animals.length);
    const correct = animals[pos];
    const pool = animalEmojis.filter(e => e !== correct);
    const wrongOptions = shuffleArray(pool).slice(0, 3);
    const options = shuffleArray([correct, ...wrongOptions]);
    setQuestion({ position: pos + 1, options, correct });
    setStatus('idle');
  };

  const handleAnswer = (selected: string) => {
    if (!question) return;
    if (selected === question.correct) {
      setScore(prev => prev + 10);
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
    setStatus('answered');
  };

  const handleNext = () => generateAnimals();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
        <div className="flex gap-1 flex-wrap">
          {[5, 8, 10].map(n => (
            <button
              key={n}
              onClick={() => setCount(n as typeof count)}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                count === n
                  ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 shadow-lg scale-105'
                  : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
              }`}
            >
              {n} animals
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-300">⏱️</span>
          <select
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
            className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/50 outline-none"
          >
            {[1, 2, 3, 5, 10].map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
          <span className="text-sm font-bold text-yellow-300">🏆 {score}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
        <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
        <button
          onClick={() => setMode('answer')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'answer'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          ✍️ Answer
        </button>
        <button
          onClick={() => setMode('watch')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'watch'
              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          👁️ Watch
        </button>
        {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {showAnimals ? (
            <div className="relative bg-gradient-to-br from-green-300/20 via-emerald-300/20 to-teal-300/20 border-2 border-green-400/50 rounded-3xl p-8 text-center shadow-2xl shadow-green-500/20 backdrop-blur-sm animate-bounce-in">
              <div className="text-4xl font-mono tracking-widest flex flex-wrap justify-center gap-3">
                {animals.map((a, i) => (
                  <span key={i} className="inline-block bg-gray-700/50 px-4 py-2 rounded-2xl shadow-inner text-2xl text-white">{a}</span>
                ))}
              </div>
              <p className="text-sm text-green-200 mt-3 animate-pulse">🐾 Remember the positions!</p>
            </div>
          ) : question && mode === 'answer' ? (
            <div className="bg-gray-800/70 border-2 border-blue-400/30 rounded-3xl p-6 text-center shadow-xl backdrop-blur-sm animate-bounce-in">
              <p className="text-xl font-bold text-gray-200 mb-4">
                Which animal was at position <span className="text-yellow-300 text-2xl">#{question.position}</span>?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    disabled={status === 'answered'}
                    className={`px-6 py-4 text-4xl rounded-2xl border-2 transition-all duration-300 ${
                      status === 'answered'
                        ? opt === question.correct
                          ? 'border-green-500 bg-green-400/30 text-green-200 shadow-lg shadow-green-500/30 scale-105'
                          : 'border-red-500 bg-red-400/30 text-red-200 shadow-lg shadow-red-500/30'
                        : 'border-gray-600 bg-gray-700/70 hover:border-green-400 hover:bg-gray-600 hover:scale-110 hover:shadow-lg'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {status === 'correct' && (
                <div className="mt-4 p-3 bg-green-400/20 text-green-200 rounded-2xl border border-green-400/30 animate-bounce">
                  ✅ Correct! +10 points
                  <button onClick={handleNext} className="ml-4 px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30">
                    Next ➜
                  </button>
                </div>
              )}
              {status === 'wrong' && (
                <div className="mt-4 p-3 bg-red-400/20 text-red-200 rounded-2xl border border-red-400/30">
                  ❌ Oops! The correct was <span className="font-bold text-white text-2xl">{question.correct}</span>
                  <button onClick={handleNext} className="ml-4 px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30">
                    Next ➜
                  </button>
                </div>
              )}
            </div>
          ) : mode === 'watch' ? (
            <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next set loading...</div>
          ) : (
            <div className="text-center py-6 text-gray-400">Loading question...</div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// 4. AROUND US (objects, places) – NEW
// ============================================================
const AroundUsMemoryGame: React.FC = () => {
  const [count, setCount] = useState<5 | 8 | 10>(5);
  const [displayTime, setDisplayTime] = useState<number>(3);
  const [mode, setMode] = useState<GameMode>('answer');
  const [items, setItems] = useState<string[]>([]);
  const [showItems, setShowItems] = useState(false);
  const [question, setQuestion] = useState<{ position: number; options: string[]; correct: string } | null>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'answered' | 'correct' | 'wrong'>('idle');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const autoNextRef = useRef<number | null>(null);

  const aroundUsEmojis = ['🏠', '🚗', '✈️', '⛵', '🚲', '🚂', '🏢', '🏥', '🏫', '🏪', '⛪', '🕌', '⛲', '🌳', '🌲', '🌺', '🌻', '🌹', '🌸', '🌼', '☀️', '🌙', '⭐', '☁️', '⚡', '💧', '🔥', '❄️', '🌈', '⛈️', '🌊', '🏔️', '🗻', '🌋', '🏝️', '🏜️', '🏞️', '🌅', '🌄', '🎡', '🎢', '🎠', '🏟️', '🏛️', '🛕', '🕋', '⛩️', '🛖', '🏕️', '🏗️', '🌉', '🌆', '🌃', '🌌', '🎆', '🎇'];

  const generateItems = () => {
    setLoading(true);
    setStatus('idle');
    setShowItems(false);
    setQuestion(null);
    const shuffled = shuffleArray([...aroundUsEmojis]);
    const selected = shuffled.slice(0, count);
    setItems(selected);
    setTimeout(() => setShowItems(true), 200);
    setLoading(false);
  };

  useEffect(() => {
    generateItems();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
    };
  }, [count]);

  useEffect(() => {
    if (showItems) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowItems(false);
        if (mode === 'watch') {
          autoNextRef.current = setTimeout(() => generateItems(), 600);
        } else {
          generateQuestion();
        }
      }, displayTime * 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [showItems, displayTime, mode]);

  const generateQuestion = () => {
    if (items.length === 0) return;
    const pos = Math.floor(Math.random() * items.length);
    const correct = items[pos];
    const pool = aroundUsEmojis.filter(e => e !== correct);
    const wrongOptions = shuffleArray(pool).slice(0, 3);
    const options = shuffleArray([correct, ...wrongOptions]);
    setQuestion({ position: pos + 1, options, correct });
    setStatus('idle');
  };

  const handleAnswer = (selected: string) => {
    if (!question) return;
    if (selected === question.correct) {
      setScore(prev => prev + 10);
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
    setStatus('answered');
  };

  const handleNext = () => generateItems();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
        <div className="flex gap-1 flex-wrap">
          {[5, 8, 10].map(n => (
            <button
              key={n}
              onClick={() => setCount(n as typeof count)}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                count === n
                  ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
                  : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
              }`}
            >
              {n} items
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-300">⏱️</span>
          <select
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
            className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 outline-none"
          >
            {[1, 2, 3, 5, 10].map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
          <span className="text-sm font-bold text-yellow-300">🏆 {score}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
        <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
        <button
          onClick={() => setMode('answer')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'answer'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          ✍️ Answer
        </button>
        <button
          onClick={() => setMode('watch')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'watch'
              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          👁️ Watch
        </button>
        {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {showItems ? (
            <div className="relative bg-gradient-to-br from-blue-300/20 via-cyan-300/20 to-indigo-300/20 border-2 border-blue-400/50 rounded-3xl p-8 text-center shadow-2xl shadow-blue-500/20 backdrop-blur-sm animate-bounce-in">
              <div className="text-4xl font-mono tracking-widest flex flex-wrap justify-center gap-3">
                {items.map((a, i) => (
                  <span key={i} className="inline-block bg-gray-700/50 px-4 py-2 rounded-2xl shadow-inner text-3xl text-white">{a}</span>
                ))}
              </div>
              <p className="text-sm text-blue-200 mt-3 animate-pulse">🌍 Remember the positions!</p>
            </div>
          ) : question && mode === 'answer' ? (
            <div className="bg-gray-800/70 border-2 border-blue-400/30 rounded-3xl p-6 text-center shadow-xl backdrop-blur-sm animate-bounce-in">
              <p className="text-xl font-bold text-gray-200 mb-4">
                Which item was at position <span className="text-yellow-300 text-2xl">#{question.position}</span>?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    disabled={status === 'answered'}
                    className={`px-6 py-4 text-4xl rounded-2xl border-2 transition-all duration-300 ${
                      status === 'answered'
                        ? opt === question.correct
                          ? 'border-green-500 bg-green-400/30 text-green-200 shadow-lg shadow-green-500/30 scale-105'
                          : 'border-red-500 bg-red-400/30 text-red-200 shadow-lg shadow-red-500/30'
                        : 'border-gray-600 bg-gray-700/70 hover:border-blue-400 hover:bg-gray-600 hover:scale-110 hover:shadow-lg'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {status === 'correct' && (
                <div className="mt-4 p-3 bg-green-400/20 text-green-200 rounded-2xl border border-green-400/30 animate-bounce">
                  ✅ Correct! +10 points
                  <button onClick={handleNext} className="ml-4 px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30">
                    Next ➜
                  </button>
                </div>
              )}
              {status === 'wrong' && (
                <div className="mt-4 p-3 bg-red-400/20 text-red-200 rounded-2xl border border-red-400/30">
                  ❌ Oops! The correct was <span className="font-bold text-white text-2xl">{question.correct}</span>
                  <button onClick={handleNext} className="ml-4 px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30">
                    Next ➜
                  </button>
                </div>
              )}
            </div>
          ) : mode === 'watch' ? (
            <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next set loading...</div>
          ) : (
            <div className="text-center py-6 text-gray-400">Loading question...</div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// 5. HINDI VARNAMALA (NEW)
// ============================================================
const HindiVarnamalaGame: React.FC = () => {
  const [length, setLength] = useState<5 | 8 | 10>(5);
  const [displayTime, setDisplayTime] = useState<number>(3);
  const [mode, setMode] = useState<GameMode>('answer');
  const [sequence, setSequence] = useState('');
  const [showSequence, setShowSequence] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const autoNextRef = useRef<number | null>(null);

  const hindiLetters = ['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ','क','ख','ग','घ','च','छ','ज','झ','ट','ठ','ड','ढ','ण','त','थ','द','ध','न','प','फ','ब','भ','म','य','र','ल','व','श','ष','स','ह','क्ष','त्र','ज्ञ'];

  const generateSequence = () => {
    setLoading(true);
    setStatus('idle');
    setUserInput('');
    setShowSequence(false);
    const shuffled = shuffleArray([...hindiLetters]);
    const selected = shuffled.slice(0, length);
    setSequence(selected.join(''));
    setTimeout(() => setShowSequence(true), 200);
    setLoading(false);
  };

  useEffect(() => {
    generateSequence();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
    };
  }, [length]);

  useEffect(() => {
    if (showSequence) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowSequence(false);
        if (mode === 'watch') {
          autoNextRef.current = setTimeout(() => generateSequence(), 600);
        }
      }, displayTime * 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [showSequence, displayTime, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    if (userInput.trim() === sequence) {
      setStatus('correct');
      setTimeout(() => generateSequence(), 1000);
    } else {
      setStatus('wrong');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setUserInput('');
    generateSequence();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
        <div className="flex gap-1 flex-wrap">
          {[5, 8, 10].map(len => (
            <button
              key={len}
              onClick={() => setLength(len as typeof length)}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                length === len
                  ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg scale-105'
                  : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
              }`}
            >
              {len} अक्षर
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-300">⏱️</span>
          <select
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
            className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 outline-none"
          >
            {[1, 2, 3, 5, 10].map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
        <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
        <button
          onClick={() => setMode('answer')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'answer'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          ✍️ Answer
        </button>
        <button
          onClick={() => setMode('watch')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'watch'
              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          👁️ Watch
        </button>
        {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {showSequence ? (
            <div className="relative bg-gradient-to-br from-orange-300/20 via-red-300/20 to-yellow-300/20 border-2 border-orange-400/50 rounded-3xl p-10 text-center shadow-2xl shadow-orange-500/20 backdrop-blur-sm animate-bounce-in">
              <div className="text-5xl font-mono font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-300">
                {sequence.split('').join('  ')}
              </div>
              <p className="text-sm text-orange-200 mt-3 animate-pulse">🧠 क्रम याद रखें!</p>
            </div>
          ) : mode === 'watch' ? (
            <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ अगला सेट लोड हो रहा...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="अक्षर क्रम में टाइप करें"
                disabled={status === 'correct'}
                className="w-full px-6 py-4 text-center text-2xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={status === 'correct'}
                className="w-full py-4 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-2xl transition shadow-lg shadow-orange-400/30 text-lg"
              >
                ✅ जाँच करें
              </button>
            </form>
          )}

          {status === 'correct' && (
            <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
              ✅ सही! अगला सेट...
            </div>
          )}
          {status === 'wrong' && mode === 'answer' && (
            <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
              <p>❌ गलत! सही क्रम था: <span className="font-mono font-bold text-white text-2xl">{sequence}</span></p>
              <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
                🔄 पुनः प्रयास करें
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// 6. WORD MEMORY (existing)
// ============================================================
const WordMemoryGame: React.FC = () => {
  const [wordCount, setWordCount] = useState<4 | 6 | 8>(4);
  const [displayTime, setDisplayTime] = useState<number>(3);
  const [mode, setMode] = useState<GameMode>('answer');
  const [words, setWords] = useState<string[]>([]);
  const [showWords, setShowWords] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const autoNextRef = useRef<number | null>(null);

  const wordPool = {
    animals: ['Dog', 'Cat', 'Elephant', 'Lion', 'Tiger', 'Bear', 'Monkey', 'Giraffe', 'Zebra', 'Horse', 'Cow', 'Sheep', 'Duck', 'Chicken', 'Rabbit'],
    colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White', 'Gray', 'Cyan', 'Magenta', 'Teal', 'Lime'],
    family: ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Grandfather', 'Grandmother', 'Cousin', 'Nephew', 'Niece', 'Son', 'Daughter', 'Husband', 'Wife'],
    school: ['Teacher', 'Student', 'Classroom', 'Library', 'Principal', 'Exam', 'Homework', 'Subject', 'Math', 'Science', 'History', 'English', 'Computer', 'Garden', 'Playground']
  };
  const allWords = [...wordPool.animals, ...wordPool.colors, ...wordPool.family, ...wordPool.school];

  const fetchWords = () => {
    setLoading(true);
    setStatus('idle');
    setUserInput('');
    setShowWords(false);
    const shuffled = shuffleArray([...allWords]);
    const selected = shuffled.slice(0, wordCount);
    setWords(selected);
    setTimeout(() => setShowWords(true), 200);
    setLoading(false);
  };

  useEffect(() => {
    fetchWords();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
    };
  }, [wordCount]);

  useEffect(() => {
    if (showWords) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowWords(false);
        if (mode === 'watch') {
          autoNextRef.current = setTimeout(() => fetchWords(), 600);
        }
      }, displayTime * 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [showWords, displayTime, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const userWords = userInput.split(/[, ]+/).filter(w => w.trim() !== '').map(w => w.trim());
    if (userWords.length === words.length && userWords.every((w, idx) => w.toLowerCase() === words[idx].toLowerCase())) {
      setStatus('correct');
      setTimeout(() => fetchWords(), 1000);
    } else {
      setStatus('wrong');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setUserInput('');
    fetchWords();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
        <div className="flex gap-1 flex-wrap">
          {[4, 6, 8].map(n => (
            <button
              key={n}
              onClick={() => setWordCount(n as typeof wordCount)}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                wordCount === n
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-gray-900 shadow-lg scale-105'
                  : 'bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105'
              }`}
            >
              {n} words
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-300">⏱️</span>
          <select
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
            className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none"
          >
            {[1, 2, 3, 5, 10].map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
        <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
        <button
          onClick={() => setMode('answer')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'answer'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          ✍️ Answer
        </button>
        <button
          onClick={() => setMode('watch')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'watch'
              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          👁️ Watch
        </button>
        {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {showWords ? (
            <div className="relative bg-gradient-to-br from-purple-300/20 via-pink-300/20 to-rose-300/20 border-2 border-purple-400/50 rounded-3xl p-8 text-center shadow-2xl shadow-purple-500/20 backdrop-blur-sm animate-bounce-in">
              <div className="text-2xl font-mono font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 flex flex-wrap justify-center gap-3">
                {words.map((w, idx) => (
                  <span key={idx} className="bg-gray-700/50 px-5 py-2 rounded-2xl shadow-inner text-white text-xl">{w}</span>
                ))}
              </div>
              <p className="text-sm text-purple-200 mt-3 animate-pulse">📝 Remember the order!</p>
            </div>
          ) : mode === 'watch' ? (
            <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next set loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Type ${wordCount} words separated by commas or spaces`}
                disabled={status === 'correct'}
                className="w-full px-6 py-4 text-center text-xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={status === 'correct'}
                className="w-full py-4 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-purple-400/30 text-lg"
              >
                ✅ Check Answer
              </button>
            </form>
          )}

          {status === 'correct' && (
            <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
              ✅ Correct! Next set...
            </div>
          )}
          {status === 'wrong' && mode === 'answer' && (
            <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
              <p>❌ Oops! The words were: <span className="font-bold text-white">{words.join(' → ')}</span></p>
              <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
                🔄 Try New Words
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// 7. MATH GAME (now with displayTime)
// ============================================================
const MathMemoryGame: React.FC = () => {
  const [displayTime, setDisplayTime] = useState<number>(3);
  const [mode, setMode] = useState<GameMode>('answer');
  const [problem, setProblem] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<number | string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showProblem, setShowProblem] = useState(false);
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const autoNextRef = useRef<number | null>(null);

  const generateProblem = () => {
    setLoading(true);
    setStatus('idle');
    setUserInput('');
    setShowProblem(false);
    setExplanation('');

    const ops = ['+', '-', '×', '÷', '%'];
    const op = ops[Math.floor(Math.random() * ops.length)];

    let num1: number, num2: number;
    let answer: number | string;
    let problemText = '';
    let expl = '';

    switch (op) {
      case '+':
        num1 = randInt(1, 50);
        num2 = randInt(1, 50);
        answer = num1 + num2;
        problemText = `${num1} + ${num2} = ?`;
        expl = `${num1} + ${num2} = ${answer}`;
        break;

      case '-':
        num1 = randInt(1, 50);
        num2 = randInt(1, num1);
        answer = num1 - num2;
        problemText = `${num1} − ${num2} = ?`;
        expl = `${num1} − ${num2} = ${answer}`;
        break;

      case '×':
        num1 = randInt(1, 12);
        num2 = randInt(1, 12);
        answer = num1 * num2;
        problemText = `${num1} × ${num2} = ?`;
        expl = `${num1} × ${num2} = ${answer}`;
        break;

      case '÷':
        num1 = randInt(1, 100);
        num2 = randInt(1, 20);
        if (num1 < num2) [num1, num2] = [num2, num1];
        const quotient = Math.floor(num1 / num2);
        const remainder = num1 % num2;
        if (remainder === 0) {
          answer = quotient;
          problemText = `${num1} ÷ ${num2} = ?`;
          expl = `${num1} ÷ ${num2} = ${quotient} (exact division)`;
        } else {
          answer = quotient;
          problemText = `${num1} ÷ ${num2} = ? (Quotient only)`;
          expl = `${num1} ÷ ${num2} gives quotient ${quotient} and remainder ${remainder}. Remainder is the amount left over after division.`;
        }
        break;

      case '%':
        const percent = randInt(1, 100);
        const value = randInt(1, 200);
        const result = (percent / 100) * value;
        const rounded = Math.round(result * 100) / 100;
        answer = rounded;
        problemText = `What is ${percent}% of ${value}?`;
        expl = `${percent}% of ${value} = (${percent}/100) × ${value} = ${rounded}`;
        break;

      default:
        return;
    }

    setProblem(problemText);
    setCorrectAnswer(answer);
    setExplanation(expl);
    setTimeout(() => setShowProblem(true), 200);
    setLoading(false);
  };

  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    generateProblem();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
    };
  }, []);

  useEffect(() => {
    if (showProblem) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowProblem(false);
        if (mode === 'watch') {
          autoNextRef.current = setTimeout(() => generateProblem(), 600);
        }
      }, displayTime * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showProblem, displayTime, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const userAns = parseFloat(userInput.trim());
    if (isNaN(userAns)) {
      setStatus('wrong');
      return;
    }
    const isCorrect = Math.abs(userAns - Number(correctAnswer)) < 0.01;
    if (isCorrect) {
      setStatus('correct');
      setTimeout(() => generateProblem(), 1000);
    } else {
      setStatus('wrong');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setUserInput('');
    generateProblem();
  };

  const timeOptions = [1, 2, 3, 5, 10];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-2xl">
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-300">⏱️</span>
          <select
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
            className="bg-gray-700/70 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none"
          >
            {timeOptions.map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
        <span className="text-sm font-semibold text-gray-300">🎮 Mode:</span>
        <button
          onClick={() => setMode('answer')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'answer'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          ✍️ Answer
        </button>
        <button
          onClick={() => setMode('watch')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            mode === 'watch'
              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          👁️ Watch
        </button>
        {mode === 'watch' && <span className="text-xs text-pink-300 ml-2 animate-pulse">⏩ Auto‑next</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {showProblem ? (
            <div className="relative bg-gradient-to-br from-purple-300/20 via-pink-300/20 to-rose-300/20 border-2 border-purple-400/50 rounded-3xl p-10 text-center shadow-2xl shadow-purple-500/20 backdrop-blur-sm animate-bounce-in">
              <div className="text-4xl font-mono font-bold tracking-widest text-white">
                {problem}
              </div>
              <p className="text-sm text-purple-200 mt-3 animate-pulse">🧠 Solve this!</p>
            </div>
          ) : mode === 'watch' ? (
            <div className="text-center py-6 text-gray-400 italic animate-pulse">⏳ Next problem loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your answer"
                disabled={status === 'correct'}
                className="w-full px-6 py-4 text-center text-2xl bg-gray-800/70 border-2 border-gray-600 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition text-white placeholder-gray-500 disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={status === 'correct'}
                className="w-full py-4 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-2xl transition shadow-lg shadow-purple-400/30 text-lg"
              >
                ✅ Check Answer
              </button>
            </form>
          )}

          {status === 'correct' && (
            <div className="p-4 bg-green-400/20 border-2 border-green-400/50 text-green-200 rounded-2xl text-center backdrop-blur-sm animate-bounce">
              ✅ Correct! {explanation}
              <div className="text-sm text-green-300 mt-1">Next problem loading...</div>
            </div>
          )}
          {status === 'wrong' && mode === 'answer' && (
            <div className="p-5 bg-red-400/20 border-2 border-red-400/50 text-red-200 rounded-2xl text-center backdrop-blur-sm">
              <p>❌ Oops! The correct answer is: <span className="font-bold text-white text-2xl">{correctAnswer}</span></p>
              <p className="text-sm text-yellow-300 mt-2">{explanation}</p>
              <button onClick={handleRetry} className="mt-3 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30">
                🔄 Try Another
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const MemoryGames: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GameTab>('number');

  const tabs: { id: GameTab; label: string; icon: string }[] = [
    { id: 'number', label: 'Number Memory', icon: '🔢' },
    { id: 'alphabet', label: 'Alphabet Memory', icon: '🔤' },
    { id: 'animals', label: 'Animals', icon: '🐘' },
    { id: 'aroundus', label: 'Around Us', icon: '🏙️' },
    { id: 'hindivarnamala', label: 'हिंदी वर्णमाला', icon: '🇮🇳' },
    { id: 'word', label: 'Word Memory', icon: '📝' },
    { id: 'math', label: 'Math', icon: '🧮' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl shadow-indigo-500/10">
          <h1 className="text-5xl font-extrabold text-center text-white mb-8 flex items-center justify-center gap-4">
            <span className="text-6xl">🧠</span>
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Memory Games
            </span>
          </h1>

          <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-lg ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-gray-900 shadow-lg shadow-yellow-400/30 scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === 'number' && <NumberMemoryGame />}
            {activeTab === 'alphabet' && <AlphabetMemoryGame />}
            {activeTab === 'animals' && <AnimalsMemoryGame />}
            {activeTab === 'aroundus' && <AroundUsMemoryGame />}
            {activeTab === 'hindivarnamala' && <HindiVarnamalaGame />}
            {activeTab === 'word' && <WordMemoryGame />}
            {activeTab === 'math' && <MathMemoryGame />}
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
            🎯 Play, watch, and improve your memory!
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </div>
  );
};

export default MemoryGames;