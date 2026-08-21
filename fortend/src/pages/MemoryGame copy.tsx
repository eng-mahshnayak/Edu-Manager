// // MemoryGame.tsx
// import React, { useState, useEffect, useRef } from 'react';

// const API_BASE = 'http://localhost:5000/api';

// const MemoryGame: React.FC = () => {
//   const [level, setLevel] = useState(1);
//   const [currentNumber, setCurrentNumber] = useState('');
//   const [showNumber, setShowNumber] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);

//   useEffect(() => {
//     const fetchNumber = async () => {
//       setLoading(true);
//       setStatus('idle');
//       setUserInput('');
//       setShowNumber(false);
//       try {
//         const res = await fetch(`${API_BASE}/level/${level}`);
//         const data = await res.json();
//         setCurrentNumber(data.number);
//         setTimeout(() => setShowNumber(true), 100);
//       } catch {
//         setStatus('wrong');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNumber();
//   }, [level]);

//   useEffect(() => {
//     if (showNumber) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => setShowNumber(false), 3000);
//     }
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [showNumber]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;

//     try {
//       const res = await fetch(`${API_BASE}/verify`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ level, input: userInput.trim(), number: currentNumber }),
//       });
//       const data = await res.json();
//       if (data.correct) {
//         setStatus('correct');
//         setTimeout(() => setLevel((prev) => prev + 1), 1000);
//       } else {
//         setStatus('wrong');
//       }
//     } catch {
//       setStatus('wrong');
//     }
//   };

//   const digitCount = 4 + (level - 1) * 2;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
//         <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
//           🔢 Number Memory Game
//         </h1>
//         <p className="text-center text-gray-600 mb-6">
//           Level <span className="font-semibold text-blue-600">{level}</span> – 
//           <span className="ml-1 font-medium">{digitCount} digits</span>
//         </p>

//         {loading ? (
//           <div className="flex justify-center py-8">
//             <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
//           </div>
//         ) : (
//           <div>
//             {showNumber ? (
//               <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center mb-4">
//                 <div className="text-4xl font-mono font-bold tracking-widest text-blue-800">
//                   {currentNumber}
//                 </div>
//                 <p className="text-sm text-blue-600 mt-2">👀 Memorize this number</p>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                   type="text"
//                   value={userInput}
//                   onChange={(e) => setUserInput(e.target.value)}
//                   placeholder="Type the number…"
//                   disabled={status === 'correct'}
//                   autoFocus
//                   className="w-full px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:bg-gray-100"
//                 />
//                 <button
//                   type="submit"
//                   disabled={status === 'correct'}
//                   className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition duration-200"
//                 >
//                   ✅ Check
//                 </button>
//               </form>
//             )}

//             {status === 'correct' && (
//               <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center">
//                 ✅ Correct! Next level loading…
//               </div>
//             )}
//             {status === 'wrong' && (
//               <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg text-center">
//                 <p className="text-red-700">
//                   ❌ Wrong! The number was{' '}
//                   <span className="font-mono font-bold">{currentNumber}</span>
//                 </p>
//                 <button
//                   onClick={() => setStatus('idle')}
//                   className="mt-2 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
//                 >
//                   🔄 Retry
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MemoryGame;






// // MemoryGame.tsx
// import React, { useState, useEffect, useRef } from 'react';

// const API_BASE = 'http://localhost:5000/api';

// const MemoryGame: React.FC = () => {
//   // ---------- State ----------
//   const [digits, setDigits] = useState<4>(4); // Default 4-digit
//   const [displayTime, setDisplayTime] = useState<number>(3); // seconds
//   const [currentNumber, setCurrentNumber] = useState('');
//   const [showNumber, setShowNumber] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'waiting'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);

//   // ---------- Fetch number based on digit count ----------
//   const fetchNumber = async () => {
//     setLoading(true);
//     setStatus('idle');
//     setUserInput('');
//     setShowNumber(false);
//     try {
//       const res = await fetch(`${API_BASE}/number/${digits}`);
//       const data = await res.json();
//       setCurrentNumber(data.number);
//       // Show number after a tiny delay
//       setTimeout(() => setShowNumber(true), 200);
//     } catch (error) {
//       console.error('Fetch error:', error);
//       setStatus('wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // When digits change, fetch new number
//   useEffect(() => {
//     fetchNumber();
//     // Cleanup timer
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [digits]);

//   // Timer to hide number after displayTime seconds
//   useEffect(() => {
//     if (showNumber) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowNumber(false);
//       }, displayTime * 1000);
//     }
//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [showNumber, displayTime]);

//   // ---------- Submit user answer ----------
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;

//     try {
//       const res = await fetch(`${API_BASE}/verify`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           number: currentNumber,
//           input: userInput.trim(),
//         }),
//       });
//       const data = await res.json();
//       if (data.correct) {
//         setStatus('correct');
//         // After correct, fetch a new number after a short delay
//         setTimeout(() => {
//           fetchNumber();
//         }, 1000);
//       } else {
//         setStatus('wrong');
//       }
//     } catch {
//       setStatus('wrong');
//     }
//   };

//   // ---------- Retry ----------
//   const handleRetry = () => {
//     setStatus('idle');
//     setUserInput('');
//     fetchNumber();
//   };

//   // ---------- Digit options ----------
//   const digitOptions = [2, 4, 6, 8];

//   // ---------- Time options (seconds) ----------
//   const timeOptions = [1, 2, 3, 5, 10];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
//         <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
//           🔢 Number Memory Game
//         </h1>

//         {/* ---------- Controls ---------- */}
//         <div className="mb-6">
//           {/* Digit Tabs */}
//           <div className="flex justify-center space-x-2 mb-4">
//             {digitOptions.map((d) => (
//               <button
//                 key={d}
//                 onClick={() => setDigits(d as typeof digits)}
//                 className={`px-4 py-2 rounded-lg font-semibold transition ${
//                   digits === d
//                     ? 'bg-blue-600 text-white shadow-md'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 {d}-digit
//               </button>
//             ))}
//           </div>

//           {/* Time Selector */}
//           <div className="flex items-center justify-center space-x-3">
//             <span className="text-gray-700 font-medium">⏱️ Show for</span>
//             <select
//               value={displayTime}
//               onChange={(e) => setDisplayTime(Number(e.target.value))}
//               className="border-2 border-gray-300 rounded-lg px-3 py-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//             >
//               {timeOptions.map((t) => (
//                 <option key={t} value={t}>
//                   {t} sec
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* ---------- Game Area ---------- */}
//         {loading ? (
//           <div className="flex justify-center py-8">
//             <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
//           </div>
//         ) : (
//           <div>
//             {showNumber ? (
//               <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center mb-4">
//                 <div className="text-4xl font-mono font-bold tracking-widest text-blue-800">
//                   {currentNumber}
//                 </div>
//                 <p className="text-sm text-blue-600 mt-2">
//                   👀 Memorize this {digits}-digit number
//                 </p>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                   type="text"
//                   value={userInput}
//                   onChange={(e) => setUserInput(e.target.value)}
//                   placeholder={`Type the ${digits}-digit number…`}
//                   disabled={status === 'correct'}
//                   autoFocus
//                   className="w-full px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:bg-gray-100"
//                 />
//                 <button
//                   type="submit"
//                   disabled={status === 'correct'}
//                   className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition duration-200"
//                 >
//                   ✅ Check
//                 </button>
//               </form>
//             )}

//             {status === 'correct' && (
//               <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center">
//                 ✅ Correct! Generating next number…
//               </div>
//             )}
//             {status === 'wrong' && (
//               <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg text-center">
//                 <p className="text-red-700">
//                   ❌ Wrong! The number was{' '}
//                   <span className="font-mono font-bold">{currentNumber}</span>
//                 </p>
//                 <button
//                   onClick={handleRetry}
//                   className="mt-2 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
//                 >
//                   🔄 Retry
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MemoryGame;






// // MemoryGames.tsx
// import React, { useState, useEffect, useRef } from 'react';

// const API_BASE = 'http://localhost:5000/api';

// // --------------------- Types ---------------------
// type GameTab = 'match' | 'number' | 'alphabet' | 'animal';

// // --------------------- Helper ---------------------
// const shuffleArray = <T,>(arr: T[]): T[] => {
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// };

// // ============================================================
// // 1. MATCH IMAGES GAME
// // ============================================================
// const MatchImagesGame: React.FC = () => {
//   const [gridSize, setGridSize] = useState<4 | 6 | 8>(4);
//   const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
//   const [selected, setSelected] = useState<number[]>([]);
//   const [score, setScore] = useState(0);
//   const [moves, setMoves] = useState(0);
//   const [status, setStatus] = useState<'playing' | 'won'>('playing');

//   const emojiPool = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🪲', '🪰', '🪱', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦤', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'];

//   const initGame = () => {
//     const totalPairs = (gridSize * gridSize) / 2;
//     const chosenEmojis = shuffleArray(emojiPool).slice(0, totalPairs);
//     const deck = shuffleArray([...chosenEmojis, ...chosenEmojis]).map((emoji, index) => ({
//       id: index,
//       emoji,
//       flipped: false,
//       matched: false,
//     }));
//     setCards(deck);
//     setSelected([]);
//     setScore(0);
//     setMoves(0);
//     setStatus('playing');
//   };

//   useEffect(() => {
//     initGame();
//   }, [gridSize]);

//   const handleCardClick = (index: number) => {
//     if (status === 'won') return;
//     const card = cards[index];
//     if (card.flipped || card.matched) return;
//     if (selected.length === 2) return;

//     // Flip the card
//     const newCards = [...cards];
//     newCards[index].flipped = true;
//     setCards(newCards);
//     const newSelected = [...selected, index];
//     setSelected(newSelected);

//     if (newSelected.length === 2) {
//       setMoves(prev => prev + 1);
//       const [i1, i2] = newSelected;
//       if (cards[i1].emoji === cards[i2].emoji) {
//         // Match
//         const matchedCards = [...cards];
//         matchedCards[i1].matched = true;
//         matchedCards[i2].matched = true;
//         setCards(matchedCards);
//         setScore(prev => prev + 10);
//         setSelected([]);
//         // Check win
//         if (matchedCards.every(c => c.matched)) {
//           setStatus('won');
//         }
//       } else {
//         // No match: flip back after delay
//         setTimeout(() => {
//           const resetCards = [...cards];
//           resetCards[i1].flipped = false;
//           resetCards[i2].flipped = false;
//           setCards(resetCards);
//           setSelected([]);
//         }, 600);
//       }
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-wrap items-center justify-between gap-2">
//         <div className="flex gap-2">
//           {[4, 6, 8].map(size => (
//             <button
//               key={size}
//               onClick={() => setGridSize(size as typeof gridSize)}
//               className={`px-3 py-1 rounded-lg font-medium transition ${
//                 gridSize === size ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//               }`}
//             >
//               {size}×{size}
//             </button>
//           ))}
//         </div>
//         <div className="text-sm font-medium text-gray-700">
//           Moves: {moves} | Score: {score}
//         </div>
//       </div>

//       <div className={`grid gap-2 mx-auto`} style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
//         {cards.map((card, idx) => (
//           <button
//             key={card.id}
//             onClick={() => handleCardClick(idx)}
//             className={`aspect-square text-3xl rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
//               card.flipped || card.matched
//                 ? 'bg-white border-blue-300 shadow'
//                 : 'bg-blue-200 border-blue-400 hover:bg-blue-300'
//             }`}
//             disabled={card.flipped || card.matched || selected.length === 2}
//           >
//             {card.flipped || card.matched ? card.emoji : '🂠'}
//           </button>
//         ))}
//       </div>

//       {status === 'won' && (
//         <div className="text-center p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg">
//           🎉 You matched all! Score: {score}
//           <button onClick={initGame} className="ml-3 px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//             Play Again
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // 2. NUMBER MEMORY GAME (already built, just re-export)
// // ============================================================
// const NumberMemoryGame: React.FC = () => {
//   const [digits, setDigits] = useState<2 | 4 | 6 | 8>(4);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [number, setNumber] = useState('');
//   const [showNumber, setShowNumber] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);

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
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [digits]);

//   useEffect(() => {
//     if (showNumber) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => setShowNumber(false), displayTime * 1000);
//     }
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [showNumber, displayTime]);

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
//     <div className="space-y-4">
//       <div className="flex flex-wrap items-center gap-2">
//         <div className="flex gap-1">
//           {digitOptions.map(d => (
//             <button
//               key={d}
//               onClick={() => setDigits(d)}
//               className={`px-3 py-1 rounded-lg font-medium transition ${
//                 digits === d ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//               }`}
//             >
//               {d}-digit
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-600">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
//           >
//             {timeOptions.map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//         </div>
//       ) : (
//         <>
//           {showNumber ? (
//             <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
//               <div className="text-4xl font-mono font-bold tracking-widest text-blue-800">{number}</div>
//               <p className="text-sm text-blue-600 mt-1">👀 Memorize</p>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 placeholder={`Type ${digits} digits`}
//                 disabled={status === 'correct'}
//                 className="w-full px-4 py-2 text-center text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:bg-gray-100"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 disabled={status === 'correct'}
//                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-xl transition"
//               >
//                 ✅ Check
//               </button>
//             </form>
//           )}

//           {status === 'correct' && (
//             <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center">
//               ✅ Correct! Next number...
//             </div>
//           )}
//           {status === 'wrong' && (
//             <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-center">
//               <p className="text-red-700">❌ Wrong! The number was <span className="font-mono font-bold">{number}</span></p>
//               <button onClick={handleRetry} className="mt-2 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
//                 🔄 Retry
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // 3. ALPHABET MEMORY GAME
// // ============================================================
// const AlphabetMemoryGame: React.FC = () => {
//   const [length, setLength] = useState<5 | 8 | 10>(5);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [sequence, setSequence] = useState('');
//   const [showSequence, setShowSequence] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);

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
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [length]);

//   useEffect(() => {
//     if (showSequence) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => setShowSequence(false), displayTime * 1000);
//     }
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [showSequence, displayTime]);

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
//     <div className="space-y-4">
//       <div className="flex flex-wrap items-center gap-2">
//         <div className="flex gap-1">
//           {[5, 8, 10].map(len => (
//             <button
//               key={len}
//               onClick={() => setLength(len as typeof length)}
//               className={`px-3 py-1 rounded-lg font-medium transition ${
//                 length === len ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//               }`}
//             >
//               {len} letters
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-600">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
//           >
//             {[1,2,3,5,10].map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//         </div>
//       ) : (
//         <>
//           {showSequence ? (
//             <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
//               <div className="text-3xl font-mono font-bold tracking-widest text-blue-800">
//                 {sequence.split('').join('  ')}
//               </div>
//               <p className="text-sm text-blue-600 mt-1">🧠 Remember the order</p>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value.toUpperCase())}
//                 placeholder="Type letters in order"
//                 disabled={status === 'correct'}
//                 className="w-full px-4 py-2 text-center text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:bg-gray-100"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 disabled={status === 'correct'}
//                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-xl transition"
//               >
//                 ✅ Check
//               </button>
//             </form>
//           )}

//           {status === 'correct' && (
//             <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center">
//               ✅ Correct! Next set...
//             </div>
//           )}
//           {status === 'wrong' && (
//             <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-center">
//               <p className="text-red-700">❌ Wrong! The sequence was <span className="font-mono font-bold">{sequence}</span></p>
//               <button onClick={handleRetry} className="mt-2 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
//                 🔄 Retry
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // 4. ANIMAL MEMORY GAME (with MCQ)
// // ============================================================
// const AnimalMemoryGame: React.FC = () => {
//   const [count, setCount] = useState<5 | 8 | 10>(5);
//   const [displayTime, setDisplayTime] = useState<number>(3);
//   const [animals, setAnimals] = useState<string[]>([]);
//   const [showAnimals, setShowAnimals] = useState(false);
//   const [question, setQuestion] = useState<{ position: number; options: string[]; correct: string } | null>(null);
//   const [score, setScore] = useState(0);
//   const [status, setStatus] = useState<'idle' | 'answered' | 'correct' | 'wrong'>('idle');
//   const [loading, setLoading] = useState(false);
//   const timerRef = useRef<number | null>(null);

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
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [count]);

//   useEffect(() => {
//     if (showAnimals) {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       timerRef.current = setTimeout(() => {
//         setShowAnimals(false);
//         // Generate question after hide
//         generateQuestion();
//       }, displayTime * 1000);
//     }
//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [showAnimals, displayTime]);

//   const generateQuestion = () => {
//     if (animals.length === 0) return;
//     const pos = Math.floor(Math.random() * animals.length);
//     const correct = animals[pos];
//     // Generate 3 wrong options from a pool (avoid duplicates)
//     const pool = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🪲', '🪰', '🪱', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦤', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'];
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

//   const handleNext = () => {
//     fetchAnimals();
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-wrap items-center gap-2">
//         <div className="flex gap-1">
//           {[5,8,10].map(n => (
//             <button
//               key={n}
//               onClick={() => setCount(n as typeof count)}
//               className={`px-3 py-1 rounded-lg font-medium transition ${
//                 count === n ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//               }`}
//             >
//               {n} animals
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <span className="text-sm text-gray-600">⏱️</span>
//           <select
//             value={displayTime}
//             onChange={(e) => setDisplayTime(Number(e.target.value))}
//             className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
//           >
//             {[1,2,3,5,10].map(t => <option key={t} value={t}>{t}s</option>)}
//           </select>
//           <span className="text-sm font-medium text-gray-700">Score: {score}</span>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//         </div>
//       ) : (
//         <>
//           {showAnimals ? (
//             <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
//               <div className="text-3xl font-mono tracking-widest flex flex-wrap justify-center gap-2">
//                 {animals.map((a, i) => (
//                   <span key={i} className="inline-block p-1">{a}</span>
//                 ))}
//               </div>
//               <p className="text-sm text-blue-600 mt-1">🐾 Remember the positions</p>
//             </div>
//           ) : question ? (
//             <div className="bg-white border-2 border-blue-200 rounded-xl p-4 text-center">
//               <p className="text-lg font-medium text-gray-700 mb-3">
//                 Which animal was at position <span className="text-blue-600 font-bold">{question.position}</span>?
//               </p>
//               <div className="flex flex-wrap justify-center gap-2">
//                 {question.options.map((opt, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => handleAnswer(opt)}
//                     disabled={status === 'answered'}
//                     className={`px-4 py-2 text-2xl rounded-lg border-2 transition ${
//                       status === 'answered'
//                         ? opt === question.correct
//                           ? 'border-green-500 bg-green-100'
//                           : 'border-red-400 bg-red-100'
//                         : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
//                     }`}
//                   >
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//               {status === 'correct' && (
//                 <div className="mt-3 p-2 bg-green-100 text-green-800 rounded-lg">
//                   ✅ Correct! +10 points
//                   <button onClick={handleNext} className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                     Next ➜
//                   </button>
//                 </div>
//               )}
//               {status === 'wrong' && (
//                 <div className="mt-3 p-2 bg-red-50 text-red-700 rounded-lg">
//                   ❌ Wrong! The correct was <span className="font-bold">{question.correct}</span>
//                   <button onClick={handleNext} className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                     Next ➜
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="text-center py-4 text-gray-500">Loading question...</div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ============================================================
// // MAIN COMPONENT – MemoryGames with Tabs
// // ============================================================
// const MemoryGames: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<GameTab>('match');

//   const tabs: { id: GameTab; label: string; icon: string }[] = [
//     { id: 'match', label: 'Match Images', icon: '🖼️' },
//     { id: 'number', label: 'Number Memory', icon: '🔢' },
//     { id: 'alphabet', label: 'Alphabet Memory', icon: '🔤' },
//     { id: 'animal', label: 'Animal Memory', icon: '🐘' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full">
//         <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
//           🧠 Memory Games
//         </h1>

//         {/* Tabs */}
//         <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
//           {tabs.map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`px-4 py-2 rounded-t-lg font-medium transition ${
//                 activeTab === tab.id
//                   ? 'bg-blue-600 text-white shadow-md'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               {tab.icon} {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="mt-4">
//           {activeTab === 'match' && <MatchImagesGame />}
//           {activeTab === 'number' && <NumberMemoryGame />}
//           {activeTab === 'alphabet' && <AlphabetMemoryGame />}
//           {activeTab === 'animal' && <AnimalMemoryGame />}
//         </div>

//         {/* Footer: simple stats placeholder */}
//         <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
//           🎯 Play & improve your memory!
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MemoryGames;






// MemoryGames.tsx
import React, { useState, useEffect, useRef } from 'react';

const API_BASE = 'http://localhost:5000/api';

// --------------------- Types ---------------------
type GameTab = 'match' | 'number' | 'alphabet' | 'animal';

// --------------------- Helper ---------------------
const shuffleArray = <T,>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// ============================================================
// 1. MATCH IMAGES GAME (Dark Theme)
// ============================================================
const MatchImagesGame: React.FC = () => {
  const [gridSize, setGridSize] = useState<4 | 6 | 8>(4);
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won'>('playing');

  const emojiPool = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🐣','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🪲','🪰','🪱','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔'];

  const initGame = () => {
    const totalPairs = (gridSize * gridSize) / 2;
    const chosenEmojis = shuffleArray(emojiPool).slice(0, totalPairs);
    const deck = shuffleArray([...chosenEmojis, ...chosenEmojis]).map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false,
    }));
    setCards(deck);
    setSelected([]);
    setScore(0);
    setMoves(0);
    setStatus('playing');
  };

  useEffect(() => { initGame(); }, [gridSize]);

  const handleCardClick = (index: number) => {
    if (status === 'won') return;
    const card = cards[index];
    if (card.flipped || card.matched) return;
    if (selected.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [i1, i2] = newSelected;
      if (cards[i1].emoji === cards[i2].emoji) {
        const matchedCards = [...cards];
        matchedCards[i1].matched = true;
        matchedCards[i2].matched = true;
        setCards(matchedCards);
        setScore(prev => prev + 10);
        setSelected([]);
        if (matchedCards.every(c => c.matched)) setStatus('won');
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[i1].flipped = false;
          resetCards[i2].flipped = false;
          setCards(resetCards);
          setSelected([]);
        }, 600);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          {[4,6,8].map(size => (
            <button
              key={size}
              onClick={() => setGridSize(size as typeof gridSize)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                gridSize === size ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {size}×{size}
            </button>
          ))}
        </div>
        <div className="text-sm font-medium text-gray-300">
          Moves: <span className="text-white">{moves}</span> | Score: <span className="text-yellow-400">{score}</span>
        </div>
      </div>

      <div className={`grid gap-2 mx-auto`} style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square text-3xl rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
              card.flipped || card.matched
                ? 'bg-gray-800 border-blue-500 shadow-lg'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
            }`}
            disabled={card.flipped || card.matched || selected.length === 2}
          >
            {card.flipped || card.matched ? card.emoji : '🂠'}
          </button>
        ))}
      </div>

      {status === 'won' && (
        <div className="text-center p-3 bg-green-900/40 border border-green-700 text-green-300 rounded-lg">
          🎉 You matched all! Score: {score}
          <button onClick={initGame} className="ml-3 px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// 2. NUMBER MEMORY GAME (Dark Theme)
// ============================================================
const NumberMemoryGame: React.FC = () => {
  const [digits, setDigits] = useState<2 | 4 | 6 | 8>(4);
  const [displayTime, setDisplayTime] = useState<number>(3);
  const [number, setNumber] = useState('');
  const [showNumber, setShowNumber] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  const fetchNumber = async () => {
    setLoading(true);
    setStatus('idle');
    setUserInput('');
    setShowNumber(false);
    try {
      const res = await fetch(`${API_BASE}/number/${digits}`);
      const data = await res.json();
      setNumber(data.number);
      setTimeout(() => setShowNumber(true), 200);
    } catch {
      setStatus('wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumber();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [digits]);

  useEffect(() => {
    if (showNumber) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowNumber(false), displayTime * 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [showNumber, displayTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, input: userInput.trim() }),
      });
      const data = await res.json();
      if (data.correct) {
        setStatus('correct');
        setTimeout(() => fetchNumber(), 1000);
      } else {
        setStatus('wrong');
      }
    } catch {
      setStatus('wrong');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setUserInput('');
    fetchNumber();
  };

  const digitOptions = [2,4,6,8] as const;
  const timeOptions = [1,2,3,5,10];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1">
          {digitOptions.map(d => (
            <button
              key={d}
              onClick={() => setDigits(d)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                digits === d ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {d}-digit
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-400">⏱️</span>
          <select
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            {timeOptions.map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {showNumber ? (
            <div className="bg-gray-800 border-2 border-blue-500 rounded-xl p-6 text-center">
              <div className="text-4xl font-mono font-bold tracking-widest text-blue-300">{number}</div>
              <p className="text-sm text-blue-400 mt-1">👀 Memorize</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Type ${digits} digits`}
                disabled={status === 'correct'}
                className="w-full px-4 py-2 text-center text-xl bg-gray-800 border-2 border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition text-white placeholder-gray-500 disabled:bg-gray-700 disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={status === 'correct'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-xl transition"
              >
                ✅ Check
              </button>
            </form>
          )}

          {status === 'correct' && (
            <div className="p-3 bg-green-900/40 border border-green-700 text-green-300 rounded-lg text-center">
              ✅ Correct! Next number...
            </div>
          )}
          {status === 'wrong' && (
            <div className="p-4 bg-red-900/40 border border-red-700 text-red-300 rounded-lg text-center">
              <p>❌ Wrong! The number was <span className="font-mono font-bold text-white">{number}</span></p>
              <button onClick={handleRetry} className="mt-2 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                🔄 Retry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// 3. ALPHABET MEMORY GAME (Dark Theme)
// ============================================================
const AlphabetMemoryGame: React.FC = () => {
  const [length, setLength] = useState<5 | 8 | 10>(5);
  const [displayTime, setDisplayTime] = useState<number>(3);
  const [sequence, setSequence] = useState('');
  const [showSequence, setShowSequence] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  const fetchLetters = async () => {
    setLoading(true);
    setStatus('idle');
    setUserInput('');
    setShowSequence(false);
    try {
      const res = await fetch(`${API_BASE}/alphabet/${length}`);
      const data = await res.json();
      setSequence(data.letters);
      setTimeout(() => setShowSequence(true), 200);
    } catch {
      setStatus('wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [length]);

  useEffect(() => {
    if (showSequence) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowSequence(false), displayTime * 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [showSequence, displayTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: sequence, input: userInput.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (data.correct) {
        setStatus('correct');
        setTimeout(() => fetchLetters(), 1000);
      } else {
        setStatus('wrong');
      }
    } catch {
      setStatus('wrong');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setUserInput('');
    fetchLetters();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1">
          {[5,8,10].map(len => (
            <button
              key={len}
              onClick={() => setLength(len as typeof length)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                length === len ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {len} letters
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-400">⏱️</span>
          <select
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            {[1,2,3,5,10].map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {showSequence ? (
            <div className="bg-gray-800 border-2 border-blue-500 rounded-xl p-6 text-center">
              <div className="text-3xl font-mono font-bold tracking-widest text-blue-300">
                {sequence.split('').join('  ')}
              </div>
              <p className="text-sm text-blue-400 mt-1">🧠 Remember the order</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                placeholder="Type letters in order"
                disabled={status === 'correct'}
                className="w-full px-4 py-2 text-center text-xl bg-gray-800 border-2 border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition text-white placeholder-gray-500 disabled:bg-gray-700 disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={status === 'correct'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-xl transition"
              >
                ✅ Check
              </button>
            </form>
          )}

          {status === 'correct' && (
            <div className="p-3 bg-green-900/40 border border-green-700 text-green-300 rounded-lg text-center">
              ✅ Correct! Next set...
            </div>
          )}
          {status === 'wrong' && (
            <div className="p-4 bg-red-900/40 border border-red-700 text-red-300 rounded-lg text-center">
              <p>❌ Wrong! The sequence was <span className="font-mono font-bold text-white">{sequence}</span></p>
              <button onClick={handleRetry} className="mt-2 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                🔄 Retry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// 4. ANIMAL MEMORY GAME (Dark Theme)
// ============================================================
const AnimalMemoryGame: React.FC = () => {
  const [count, setCount] = useState<5 | 8 | 10>(5);
  const [displayTime, setDisplayTime] = useState<number>(3);
  const [animals, setAnimals] = useState<string[]>([]);
  const [showAnimals, setShowAnimals] = useState(false);
  const [question, setQuestion] = useState<{ position: number; options: string[]; correct: string } | null>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'answered' | 'correct' | 'wrong'>('idle');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  const fetchAnimals = async () => {
    setLoading(true);
    setStatus('idle');
    setShowAnimals(false);
    setQuestion(null);
    try {
      const res = await fetch(`${API_BASE}/animals/${count}`);
      const data = await res.json();
      setAnimals(data.animals);
      setTimeout(() => setShowAnimals(true), 200);
    } catch {
      setStatus('wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [count]);

  useEffect(() => {
    if (showAnimals) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowAnimals(false);
        generateQuestion();
      }, displayTime * 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [showAnimals, displayTime]);

  const generateQuestion = () => {
    if (animals.length === 0) return;
    const pos = Math.floor(Math.random() * animals.length);
    const correct = animals[pos];
    const pool = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🐣','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🪲','🪰','🪱','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔'];
    const wrongOptions = shuffleArray(pool.filter(e => e !== correct)).slice(0, 3);
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

  const handleNext = () => fetchAnimals();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1">
          {[5,8,10].map(n => (
            <button
              key={n}
              onClick={() => setCount(n as typeof count)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                count === n ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {n} animals
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-400">⏱️</span>
          <select
            value={displayTime}
            onChange={(e) => setDisplayTime(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            {[1,2,3,5,10].map(t => <option key={t} value={t}>{t}s</option>)}
          </select>
          <span className="text-sm font-medium text-yellow-400">Score: {score}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {showAnimals ? (
            <div className="bg-gray-800 border-2 border-blue-500 rounded-xl p-6 text-center">
              <div className="text-3xl font-mono tracking-widest flex flex-wrap justify-center gap-2">
                {animals.map((a, i) => (
                  <span key={i} className="inline-block p-1">{a}</span>
                ))}
              </div>
              <p className="text-sm text-blue-400 mt-1">🐾 Remember the positions</p>
            </div>
          ) : question ? (
            <div className="bg-gray-800 border-2 border-blue-500 rounded-xl p-4 text-center">
              <p className="text-lg font-medium text-gray-200 mb-3">
                Which animal was at position <span className="text-blue-400 font-bold">{question.position}</span>?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    disabled={status === 'answered'}
                    className={`px-4 py-2 text-2xl rounded-lg border-2 transition ${
                      status === 'answered'
                        ? opt === question.correct
                          ? 'border-green-500 bg-green-900/40 text-green-300'
                          : 'border-red-500 bg-red-900/40 text-red-300'
                        : 'border-gray-600 bg-gray-700 hover:border-blue-400 hover:bg-gray-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {status === 'correct' && (
                <div className="mt-3 p-2 bg-green-900/40 text-green-300 rounded-lg">
                  ✅ Correct! +10 points
                  <button onClick={handleNext} className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Next ➜
                  </button>
                </div>
              )}
              {status === 'wrong' && (
                <div className="mt-3 p-2 bg-red-900/40 text-red-300 rounded-lg">
                  ❌ Wrong! The correct was <span className="font-bold text-white">{question.correct}</span>
                  <button onClick={handleNext} className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Next ➜
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">Loading question...</div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT – MemoryGames with Dark Theme
// ============================================================
const MemoryGames: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GameTab>('match');

  const tabs: { id: GameTab; label: string; icon: string }[] = [
    { id: 'match', label: 'Match Images', icon: '🖼️' },
    { id: 'number', label: 'Number Memory', icon: '🔢' },
    { id: 'alphabet', label: 'Alphabet Memory', icon: '🔤' },
    { id: 'animal', label: 'Animal Memory', icon: '🐘' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-white mb-6 flex items-center justify-center gap-2">
            <span className="text-blue-400">🧠</span> Memory Games
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="mt-4 text-gray-200">
            {activeTab === 'match' && <MatchImagesGame />}
            {activeTab === 'number' && <NumberMemoryGame />}
            {activeTab === 'alphabet' && <AlphabetMemoryGame />}
            {activeTab === 'animal' && <AnimalMemoryGame />}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
            🎯 Play & improve your memory!
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGames;