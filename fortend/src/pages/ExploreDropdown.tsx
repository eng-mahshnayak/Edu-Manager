// import React, { useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// // ---------- Dropdown Data ----------
// const exploreData = {
//   categories: [
//     {
//       label: 'Basic Knowledge',
//       value: 'basic',
//       subItems: [
//         { label: '🍎 Fruits', value: 'fruits' },
//         { label: '🐶 Animals', value: 'animals' },
//         { label: '🐦 Birds', value: 'birds' },
//         { label: '🌸 Flowers', value: 'flowers' },
//         { label: '🌳 Trees & Plants', value: 'trees' },
//         { label: '🥕 Vegetables', value: 'vegetables' },
//          { label: '🪑 Things Around Us', value: 'things' },
//          { label: '🚗 Transport', value: 'transport' },
//           { label: '👨‍👩‍👧 People', value: 'people' },
//     { label: '❤️ Family & Relations', value: 'relations' },
//       ],
//     },
//     {
//       label: '🌍 World Explorer',
//       value: 'world',
//       subItems: [
//         { label: '🌎 Countries', value: 'countries' },
//         { label: '🏙️ Cities', value: 'cities' },
//         { label: '🗺️ States of India', value: 'states' },
//         { label: '🏛️ Famous Places', value: 'places' },
//         { label: '🏰 Monuments', value: 'monuments' },
//         { label: '🏔️ Mountains', value: 'mountains' },
//         { label: '🌊 Rivers', value: 'rivers' },
//         { label: '🌊 Oceans & Seas', value: 'oceans' },
//         { label: '🏝️ Islands', value: 'islands' },
//         { label: '🌋 Volcanoes', value: 'volcanoes' },
//       ],
//     },
//     {
//       label: '🔬 Science Explorer',
//       value: 'science',
//       subItems: [
//         { label: '🫀 Human Body', value: 'humanBody' },
//         { label: '🦴 Bones', value: 'bones' },
//         { label: '🧠 Brain & Nervous System', value: 'brain' },
//         { label: '🫁 Organs', value: 'organs' },
//         { label: '🌱 Plant Parts', value: 'plantParts' },
//         { label: '☀️ Solar System', value: 'solarSystem' },
//         { label: '🪐 Planets', value: 'planets' },
//         { label: '⭐ Stars & Galaxies', value: 'stars' },
//         { label: '🌙 Moon', value: 'moon' },
//         { label: '⚡ Electricity', value: 'electricity' },
//         { label: '🧲 Magnets', value: 'magnets' },
//         { label: '💧 Water Cycle', value: 'waterCycle' },
//         { label: '☁️ Weather', value: 'weather' },
//         { label: '🌈 Natural Phenomena', value: 'phenomena' },
//         { label: '🔬 Simple Experiments', value: 'experiments' },
//       ],
//     },
//     {
//       label: '📚 English / Language',
//       value: 'english',
//       subItems: [
//         { label: '🔤 ABC / Alphabet', value: 'abc' },
//         { label: '📖 Vocabulary', value: 'vocabulary' },
//         { label: '📝 Spelling', value: 'spelling' },
//         { label: '🔠 Opposite Words', value: 'opposites' },
//         { label: '🔗 Synonyms', value: 'synonyms' },
//         { label: '🗣️ Daily-use English', value: 'dailyEnglish' },
//         { label: '🖼️ Picture Vocabulary', value: 'pictureVocab' },
//         { label: '📚 Story Learning', value: 'storyLearning' },
//         { label: '✍️ Grammar', value: 'grammar' },
//         { label: '🔊 Pronunciation', value: 'pronunciation' },
//       ],
//     },
//     {
//       label: '🧠 GK',
//       value: 'gk',
//       subItems: [
//         { label: '🇮🇳 Indian States & Capitals', value: 'indianStates' },
//         { label: '👨‍🚀 Famous Scientists', value: 'scientists' },
//         { label: '🦸 National Heroes', value: 'heroes' },
//         { label: '🇮🇳 Indian National Symbols', value: 'symbols' },
//         { label: '🏆 Sports', value: 'sports' },
//         { label: '🌍 World Records', value: 'records' },
//         { label: '💡 Inventions', value: 'inventions' },
//         { label: '👑 Historical Kings & Queens', value: 'kings' },
//         { label: '📅 Important Days', value: 'importantDays' },
//         { label: '📰 Age-appropriate Current Affairs', value: 'currentAffairs' },
//       ],
//     },
//   ],
// };

// // Emoji + Color mapping for UI
// const categoryEmoji: Record<string, string> = {
//   fruits: '🍎', animals: '🐶', birds: '🐦', flowers: '🌸',
//   trees: '🌳', vegetables: '🥕', countries: '🌍', cities: '🏙️',
//   states: '🗺️', places: '🏛️', monuments: '🏰', mountains: '🏔️',
//   rivers: '🌊', oceans: '🌊', islands: '🏝️', volcanoes: '🌋',
//   humanBody: '🫀', bones: '🦴', brain: '🧠', organs: '🫁',
//   plantParts: '🌱', solarSystem: '☀️', planets: '🪐', stars: '⭐',
//   moon: '🌙', electricity: '⚡', magnets: '🧲', waterCycle: '💧',
//   weather: '☁️', phenomena: '🌈', experiments: '🔬',
//   abc: '🔤', vocabulary: '📖', spelling: '📝', opposites: '🔠',
//   synonyms: '🔗', dailyEnglish: '🗣️', pictureVocab: '🖼️',
//   storyLearning: '📚', grammar: '✍️', pronunciation: '🔊',
//   indianStates: '🇮🇳', scientists: '👨‍🚀', heroes: '🦸',
//   symbols: '🇮🇳', sports: '🏆', records: '🌍', inventions: '💡',
//   kings: '👑', importantDays: '📅', currentAffairs: '📰',
// };

// const categoryColor: Record<string, string> = {
//   fruits: 'border-yellow-400',
//   animals: 'border-green-400',
//   birds: 'border-blue-400',
//   flowers: 'border-pink-400',
//   trees: 'border-emerald-400',
//   vegetables: 'border-orange-400',
//   // default falls to white/20
// };

// // ---------- Main Component ----------
// const BasicKnowledgePage: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string>('');
//   const [selectedSubItem, setSelectedSubItem] = useState<string>('');
//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const apiUrl = import.meta.env.VITE_API_URL || '';

//   const currentCategory = exploreData.categories.find(c => c.value === selectedCategory);
//   const subItems = currentCategory?.subItems || [];

//   const fetchItems = async (category: string, subValue: string) => {
//     if (!subValue) return;
//     setLoading(true);
//     setError('');
//     try {
//       const url = `${apiUrl}/aicontent/get${subValue}`;
//       console.log('🔍 Fetching:', url);
//       const response = await axios.get(url);
//       const data = response.data;
//       console.log('✅ Data:', data);

//       console.log(subValue,'========subValue=========');
      

//       const list = data[subValue] || [];
//       setItems(list);

//       // Update selected label
//       const cat = exploreData.categories.find(c => c.value === category);
//       const sub = cat?.subItems.find(s => s.value === subValue);

//       console.log(sub);
      
//       setSelectedSubItem(subValue);
//     } catch (err: any) {
//       console.error('❌ Error:', err);
//       setError(err?.message || 'Something went wrong');
//       toast.error('Failed to load data!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedCategory(value);
//     setSelectedSubItem('');
//     setItems([]);
//     if (value) {
//       // Reset items when category changes
//     }
//   };

//   const handleSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedSubItem(value);
//     if (selectedCategory && value) {
//       fetchItems(selectedCategory, value);
//     }
//   };

//   const getSelectedLabel = () => {
//     const cat = exploreData.categories.find(c => c.value === selectedCategory);
//     const sub = cat?.subItems.find(s => s.value === selectedSubItem);
//     return sub?.label || selectedSubItem;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
//             🌟 Learn & Explore
//           </h1>
//           <p className="text-purple-200 text-lg mt-2">
//             Pick a topic and discover amazing facts!
//           </p>
//         </div>

//         {/* Dropdowns */}
//         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
//           <h3 className="text-lg font-semibold text-white">Explore</h3>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <select
//               value={selectedCategory}
//               onChange={handleCategoryChange}
//               className="w-full sm:w-48 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//             >
//               <option value="">Select Category</option>
//               {exploreData.categories.map(cat => (
//                 <option key={cat.value} value={cat.value}>
//                   {cat.label}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedSubItem}
//               onChange={handleSubChange}
//               disabled={!selectedCategory}
//               className={`w-full sm:w-64 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none ${
//                 !selectedCategory ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               <option value="">Select Sub-topic</option>
//               {subItems.map(item => (
//                 <option key={item.value} value={item.value}>
//                   {item.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedSubItem && (
//             <div className="mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
//               <p className="text-sm text-gray-300">
//                 Selected: <span className="text-blue-400 font-medium">
//                   {currentCategory?.label} → {getSelectedLabel()}
//                 </span>
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 text-center">
//             ⚠️ {error}
//           </div>
//         )}

//         {/* Loading */}
//         {loading && (
//           <div className="flex justify-center mt-12">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-300"></div>
//           </div>
//         )}

//         {/* Items Grid */}
//         {!loading && items.length > 0 && (
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//               <span>{categoryEmoji[selectedSubItem] || '📚'}</span>
//               {getSelectedLabel()}
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {items.map((item) => (
//                 <div
//                   key={item._id || item.id}
//                   className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 ${
//                     categoryColor[selectedSubItem] || 'border-white/20'
//                   } hover:scale-105 transition-all duration-200 hover:shadow-2xl hover:bg-white/20 flex flex-col items-center text-center`}
//                 >
//                   <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-pink-400 flex items-center justify-center text-3xl shadow-md mb-2">
//                     {categoryEmoji[selectedSubItem] || '📖'}
//                   </div>
//                   <p className="text-white font-semibold text-sm md:text-base">
//                     {item.name}
//                   </p>
//                   {item.description && (
//                     <p className="text-purple-200 text-xs mt-1">{item.description}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && items.length === 0 && selectedSubItem && !error && (
//           <div className="mt-12 text-center text-purple-200 text-lg">
//             🌈 No items found. Try another topic!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BasicKnowledgePage;






















// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// // ---------- Dropdown Data ----------
// const exploreData = {
//   categories: [
//     {
//       label: 'Basic Knowledge',
//       value: 'basic',
//       subItems: [
//         { label: '🍎 Fruits', value: 'fruits' },
//         { label: '🐶 Animals', value: 'animals' },
//         { label: '🐦 Birds', value: 'birds' },
//         { label: '🌸 Flowers', value: 'flowers' },
//         { label: '🌳 Trees & Plants', value: 'trees' },
//         { label: '🥕 Vegetables', value: 'vegetables' },
//         { label: '🪑 Things Around Us', value: 'things' },
//         { label: '🚗 Transport', value: 'transport' },
//         { label: '👨‍👩‍👧 People', value: 'people' },
//         { label: '❤️ Family & Relations', value: 'relations' },
//       ],
//     },
//     {
//       label: '🌍 World Explorer',
//       value: 'world',
//       subItems: [
//         { label: '🌎 Countries', value: 'countries' },
//         { label: '🏙️ Cities', value: 'cities' },
//         { label: '🗺️ States of India', value: 'states' },
//         { label: '🏛️ Famous Places', value: 'places' },
//         { label: '🏰 Monuments', value: 'monuments' },
//         { label: '🏔️ Mountains', value: 'mountains' },
//         { label: '🌊 Rivers', value: 'rivers' },
//         { label: '🌊 Oceans & Seas', value: 'oceans' },
//         { label: '🏝️ Islands', value: 'islands' },
//         { label: '🌋 Volcanoes', value: 'volcanoes' },
//       ],
//     },
//     {
//       label: '🔬 Science Explorer',
//       value: 'science',
//       subItems: [
//         { label: '🫀 Human Body', value: 'humanBody' },
//         { label: '🦴 Bones', value: 'bones' },
//         { label: '🧠 Brain & Nervous System', value: 'brain' },
//         { label: '🫁 Organs', value: 'organs' },
//         { label: '🌱 Plant Parts', value: 'plantParts' },
//         { label: '☀️ Solar System', value: 'solarSystem' },
//         { label: '🪐 Planets', value: 'planets' },
//         { label: '⭐ Stars & Galaxies', value: 'stars' },
//         { label: '🌙 Moon', value: 'moon' },
//         { label: '⚡ Electricity', value: 'electricity' },
//         { label: '🧲 Magnets', value: 'magnets' },
//         { label: '💧 Water Cycle', value: 'waterCycle' },
//         { label: '☁️ Weather', value: 'weather' },
//         { label: '🌈 Natural Phenomena', value: 'phenomena' },
//         { label: '🔬 Simple Experiments', value: 'experiments' },
//       ],
//     },
//     {
//       label: '📚 English / Language',
//       value: 'english',
//       subItems: [
//         { label: '🔤 ABC / Alphabet', value: 'abc' },
//         { label: '📖 Vocabulary', value: 'vocabulary' },
//         { label: '📝 Spelling', value: 'spelling' },
//         { label: '🔠 Opposite Words', value: 'opposites' },
//         { label: '🔗 Synonyms', value: 'synonyms' },
//         { label: '🗣️ Daily-use English', value: 'dailyEnglish' },
//         { label: '🖼️ Picture Vocabulary', value: 'pictureVocab' },
//         { label: '📚 Story Learning', value: 'storyLearning' },
//         { label: '✍️ Grammar', value: 'grammar' },
//         { label: '🔊 Pronunciation', value: 'pronunciation' },
//       ],
//     },
//     {
//       label: '🧠 GK',
//       value: 'gk',
//       subItems: [
//         { label: '🇮🇳 Indian States & Capitals', value: 'indianStates' },
//         { label: '👨‍🚀 Famous Scientists', value: 'scientists' },
//         { label: '🦸 National Heroes', value: 'heroes' },
//         { label: '🇮🇳 Indian National Symbols', value: 'symbols' },
//         { label: '🏆 Sports', value: 'sports' },
//         { label: '🌍 World Records', value: 'records' },
//         { label: '💡 Inventions', value: 'inventions' },
//         { label: '👑 Historical Kings & Queens', value: 'kings' },
//         { label: '📅 Important Days', value: 'importantDays' },
//         { label: '📰 Age-appropriate Current Affairs', value: 'currentAffairs' },
//       ],
//     },
//   ],
// };

// // Emoji mapping
// const categoryEmoji: Record<string, string> = {
//   fruits: '🍎', animals: '🐶', birds: '🐦', flowers: '🌸',
//   trees: '🌳', vegetables: '🥕', countries: '🌍', cities: '🏙️',
//   states: '🗺️', places: '🏛️', monuments: '🏰', mountains: '🏔️',
//   rivers: '🌊', oceans: '🌊', islands: '🏝️', volcanoes: '🌋',
//   humanBody: '🫀', bones: '🦴', brain: '🧠', organs: '🫁',
//   plantParts: '🌱', solarSystem: '☀️', planets: '🪐', stars: '⭐',
//   moon: '🌙', electricity: '⚡', magnets: '🧲', waterCycle: '💧',
//   weather: '☁️', phenomena: '🌈', experiments: '🔬',
//   abc: '🔤', vocabulary: '📖', spelling: '📝', opposites: '🔠',
//   synonyms: '🔗', dailyEnglish: '🗣️', pictureVocab: '🖼️',
//   storyLearning: '📚', grammar: '✍️', pronunciation: '🔊',
//   indianStates: '🇮🇳', scientists: '👨‍🚀', heroes: '🦸',
//   symbols: '🇮🇳', sports: '🏆', records: '🌍', inventions: '💡',
//   kings: '👑', importantDays: '📅', currentAffairs: '📰',
//   things: '🪑', transport: '🚗', people: '👨‍👩‍👧', relations: '❤️',
// };

// const categoryColor: Record<string, string> = {
//   fruits: 'border-yellow-400',
//   animals: 'border-green-400',
//   birds: 'border-blue-400',
//   flowers: 'border-pink-400',
//   trees: 'border-emerald-400',
//   vegetables: 'border-orange-400',
// };

// // ---------- Main Component ----------
// const BasicKnowledgePage: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string>('');
//   const [selectedSubItem, setSelectedSubItem] = useState<string>('');
//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Slideshow state
//   const [slideshowOpen, setSlideshowOpen] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [intervalTime, setIntervalTime] = useState(5); // seconds
//   const [isPlaying, setIsPlaying] = useState(true);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const apiUrl = import.meta.env.VITE_API_URL || '';

//   const currentCategory = exploreData.categories.find(c => c.value === selectedCategory);
//   const subItems = currentCategory?.subItems || [];

//   // Fetch items
//   const fetchItems = async (category: string, subValue: string) => {
//     if (!subValue) return;
//     setLoading(true);
//     setError('');
//     try {
//       const url = `${apiUrl}/aicontent/get${subValue}`;
//       const response = await axios.get(url);
//       const data = response.data;
//       const list = data[subValue] || [];
//       setItems(list);
//       setSelectedSubItem(subValue);
//     } catch (err: any) {
//       setError(err?.message || 'Something went wrong');
//       toast.error('Failed to load data!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedCategory(value);
//     setSelectedSubItem('');
//     setItems([]);
//   };

//   const handleSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedSubItem(value);
//     if (selectedCategory && value) {
//       fetchItems(selectedCategory, value);
//     }
//   };

//   const getSelectedLabel = () => {
//     const cat = exploreData.categories.find(c => c.value === selectedCategory);
//     const sub = cat?.subItems.find(s => s.value === selectedSubItem);
//     return sub?.label || selectedSubItem;
//   };

//   // ---------- Slideshow Logic ----------
//   const openSlideshow = () => {
//     if (items.length === 0) return;
//     setSlideshowOpen(true);
//     setCurrentIndex(0);
//     setIsPlaying(true);
//   };

//   const closeSlideshow = () => {
//     setSlideshowOpen(false);
//     if (timerRef.current) clearInterval(timerRef.current);
//   };

//   const goToNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % items.length);
//   };

//   const goToPrev = () => {
//     setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
//   };

//   const togglePlay = () => {
//     setIsPlaying((prev) => !prev);
//   };

//   // Auto‑advance timer
//   useEffect(() => {
//     if (slideshowOpen && isPlaying && items.length > 0) {
//       timerRef.current = setInterval(() => {
//         goToNext();
//       }, intervalTime * 1000);
//     } else {
//       if (timerRef.current) clearInterval(timerRef.current);
//     }
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [slideshowOpen, isPlaying, intervalTime, items.length]);

//   // Reset timer when interval changes
//   useEffect(() => {
//     if (slideshowOpen && isPlaying) {
//       if (timerRef.current) clearInterval(timerRef.current);
//       timerRef.current = setInterval(() => {
//         goToNext();
//       }, intervalTime * 1000);
//     }
//   }, [intervalTime]);

//   // ---------- Render ----------
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
//             🌟 Learn & Explore
//           </h1>
//           <p className="text-purple-200 text-lg mt-2">
//             Pick a topic and discover amazing facts!
//           </p>
//         </div>

//         {/* Dropdowns */}
//         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
//           <h3 className="text-lg font-semibold text-white">Explore</h3>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <select
//               value={selectedCategory}
//               onChange={handleCategoryChange}
//               className="w-full sm:w-48 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//             >
//               <option value="">Select Category</option>
//               {exploreData.categories.map(cat => (
//                 <option key={cat.value} value={cat.value}>
//                   {cat.label}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedSubItem}
//               onChange={handleSubChange}
//               disabled={!selectedCategory}
//               className={`w-full sm:w-64 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none ${
//                 !selectedCategory ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               <option value="">Select Sub-topic</option>
//               {subItems.map(item => (
//                 <option key={item.value} value={item.value}>
//                   {item.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedSubItem && (
//             <div className="mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
//               <p className="text-sm text-gray-300">
//                 Selected: <span className="text-blue-400 font-medium">
//                   {currentCategory?.label} → {getSelectedLabel()}
//                 </span>
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Slideshow Button - shows only when items loaded */}
//         {items.length > 0 && !loading && (
//           <div className="mt-4 text-center">
//             <button
//               onClick={openSlideshow}
//               className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
//             >
//               🎬 Start Slideshow
//             </button>
//           </div>
//         )}

//         {/* Error */}
//         {error && (
//           <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 text-center">
//             ⚠️ {error}
//           </div>
//         )}

//         {/* Loading */}
//         {loading && (
//           <div className="flex justify-center mt-12">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-300"></div>
//           </div>
//         )}

//         {/* Items Grid */}
//         {!loading && items.length > 0 && (
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//               <span>{categoryEmoji[selectedSubItem] || '📚'}</span>
//               {getSelectedLabel()}
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {items.map((item) => (
//                 <div
//                   key={item._id || item.id}
//                   className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 ${
//                     categoryColor[selectedSubItem] || 'border-white/20'
//                   } hover:scale-105 transition-all duration-200 hover:shadow-2xl hover:bg-white/20 flex flex-col items-center text-center`}
//                 >
//                   <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-pink-400 flex items-center justify-center text-3xl shadow-md mb-2">
//                     {categoryEmoji[selectedSubItem] || '📖'}
//                   </div>
//                   <p className="text-white font-semibold text-sm md:text-base">
//                     {item.name}
//                   </p>
//                   {item.description && (
//                     <p className="text-purple-200 text-xs mt-1">{item.description}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && items.length === 0 && selectedSubItem && !error && (
//           <div className="mt-12 text-center text-purple-200 text-lg">
//             🌈 No items found. Try another topic!
//           </div>
//         )}
//       </div>

//       {/* ---------- Slideshow Modal (Full‑screen Overlay) ---------- */}
//       {slideshowOpen && (
//         <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900 flex flex-col items-center justify-center">
//           {/* Close Button */}
//           <button
//             onClick={closeSlideshow}
//             className="absolute top-4 right-4 text-white text-3xl hover:scale-110 transition-transform"
//           >
//             ✕
//           </button>

//           {/* Interval Selector */}
//           <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
//             <label className="text-white text-sm">⏱️</label>
//             <select
//               value={intervalTime}
//               onChange={(e) => setIntervalTime(Number(e.target.value))}
//               className="bg-transparent text-white border border-white/30 rounded-lg px-2 py-1 outline-none"
//             >
//               <option value={3}>3s</option>
//               <option value={5}>5s</option>
//               <option value={10}>10s</option>
//               <option value={20}>20s</option>
//               <option value={30}>30s</option>
//             </select>
//           </div>

//           {/* Current Item Display with Zoom Animation */}
//           <div className="flex-1 flex items-center justify-center w-full px-4">
//             <div
//               key={currentIndex}
//               className="transform transition-all duration-500 ease-in-out scale-100 animate-zoom"
//               style={{ animation: 'zoomIn 0.5s ease-out' }}
//             >
//               <div className="text-center">
//                 <div className="text-8xl md:text-9xl mb-6 drop-shadow-2xl">
//                   {categoryEmoji[selectedSubItem] || '📖'}
//                 </div>
//                 <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
//                   {items[currentIndex]?.name || ''}
//                 </h2>
//                 {items[currentIndex]?.description && (
//                   <p className="text-purple-200 text-xl mt-4 max-w-2xl mx-auto">
//                     {items[currentIndex].description}
//                   </p>
//                 )}
//                 <p className="text-white/50 text-sm mt-8">
//                   {currentIndex + 1} / {items.length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Controls */}
//           <div className="pb-8 flex items-center gap-6">
//             <button
//               onClick={goToPrev}
//               className="text-white text-4xl hover:scale-110 transition-transform"
//             >
//               ◀
//             </button>
//             <button
//               onClick={togglePlay}
//               className="text-white text-5xl hover:scale-110 transition-transform"
//             >
//               {isPlaying ? '⏸' : '▶'}
//             </button>
//             <button
//               onClick={goToNext}
//               className="text-white text-4xl hover:scale-110 transition-transform"
//             >
//               ▶
//             </button>
//           </div>

//           {/* Progress Bar */}
//           <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-3/4 max-w-md h-1 bg-white/20 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300"
//               style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Inject keyframe animation for zoom */}
//       <style>
//         {`
//           @keyframes zoomIn {
//             0% { transform: scale(0.8); opacity: 0; }
//             100% { transform: scale(1); opacity: 1; }
//           }
//           .animate-zoom {
//             animation: zoomIn 0.5s ease-out;
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default BasicKnowledgePage;











import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// ---------- Dropdown Data ----------
const exploreData = {
  categories: [
    {
      label: 'Basic Knowledge',
      value: 'basic',
      subItems: [
        { label: '🍎 Fruits', value: 'fruits' },
        { label: '🐶 Animals', value: 'animals' },
        { label: '🐦 Birds', value: 'birds' },
        { label: '🌸 Flowers', value: 'flowers' },
        { label: '🌳 Trees & Plants', value: 'trees' },
        { label: '🥕 Vegetables', value: 'vegetables' },
        { label: '🪑 Things Around Us', value: 'things' },
        { label: '🚗 Transport', value: 'transport' },
        { label: '👨‍👩‍👧 People', value: 'people' },
        { label: '❤️ Family & Relations', value: 'relations' },
      ],
    },
    {
      label: '🌍 World Explorer',
      value: 'world',
      subItems: [
        { label: '🌎 Countries', value: 'countries' },
        { label: '🏙️ Cities', value: 'cities' },
        { label: '🗺️ States of India', value: 'states' },
        { label: '🏛️ Famous Places', value: 'places' },
        { label: '🏰 Monuments', value: 'monuments' },
        { label: '🏔️ Mountains', value: 'mountains' },
        { label: '🌊 Rivers', value: 'rivers' },
        { label: '🌊 Oceans & Seas', value: 'oceans' },
        { label: '🏝️ Islands', value: 'islands' },
        { label: '🌋 Volcanoes', value: 'volcanoes' },
      ],
    },
    {
      label: '🔬 Science Explorer',
      value: 'science',
      subItems: [
        { label: '🫀 Human Body', value: 'humanBody' },
        { label: '🦴 Bones', value: 'bones' },
        { label: '🧠 Brain & Nervous System', value: 'brain' },
        { label: '🫁 Organs', value: 'organs' },
        { label: '🌱 Plant Parts', value: 'plantParts' },
        { label: '☀️ Solar System', value: 'solarSystem' },
        { label: '🪐 Planets', value: 'planets' },
        { label: '⭐ Stars & Galaxies', value: 'stars' },
        { label: '🌙 Moon', value: 'moon' },
        { label: '⚡ Electricity', value: 'electricity' },
        { label: '🧲 Magnets', value: 'magnets' },
        { label: '💧 Water Cycle', value: 'waterCycle' },
        { label: '☁️ Weather', value: 'weather' },
        { label: '🌈 Natural Phenomena', value: 'phenomena' },
        { label: '🔬 Simple Experiments', value: 'experiments' },
      ],
    },
    {
      label: '📚 English / Language',
      value: 'english',
      subItems: [
        { label: '🔤 ABC / Alphabet', value: 'abc' },
        { label: '📖 Vocabulary', value: 'vocabulary' },
        { label: '📝 Spelling', value: 'spelling' },
        { label: '🔠 Opposite Words', value: 'opposites' },
        { label: '🔗 Synonyms', value: 'synonyms' },
        { label: '🗣️ Daily-use English', value: 'dailyEnglish' },
        { label: '🖼️ Picture Vocabulary', value: 'pictureVocab' },
        { label: '📚 Story Learning', value: 'storyLearning' },
        { label: '✍️ Grammar', value: 'grammar' },
        { label: '🔊 Pronunciation', value: 'pronunciation' },
      ],
    },
    {
      label: '🧠 GK',
      value: 'gk',
      subItems: [
        { label: '🇮🇳 Indian States & Capitals', value: 'indianStates' },
        { label: '👨‍🚀 Famous Scientists', value: 'scientists' },
        { label: '🦸 National Heroes', value: 'heroes' },
        { label: '🇮🇳 Indian National Symbols', value: 'symbols' },
        { label: '🏆 Sports', value: 'sports' },
        { label: '🌍 World Records', value: 'records' },
        { label: '💡 Inventions', value: 'inventions' },
        { label: '👑 Historical Kings & Queens', value: 'kings' },
        { label: '📅 Important Days', value: 'importantDays' },
        { label: '📰 Age-appropriate Current Affairs', value: 'currentAffairs' },
      ],
    },
  ],
};

// Emoji mapping (fallback)
const categoryEmoji: Record<string, string> = {
  fruits: '🍎', animals: '🐶', birds: '🐦', flowers: '🌸',
  trees: '🌳', vegetables: '🥕', countries: '🌍', cities: '🏙️',
  states: '🗺️', places: '🏛️', monuments: '🏰', mountains: '🏔️',
  rivers: '🌊', oceans: '🌊', islands: '🏝️', volcanoes: '🌋',
  humanBody: '🫀', bones: '🦴', brain: '🧠', organs: '🫁',
  plantParts: '🌱', solarSystem: '☀️', planets: '🪐', stars: '⭐',
  moon: '🌙', electricity: '⚡', magnets: '🧲', waterCycle: '💧',
  weather: '☁️', phenomena: '🌈', experiments: '🔬',
  abc: '🔤', vocabulary: '📖', spelling: '📝', opposites: '🔠',
  synonyms: '🔗', dailyEnglish: '🗣️', pictureVocab: '🖼️',
  storyLearning: '📚', grammar: '✍️', pronunciation: '🔊',
  indianStates: '🇮🇳', scientists: '👨‍🚀', heroes: '🦸',
  symbols: '🇮🇳', sports: '🏆', records: '🌍', inventions: '💡',
  kings: '👑', importantDays: '📅', currentAffairs: '📰',
  things: '🪑', transport: '🚗', people: '👨‍👩‍👧', relations: '❤️',
};

const categoryColor: Record<string, string> = {
  fruits: 'border-yellow-400',
  animals: 'border-green-400',
  birds: 'border-blue-400',
  flowers: 'border-pink-400',
  trees: 'border-emerald-400',
  vegetables: 'border-orange-400',
  // default fallback
};

// ---------- Main Component ----------
const BasicKnowledgePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubItem, setSelectedSubItem] = useState<string>('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Slideshow state
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalTime, setIntervalTime] = useState(5); // seconds
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const currentCategory = exploreData.categories.find(c => c.value === selectedCategory);
  const subItems = currentCategory?.subItems || [];

  // Fetch items
  const fetchItems = async (category: string, subValue: string) => {
    if (!subValue) return;
    setLoading(true);
    setError('');
    try {
      const url = `${apiUrl}/aicontent/get${subValue}`;
      const response = await axios.get(url);
      const data = response.data;
      const list = data[subValue] || [];
      setItems(list);
      setSelectedSubItem(subValue);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
      toast.error('Failed to load data!');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubItem('');
    setItems([]);
  };

  const handleSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSubItem(value);
    if (selectedCategory && value) {
      fetchItems(selectedCategory, value);
    }
  };

  const getSelectedLabel = () => {
    const cat = exploreData.categories.find(c => c.value === selectedCategory);
    const sub = cat?.subItems.find(s => s.value === selectedSubItem);
    return sub?.label || selectedSubItem;
  };

  // ---------- Slideshow Logic ----------
  const openSlideshow = () => {
    if (items.length === 0) return;
    setSlideshowOpen(true);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const closeSlideshow = () => {
    setSlideshowOpen(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Auto‑advance timer
  useEffect(() => {
    if (slideshowOpen && isPlaying && items.length > 0) {
      timerRef.current = setInterval(() => {
        goToNext();
      }, intervalTime * 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slideshowOpen, isPlaying, intervalTime, items.length]);

  // Reset timer when interval changes
  useEffect(() => {
    if (slideshowOpen && isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        goToNext();
      }, intervalTime * 1000);
    }
  }, [intervalTime]);

  // Helper to get item display image or emoji
  const getItemDisplay = (item: any) => {
    if (item.imageURL) {
      return (
        <img
          src={item.imageURL}
          alt={item.name}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // If image fails, fallback to emoji
            (e.target as HTMLImageElement).style.display = 'none';
            // We'll show emoji via parent fallback, but we can just let it show broken? Better to show fallback.
            // We'll handle fallback in the card by checking if image exists.
          }}
        />
      );
    }
    return null;
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            🌟 Learn & Explore
          </h1>
          <p className="text-purple-200 text-lg mt-2">
            Pick a topic and discover amazing facts!
          </p>
        </div>

        {/* Dropdowns */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
          <h3 className="text-lg font-semibold text-white">Explore</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full sm:w-48 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
            >
              <option value="">Select Category</option>
              {exploreData.categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={selectedSubItem}
              onChange={handleSubChange}
              disabled={!selectedCategory}
              className={`w-full sm:w-64 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none ${
                !selectedCategory ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="">Select Sub-topic</option>
              {subItems.map(item => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {selectedSubItem && (
            <div className="mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm text-gray-300">
                Selected: <span className="text-blue-400 font-medium">
                  {currentCategory?.label} → {getSelectedLabel()}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Slideshow Button - shows only when items loaded */}
        {items.length > 0 && !loading && (
          <div className="mt-4 text-center">
            <button
              onClick={openSlideshow}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              🎬 Start Slideshow
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-300"></div>
          </div>
        )}

        {/* Items Grid */}
        {!loading && items.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>{categoryEmoji[selectedSubItem] || '📚'}</span>
              {getSelectedLabel()}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <div
                  key={item._id || item.id}
                  className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 ${
                    categoryColor[selectedSubItem] || 'border-white/20'
                  } hover:scale-105 transition-all duration-200 hover:shadow-2xl hover:bg-white/20 flex flex-col items-center text-center`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-pink-400 flex items-center justify-center text-3xl shadow-md mb-2 overflow-hidden">
                    {item.imageURL ? (
                      <img
                        src={item.imageURL}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback: hide image and show emoji
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            (e.target as HTMLImageElement).style.display = 'none';
                            // Show emoji text in the same container
                            const emojiSpan = document.createElement('span');
                            emojiSpan.className = 'text-3xl';
                            emojiSpan.textContent = categoryEmoji[selectedSubItem] || '📖';
                            parent.appendChild(emojiSpan);
                          }
                        }}
                      />
                    ) : (
                      categoryEmoji[selectedSubItem] || '📖'
                    )}
                  </div>
                  <p className="text-white font-semibold text-sm md:text-base">
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="text-purple-200 text-xs mt-1">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && selectedSubItem && !error && (
          <div className="mt-12 text-center text-purple-200 text-lg">
            🌈 No items found. Try another topic!
          </div>
        )}
      </div>

      {/* ---------- Slideshow Modal (Full‑screen Overlay) ---------- */}
      {slideshowOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900 flex flex-col items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeSlideshow}
            className="absolute top-4 right-4 text-white text-3xl hover:scale-110 transition-transform"
          >
            ✕
          </button>

          {/* Interval Selector */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <label className="text-white text-sm">⏱️</label>
            <select
              value={intervalTime}
              onChange={(e) => setIntervalTime(Number(e.target.value))}
              className="bg-transparent text-white border border-white/30 rounded-lg px-2 py-1 outline-none"
            >
              <option value={3}>3s</option>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={20}>20s</option>
              <option value={30}>30s</option>
            </select>
          </div>

          {/* Current Item Display with Zoom Animation */}
          <div className="flex-1 flex items-center justify-center w-full px-4">
            <div
              key={currentIndex}
              className="transform transition-all duration-500 ease-in-out scale-100 animate-zoom"
              style={{ animation: 'zoomIn 0.5s ease-out' }}
            >
              <div className="text-center">
                {items[currentIndex]?.imageURL ? (
                  <img
                    src={items[currentIndex].imageURL}
                    alt={items[currentIndex].name}
                    className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl mx-auto mb-6"
                    onError={(e) => {
                      // Fallback to emoji if image fails
                      (e.target as HTMLImageElement).style.display = 'none';
                      // Show emoji in its place
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        const emojiDiv = document.createElement('div');
                        emojiDiv.className = 'text-9xl md:text-9xl mb-6 drop-shadow-2xl';
                        emojiDiv.textContent = categoryEmoji[selectedSubItem] || '📖';
                        parent.prepend(emojiDiv);
                      }
                    }}
                  />
                ) : (
                  <div className="text-9xl md:text-9xl mb-6 drop-shadow-2xl">
                    {categoryEmoji[selectedSubItem] || '📖'}
                  </div>
                )}
                <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                  {items[currentIndex]?.name || ''}
                </h2>
                {items[currentIndex]?.description && (
                  <p className="text-purple-200 text-xl mt-4 max-w-2xl mx-auto">
                    {items[currentIndex].description}
                  </p>
                )}
                <p className="text-white/50 text-sm mt-8">
                  {currentIndex + 1} / {items.length}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="pb-8 flex items-center gap-6">
            <button
              onClick={goToPrev}
              className="text-white text-4xl hover:scale-110 transition-transform"
            >
              ◀
            </button>
            <button
              onClick={togglePlay}
              className="text-white text-5xl hover:scale-110 transition-transform"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={goToNext}
              className="text-white text-4xl hover:scale-110 transition-transform"
            >
              ▶
            </button>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-3/4 max-w-md h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Inject keyframe animation for zoom */}
      <style>
        {`
          @keyframes zoomIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-zoom {
            animation: zoomIn 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default BasicKnowledgePage;