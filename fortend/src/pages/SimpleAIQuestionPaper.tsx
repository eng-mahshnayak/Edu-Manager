






// import React, { useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import {
//   Box,
//   Card,
//   Typography,
//   Button,
//   CircularProgress,
//   Paper,
//   Grid,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Alert,
//   IconButton,
//   Tooltip,
// } from '@mui/material';
// import { AutoAwesome, MenuBook, EmojiEvents, Translate, Refresh } from '@mui/icons-material';

// // ==================== Types ====================
// interface StoryLine {
//   id: number;
//   text: string;
//   emoji?: string;
// }

// interface StoryData {
//   _id: string;
//   title: string;
//   lines: StoryLine[];
//   moral: string;
//   subhVichar?: string;
//   vocabulary: string[];
//   funFact?: string;
//   language: 'en' | 'hi';
//   lineCount: number;
//   category: string;
//   theme?: string;
// }

// // ==================== Main Component ====================
// const AIStoryGenerator: React.FC = () => {
//   // ----- State -----
//   const [story, setStory] = useState<StoryData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [linesCount, setLinesCount] = useState<4 | 8 | 12>(8);
//   const [language, setLanguage] = useState<'en' | 'hi'>('en');
//   const [category, setCategory] = useState<string>('General');
//   const [theme, setTheme] = useState<string>('');
//   const [translating, setTranslating] = useState(false);

//   // ----- Constants -----
//   const categories = ['General', 'Family', 'Teacher', 'Nature', 'Friendship', 'Helping Others', 'Honesty', 'Kindness'];
//   const themes = ['', 'Kindness', 'Honesty', 'Respect', 'Discipline', 'Hard Work', 'Cleanliness', 'Sharing', 'Bravery', 'Friendship'];

//   // ----- Generate Story -----
//   const generateStory = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/aicontent/story?lines=${linesCount}&language=${language}&category=${category}&theme=${theme}`
//       );
//       if (response.data.success) {
//         setStory(response.data.data);
//         toast.success('Story generated! 🎉');
//       } else {
//         throw new Error(response.data.message || 'Failed to load story');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----- Translate Story -----
//   const translateStory = async () => {
//     if (!story) return;
//     const targetLang = story.language === 'en' ? 'hi' : 'en';
//     setTranslating(true);
//     try {
//       const response = await axios.post('http://localhost:5000/api/aicontent/translate-story', {
//         story,
//         targetLanguage: targetLang,
//       });
//       if (response.data.success) {
//         setStory(response.data.data);
//         toast.success(`Translated to ${targetLang === 'en' ? 'English' : 'Hindi'}!`);
//       } else {
//         throw new Error(response.data.message || 'Translation failed');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Translation failed');
//     } finally {
//       setTranslating(false);
//     }
//   };

//   // ----- Render -----
//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         px: { xs: 2, sm: 3, md: 4 },
//         py: { xs: 2, md: 3 },
//         background: 'linear-gradient(135deg, #0c0e1a 0%, #1a1f3a 50%, #0f2847 100%)',
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Floating decorations */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '10%',
//           left: '5%',
//           fontSize: 60,
//           opacity: 0.1,
//           transform: 'rotate(-10deg)',
//           animation: 'float 8s ease-in-out infinite',
//         }}
//       >
//         🌟
//       </Box>
//       <Box
//         sx={{
//           position: 'absolute',
//           bottom: '15%',
//           right: '8%',
//           fontSize: 80,
//           opacity: 0.08,
//           transform: 'rotate(15deg)',
//           animation: 'float 10s ease-in-out infinite reverse',
//         }}
//       >
//         📚
//       </Box>
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '40%',
//           right: '20%',
//           fontSize: 50,
//           opacity: 0.1,
//           animation: 'float 12s ease-in-out infinite',
//         }}
//       >
//         ✨
//       </Box>

//       <Box sx={{ maxWidth: 900, mx: 'auto', position: 'relative', zIndex: 1 }}>
//         {/* Header */}
//         <Box mb={4} textAlign="center">
//           <Typography
//             variant="h3"
//             fontWeight="extrabold"
//             sx={{
//               color: 'white',
//               textShadow: '0 4px 20px rgba(0,0,0,0.5)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 2,
//             }}
//           >
//             <AutoAwesome sx={{ fontSize: 50 }} />
//             Story Time
//             <AutoAwesome sx={{ fontSize: 50 }} />
//           </Typography>
//           <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//             Choose story length, language, category, and theme – then generate magic!
//           </Typography>
//         </Box>

//         {/* Controls Card */}
//         <Card
//           sx={{
//             p: 3,
//             mb: 4,
//             borderRadius: 4,
//             background: 'rgba(255,255,255,0.06)',
//             backdropFilter: 'blur(15px)',
//             border: '1px solid rgba(255,255,255,0.08)',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
//           }}
//         >
//           <Grid container spacing={2} alignItems="center">
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>📏 Length</InputLabel>
//                 <Select
//                   value={linesCount}
//                   onChange={(e) => setLinesCount(e.target.value as 4 | 8 | 12)}
//                   label="📏 Length"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                   }}
//                 >
//                   <MenuItem value={4}>4 Lines</MenuItem>
//                   <MenuItem value={8}>8 Lines</MenuItem>
//                   <MenuItem value={12}>12 Lines</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
//                   <Translate sx={{ mr: 1, fontSize: 18 }} /> Language
//                 </InputLabel>
//                 <Select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
//                   label="Language"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                   }}
//                 >
//                   <MenuItem value="en">English</MenuItem>
//                   <MenuItem value="hi">हिंदी</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>📂 Category</InputLabel>
//                 <Select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   label="Category"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                   }}
//                 >
//                   {categories.map(cat => (
//                     <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>🎯 Theme (optional)</InputLabel>
//                 <Select
//                   value={theme}
//                   onChange={(e) => setTheme(e.target.value)}
//                   label="Theme (optional)"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                   }}
//                 >
//                   {themes.map(t => (
//                     <MenuItem key={t} value={t}>{t || 'None'}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12 }}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={generateStory}
//                 disabled={loading}
//                 sx={{
//                   background: 'linear-gradient(135deg, #3a7bd5 0%, #2b5ea7 100%)',
//                   color: 'white',
//                   fontWeight: 'bold',
//                   py: 1.5,
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #2b5ea7 0%, #1a3f7a 100%)',
//                   },
//                 }}
//               >
//                 {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '🌟 Generate Story'}
//               </Button>
//             </Grid>
//           </Grid>
//         </Card>

//         {/* Story Display */}
//         {loading ? (
//           <Box display="flex" justifyContent="center" py={10}>
//             <CircularProgress sx={{ color: 'white' }} />
//           </Box>
//         ) : story ? (
//           <Card
//             sx={{
//               p: 4,
//               borderRadius: 4,
//               background: 'rgba(255,255,255,0.06)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(255,255,255,0.08)',
//               boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
//               color: 'white',
//               position: 'relative',
//             }}
//           >
//             {/* Translate & Refresh buttons */}
//             <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
//               <Tooltip title={`Translate to ${story.language === 'en' ? 'Hindi' : 'English'}`}>
//                 <IconButton onClick={translateStory} disabled={translating} sx={{ color: '#7aa9ff' }}>
//                   {translating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <Translate />}
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Generate new story (keep settings)">
//                 <IconButton onClick={generateStory} disabled={loading} sx={{ color: '#7aa9ff' }}>
//                   <Refresh />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Title & Chips */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
//                 {story.title}
//               </Typography>
//               <Box display="flex" gap={1} flexWrap="wrap">
//                 <Chip label={`${story.lineCount} lines`} color="primary" sx={{ fontWeight: 'bold' }} />
//                 {story.category && <Chip label={story.category} color="secondary" size="small" />}
//                 {story.theme && <Chip label={story.theme} variant="outlined" size="small" />}
//                 <Chip label={story.language === 'en' ? '🇬🇧 EN' : '🇮🇳 HI'} variant="outlined" size="small" />
//               </Box>
//             </Box>

//             {/* Lines */}
//             {story.lines.map((line) => (
//               <Box
//                 key={line.id}
//                 sx={{
//                   p: 2,
//                   my: 1,
//                   bgcolor: 'rgba(255,255,255,0.05)',
//                   borderRadius: 2,
//                   border: '1px solid rgba(255,255,255,0.06)',
//                   animation: 'zoomFade 0.5s ease-out',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1,
//                 }}
//               >
//                 {line.emoji && (
//                   <Typography variant="h5" sx={{ mr: 1 }}>
//                     {line.emoji}
//                   </Typography>
//                 )}
//                 <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
//                   {line.text}
//                 </Typography>
//               </Box>
//             ))}

//             {/* Subhvichar / Moral */}
//             <Paper
//               sx={{
//                 p: 2,
//                 mt: 3,
//                 bgcolor: 'rgba(58, 123, 213, 0.15)',
//                 borderRadius: 2,
//                 border: '1px solid rgba(58, 123, 213, 0.2)',
//               }}
//             >
//               <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#7aa9ff' }}>
//                 💡 Subhvichar / Moral:
//               </Typography>
//               <Typography variant="body1" fontStyle="italic" sx={{ color: '#e0e0e0' }}>
//                 {story.moral}
//               </Typography>
//               {story.subhVichar && (
//                 <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
//                   ✨ {story.subhVichar}
//                 </Typography>
//               )}
//             </Paper>

//             {/* Vocabulary */}
//             {story.vocabulary && story.vocabulary.length > 0 && (
//               <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
//                 <Chip icon={<MenuBook />} label="Vocabulary" color="primary" variant="outlined" />
//                 {story.vocabulary.map((word, idx) => (
//                   <Chip key={idx} label={word} size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
//                 ))}
//               </Box>
//             )}

//             {/* Fun Fact */}
//             {story.funFact && (
//               <Box mt={2}>
//                 <Chip
//                   icon={<EmojiEvents />}
//                   label={`Fun Fact: ${story.funFact}`}
//                   color="success"
//                   variant="outlined"
//                 />
//               </Box>
//             )}
//           </Card>
//         ) : (
//           <Alert severity="info" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
//             Click “Generate Story” to create a magical tale!
//           </Alert>
//         )}
//       </Box>

//       {/* Animations */}
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(5deg); }
//         }
//         @keyframes zoomFade {
//           0% { transform: scale(0.9); opacity: 0; }
//           100% { transform: scale(1); opacity: 1; }
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default AIStoryGenerator;




// import React, { useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import {
//   Box,
//   Card,
//   Typography,
//   Button,
//   CircularProgress,
//   Paper,
//   Grid,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Alert,
//   IconButton,
//   Tooltip,
// } from '@mui/material';
// import { AutoAwesome, MenuBook, EmojiEvents, Translate, Refresh } from '@mui/icons-material';

// // ==================== Types ====================
// interface StoryLine {
//   id: number;
//   text: string;
//   emoji?: string;
// }

// interface StoryData {
//   _id: string;
//   title: string;
//   lines: StoryLine[];
//   moral: string;
//   subhVichar?: string;
//   vocabulary: string[];
//   funFact?: string;
//   language: 'en' | 'hi';
//   lineCount: number;
//   category: string;
//   theme?: string;
// }

// // ==================== Main Component ====================
// const AIStoryGenerator: React.FC = () => {
//   // ----- State -----
//   const [story, setStory] = useState<StoryData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [linesCount, setLinesCount] = useState<4 | 8 | 12>(8);
//   const [language, setLanguage] = useState<'en' | 'hi'>('en');
//   const [category, setCategory] = useState<string>('General');
//   const [theme, setTheme] = useState<string>('');
//   const [translating, setTranslating] = useState(false);

//   // ----- Constants -----
//   const categories = ['General', 'Family', 'Teacher', 'Nature', 'Friendship', 'Helping Others', 'Honesty', 'Kindness'];
//   const themes = ['', 'Kindness', 'Honesty', 'Respect', 'Discipline', 'Hard Work', 'Cleanliness', 'Sharing', 'Bravery', 'Friendship'];

//   // ----- Generate Story -----
//   const generateStory = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/aicontent/story?lines=${linesCount}&language=${language}&category=${category}&theme=${theme}`
//       );
//       if (response.data.success) {
//         setStory(response.data.data);
//         toast.success('Story generated! 🎉');
//       } else {
//         throw new Error(response.data.message || 'Failed to load story');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----- Translate Story -----
//   const translateStory = async () => {
//     if (!story) return;
//     const targetLang = story.language === 'en' ? 'hi' : 'en';
//     setTranslating(true);
//     try {
//       const response = await axios.post('http://localhost:5000/api/aicontent/translate-story', {
//         story,
//         targetLanguage: targetLang,
//       });
//       if (response.data.success) {
//         setStory(response.data.data);
//         toast.success(`Translated to ${targetLang === 'en' ? 'English' : 'Hindi'}!`);
//       } else {
//         throw new Error(response.data.message || 'Translation failed');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Translation failed');
//     } finally {
//       setTranslating(false);
//     }
//   };

//   // ----- Render -----
//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         px: { xs: 2, sm: 3, md: 4 },
//         py: { xs: 2, md: 3 },
//         background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Floating decorations with lighter opacity */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '10%',
//           left: '5%',
//           fontSize: 60,
//           opacity: 0.12,
//           transform: 'rotate(-10deg)',
//           animation: 'float 8s ease-in-out infinite',
//         }}
//       >
//         🌟
//       </Box>
//       <Box
//         sx={{
//           position: 'absolute',
//           bottom: '15%',
//           right: '8%',
//           fontSize: 80,
//           opacity: 0.10,
//           transform: 'rotate(15deg)',
//           animation: 'float 10s ease-in-out infinite reverse',
//         }}
//       >
//         📚
//       </Box>
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '40%',
//           right: '20%',
//           fontSize: 50,
//           opacity: 0.12,
//           animation: 'float 12s ease-in-out infinite',
//         }}
//       >
//         ✨
//       </Box>

//       <Box sx={{ maxWidth: 900, mx: 'auto', position: 'relative', zIndex: 1 }}>
//         {/* Header */}
//         <Box mb={4} textAlign="center">
//           <Typography
//             variant="h3"
//             fontWeight="extrabold"
//             sx={{
//               color: 'white',
//               textShadow: '0 4px 20px rgba(0,0,0,0.6)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 2,
//             }}
//           >
//             <AutoAwesome sx={{ fontSize: 50, color: '#60a5fa' }} />
//             Story Time
//             <AutoAwesome sx={{ fontSize: 50, color: '#60a5fa' }} />
//           </Typography>
//           <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//             Choose story length, language, category, and theme – then generate magic!
//           </Typography>
//         </Box>

//         {/* Controls Card */}
//         <Card
//           sx={{
//             p: 3,
//             mb: 4,
//             borderRadius: 4,
//             background: 'rgba(255,255,255,0.08)',
//             backdropFilter: 'blur(15px)',
//             border: '1px solid rgba(255,255,255,0.12)',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
//           }}
//         >
//           <Grid container spacing={2} alignItems="center">
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>📏 Length</InputLabel>
//                 <Select
//                   value={linesCount}
//                   onChange={(e) => setLinesCount(e.target.value as 4 | 8 | 12)}
//                   label="📏 Length"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
//                   }}
//                 >
//                   <MenuItem value={4}>4 Lines</MenuItem>
//                   <MenuItem value={8}>8 Lines</MenuItem>
//                   <MenuItem value={12}>12 Lines</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
//                   <Translate sx={{ mr: 1, fontSize: 18 }} /> Language
//                 </InputLabel>
//                 <Select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
//                   label="Language"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
//                   }}
//                 >
//                   <MenuItem value="en">English</MenuItem>
//                   <MenuItem value="hi">हिंदी</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>📂 Category</InputLabel>
//                 <Select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   label="Category"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
//                   }}
//                 >
//                   {categories.map(cat => (
//                     <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>🎯 Theme (optional)</InputLabel>
//                 <Select
//                   value={theme}
//                   onChange={(e) => setTheme(e.target.value)}
//                   label="Theme (optional)"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
//                   }}
//                 >
//                   {themes.map(t => (
//                     <MenuItem key={t} value={t}>{t || 'None'}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12 }}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={generateStory}
//                 disabled={loading}
//                 sx={{
//                   background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
//                   color: 'white',
//                   fontWeight: 'bold',
//                   py: 1.5,
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
//                   },
//                 }}
//               >
//                 {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '🌟 Generate Story'}
//               </Button>
//             </Grid>
//           </Grid>
//         </Card>

//         {/* Story Display */}
//         {loading ? (
//           <Box display="flex" justifyContent="center" py={10}>
//             <CircularProgress sx={{ color: 'white' }} />
//           </Box>
//         ) : story ? (
//           <Card
//             sx={{
//               p: 4,
//               borderRadius: 4,
//               background: 'rgba(255,255,255,0.07)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(255,255,255,0.10)',
//               boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
//               color: 'white',
//               position: 'relative',
//             }}
//           >
//             {/* Translate & Refresh buttons */}
//             <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
//               <Tooltip title={`Translate to ${story.language === 'en' ? 'Hindi' : 'English'}`}>
//                 <IconButton onClick={translateStory} disabled={translating} sx={{ color: '#60a5fa' }}>
//                   {translating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <Translate />}
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Generate new story (keep settings)">
//                 <IconButton onClick={generateStory} disabled={loading} sx={{ color: '#60a5fa' }}>
//                   <Refresh />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Title & Chips */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
//               <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
//                 {story.title}
//               </Typography>
//               <Box display="flex" gap={1} flexWrap="wrap" mt={{ xs: 1, sm: 0 }}>
//                 <Chip label={`${story.lineCount} lines`} color="primary" sx={{ fontWeight: 'bold' }} />
//                 {story.category && <Chip label={story.category} color="secondary" size="small" />}
//                 {story.theme && <Chip label={story.theme} variant="outlined" size="small" />}
//                 <Chip label={story.language === 'en' ? '🇬🇧 EN' : '🇮🇳 HI'} variant="outlined" size="small" />
//               </Box>
//             </Box>

//             {/* Lines */}
//             {story.lines.map((line) => (
//               <Box
//                 key={line.id}
//                 sx={{
//                   p: 2,
//                   my: 1,
//                   bgcolor: 'rgba(255,255,255,0.05)',
//                   borderRadius: 2,
//                   border: '1px solid rgba(255,255,255,0.08)',
//                   animation: 'zoomFade 0.5s ease-out',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1,
//                 }}
//               >
//                 {line.emoji && (
//                   <Typography variant="h5" sx={{ mr: 1 }}>
//                     {line.emoji}
//                   </Typography>
//                 )}
//                 <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
//                   {line.text}
//                 </Typography>
//               </Box>
//             ))}

//             {/* Subhvichar / Moral */}
//             <Paper
//               sx={{
//                 p: 2,
//                 mt: 3,
//                 bgcolor: 'rgba(59, 130, 246, 0.15)',
//                 borderRadius: 2,
//                 border: '1px solid rgba(59, 130, 246, 0.2)',
//               }}
//             >
//               <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#93bbfc' }}>
//                 💡 Subhvichar / Moral:
//               </Typography>
//               <Typography variant="body1" fontStyle="italic" sx={{ color: '#e0e0e0' }}>
//                 {story.moral}
//               </Typography>
//               {story.subhVichar && (
//                 <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
//                   ✨ {story.subhVichar}
//                 </Typography>
//               )}
//             </Paper>

//             {/* Vocabulary */}
//             {story.vocabulary && story.vocabulary.length > 0 && (
//               <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
//                 <Chip icon={<MenuBook />} label="Vocabulary" color="primary" variant="outlined" />
//                 {story.vocabulary.map((word, idx) => (
//                   <Chip key={idx} label={word} size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
//                 ))}
//               </Box>
//             )}

//             {/* Fun Fact */}
//             {story.funFact && (
//               <Box mt={2}>
//                 <Chip
//                   icon={<EmojiEvents />}
//                   label={`Fun Fact: ${story.funFact}`}
//                   color="success"
//                   variant="outlined"
//                 />
//               </Box>
//             )}
//           </Card>
//         ) : (
//           <Alert severity="info" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
//             Click “Generate Story” to create a magical tale!
//           </Alert>
//         )}
//       </Box>

//       {/* Animations */}
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(5deg); }
//         }
//         @keyframes zoomFade {
//           0% { transform: scale(0.9); opacity: 0; }
//           100% { transform: scale(1); opacity: 1; }
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default AIStoryGenerator;




// import React, { useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import {
//   Box,
//   Card,
//   Typography,
//   Button,
//   CircularProgress,
//   Paper,
//   Grid,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Alert,
//   IconButton,
//   Tooltip,
// } from '@mui/material';
// import { AutoAwesome, MenuBook, EmojiEvents, Translate, Refresh } from '@mui/icons-material';

// // ==================== Types ====================
// interface StoryLine {
//   id: number;
//   text: string;
//   emoji?: string;
// }

// interface StoryData {
//   _id: string;
//   title: string;
//   lines: StoryLine[];
//   moral: string;
//   subhVichar?: string;
//   vocabulary: string[];
//   funFact?: string;
//   language: 'en' | 'hi';
//   lineCount: number;
//   category: string;
//   theme?: string;
// }

// // ==================== Main Component ====================
// const AIStoryGenerator: React.FC = () => {
//   // ----- State -----
//   const [story, setStory] = useState<StoryData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [linesCount, setLinesCount] = useState<4 | 8 | 12>(8);
//   const [language, setLanguage] = useState<'en' | 'hi'>('en');
//   const [category, setCategory] = useState<string>('General');
//   const [theme, setTheme] = useState<string>('');
//   const [translating, setTranslating] = useState(false);

//   // ----- Constants -----
//   const categories = ['General', 'Family', 'Teacher', 'Nature', 'Friendship', 'Helping Others', 'Honesty', 'Kindness'];
//   const themes = ['', 'Kindness', 'Honesty', 'Respect', 'Discipline', 'Hard Work', 'Cleanliness', 'Sharing', 'Bravery', 'Friendship'];

//   // ----- Generate Story -----
//   const generateStory = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/aicontent/story?lines=${linesCount}&language=${language}&category=${category}&theme=${theme}`
//       );
//       if (response.data.success) {
//         setStory(response.data.data);
//         toast.success('Story generated! 🎉');
//       } else {
//         throw new Error(response.data.message || 'Failed to load story');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----- Translate Story -----
//   const translateStory = async () => {
//     if (!story) return;
//     const targetLang = story.language === 'en' ? 'hi' : 'en';
//     setTranslating(true);
//     try {
//       const response = await axios.post('http://localhost:5000/api/aicontent/translate-story', {
//         story,
//         targetLanguage: targetLang,
//       });
//       if (response.data.success) {
//         setStory(response.data.data);
//         toast.success(`Translated to ${targetLang === 'en' ? 'English' : 'Hindi'}!`);
//       } else {
//         throw new Error(response.data.message || 'Translation failed');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Translation failed');
//     } finally {
//       setTranslating(false);
//     }
//   };

//   // ----- Render -----
//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         px: { xs: 2, sm: 3, md: 4 },
//         py: { xs: 2, md: 3 },
//         background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Floating decorations with lighter opacity */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '10%',
//           left: '5%',
//           fontSize: 60,
//           opacity: 0.12,
//           transform: 'rotate(-10deg)',
//           animation: 'float 8s ease-in-out infinite',
//         }}
//       >
//         🌟
//       </Box>
//       <Box
//         sx={{
//           position: 'absolute',
//           bottom: '15%',
//           right: '8%',
//           fontSize: 80,
//           opacity: 0.10,
//           transform: 'rotate(15deg)',
//           animation: 'float 10s ease-in-out infinite reverse',
//         }}
//       >
//         📚
//       </Box>
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '40%',
//           right: '20%',
//           fontSize: 50,
//           opacity: 0.12,
//           animation: 'float 12s ease-in-out infinite',
//         }}
//       >
//         ✨
//       </Box>

//       <Box sx={{ maxWidth: 900, mx: 'auto', position: 'relative', zIndex: 1 }}>
//         {/* Header */}
//         <Box mb={4} textAlign="center">
//           <Typography
//             variant="h3"
//             fontWeight="extrabold"
//             sx={{
//               color: 'white',
//               textShadow: '0 4px 20px rgba(0,0,0,0.6)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 2,
//             }}
//           >
//             <AutoAwesome sx={{ fontSize: 50, color: '#60a5fa' }} />
//             Story Time
//             <AutoAwesome sx={{ fontSize: 50, color: '#60a5fa' }} />
//           </Typography>
//           <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//             Choose story length, language, category, and theme – then generate magic!
//           </Typography>
//         </Box>

//         {/* Controls Card */}
//         <Card
//           sx={{
//             p: 3,
//             mb: 4,
//             borderRadius: 4,
//             background: 'rgba(255,255,255,0.08)',
//             backdropFilter: 'blur(15px)',
//             border: '1px solid rgba(255,255,255,0.12)',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
//           }}
//         >
//           <Grid container spacing={2} alignItems="center">
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>📏 Length</InputLabel>
//                 <Select
//                   value={linesCount}
//                   onChange={(e) => setLinesCount(e.target.value as 4 | 8 | 12)}
//                   label="📏 Length"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
//                   }}
//                 >
//                   <MenuItem value={4}>4 Lines</MenuItem>
//                   <MenuItem value={8}>8 Lines</MenuItem>
//                   <MenuItem value={12}>12 Lines</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
//                   <Translate sx={{ mr: 1, fontSize: 18 }} /> Language
//                 </InputLabel>
//                 <Select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
//                   label="Language"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
//                   }}
//                 >
//                   <MenuItem value="en">English</MenuItem>
//                   <MenuItem value="hi">हिंदी</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>📂 Category</InputLabel>
//                 <Select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   label="Category"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
//                   }}
//                 >
//                   {categories.map(cat => (
//                     <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>🎯 Theme (optional)</InputLabel>
//                 <Select
//                   value={theme}
//                   onChange={(e) => setTheme(e.target.value)}
//                   label="Theme (optional)"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
//                   }}
//                 >
//                   {themes.map(t => (
//                     <MenuItem key={t} value={t}>{t || 'None'}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12 }}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={generateStory}
//                 disabled={loading}
//                 sx={{
//                   background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
//                   color: 'white',
//                   fontWeight: 'bold',
//                   py: 1.5,
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
//                   },
//                 }}
//               >
//                 {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '🌟 Generate Story'}
//               </Button>
//             </Grid>
//           </Grid>
//         </Card>

//         {/* Story Display */}
//         {loading ? (
//           <Box display="flex" justifyContent="center" py={10}>
//             <CircularProgress sx={{ color: 'white' }} />
//           </Box>
//         ) : story ? (
//           <Card
//             sx={{
//               p: 4,
//               borderRadius: 4,
//               background: 'rgba(255,255,255,0.07)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(255,255,255,0.10)',
//               boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
//               color: 'white',
//               position: 'relative',
//             }}
//           >
//             {/* Translate & Refresh buttons */}
//             <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
//               <Tooltip title={`Translate to ${story.language === 'en' ? 'Hindi' : 'English'}`}>
//                 <IconButton onClick={translateStory} disabled={translating} sx={{ color: '#60a5fa' }}>
//                   {translating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <Translate />}
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Generate new story (keep settings)">
//                 <IconButton onClick={generateStory} disabled={loading} sx={{ color: '#60a5fa' }}>
//                   <Refresh />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Title & Chips */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
//               <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
//                 {story.title}
//               </Typography>
//               <Box display="flex" gap={1} flexWrap="wrap" mt={{ xs: 1, sm: 0 }}>
//                 <Chip label={`${story.lineCount} lines`} color="primary" sx={{ fontWeight: 'bold' }} />
//                 {story.category && <Chip label={story.category} color="secondary" size="small" />}
//                 {story.theme && <Chip label={story.theme} variant="outlined" size="small" />}
//                 <Chip label={story.language === 'en' ? '🇬🇧 EN' : '🇮🇳 HI'} variant="outlined" size="small" />
//               </Box>
//             </Box>

//             {/* Lines */}
//             {story.lines.map((line) => (
//               <Box
//                 key={line.id}
//                 sx={{
//                   p: 2,
//                   my: 1,
//                   bgcolor: 'rgba(255,255,255,0.05)',
//                   borderRadius: 2,
//                   border: '1px solid rgba(255,255,255,0.08)',
//                   animation: 'zoomFade 0.5s ease-out',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1,
//                 }}
//               >
//                 {line.emoji && (
//                   <Typography variant="h5" sx={{ mr: 1 }}>
//                     {line.emoji}
//                   </Typography>
//                 )}
//                 <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
//                   {line.text}
//                 </Typography>
//               </Box>
//             ))}

//             {/* Subhvichar / Moral */}
//             <Paper
//               sx={{
//                 p: 2,
//                 mt: 3,
//                 bgcolor: 'rgba(59, 130, 246, 0.15)',
//                 borderRadius: 2,
//                 border: '1px solid rgba(59, 130, 246, 0.2)',
//               }}
//             >
//               <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#93bbfc' }}>
//                 💡 Subhvichar / Moral:
//               </Typography>
//               <Typography variant="body1" fontStyle="italic" sx={{ color: '#e0e0e0' }}>
//                 {story.moral}
//               </Typography>
//               {story.subhVichar && (
//                 <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
//                   ✨ {story.subhVichar}
//                 </Typography>
//               )}
//             </Paper>

//             {/* Vocabulary */}
//             {story.vocabulary && story.vocabulary.length > 0 && (
//               <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
//                 <Chip icon={<MenuBook />} label="Vocabulary" color="primary" variant="outlined" />
//                 {story.vocabulary.map((word, idx) => (
//                   <Chip key={idx} label={word} size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
//                 ))}
//               </Box>
//             )}

//             {/* Fun Fact */}
//             {story.funFact && (
//               <Box mt={2}>
//                 <Chip
//                   icon={<EmojiEvents />}
//                   label={`Fun Fact: ${story.funFact}`}
//                   color="success"
//                   variant="outlined"
//                 />
//               </Box>
//             )}
//           </Card>
//         ) : (
//           <Alert severity="info" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
//             Click “Generate Story” to create a magical tale!
//           </Alert>
//         )}
//       </Box>

//       {/* Animations */}
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(5deg); }
//         }
//         @keyframes zoomFade {
//           0% { transform: scale(0.9); opacity: 0; }
//           100% { transform: scale(1); opacity: 1; }
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default AIStoryGenerator;



// import React, { useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import {
//   Box,
//   Card,
//   Typography,
//   Button,
//   CircularProgress,
//   Paper,
//   Grid,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Alert,
//   IconButton,
//   Tooltip,
//   Autocomplete,
//   TextField,
// } from '@mui/material';
// import { AutoAwesome, MenuBook, EmojiEvents, Translate, Refresh } from '@mui/icons-material';

// // ==================== Types ====================
// interface StoryLine {
//   id: number;
//   text: string;
//   emoji?: string;
// }

// interface StoryData {
//   _id: string;
//   title: string;
//   lines: StoryLine[];
//   moral: string;
//   subhVichar?: string;
//   vocabulary: string[];
//   funFact?: string;
//   language: 'en' | 'hi';
//   lineCount: number;
//   category: string;
//   theme?: string;
// }

// // ==================== Main Component ====================
// const AIStoryGenerator: React.FC = () => {
//   // ----- State -----
//   const [story, setStory] = useState<StoryData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [linesCount, setLinesCount] = useState<4 | 8 | 12>(8);
//   const [language, setLanguage] = useState<'en' | 'hi'>('en');
//   const [category, setCategory] = useState<string>('General');
//   const [theme, setTheme] = useState<string>('');
//   const [translating, setTranslating] = useState(false);

//   // ----- Constants (options for Autocomplete) -----
//   const categories = ['General', 'Family', 'Teacher', 'Nature', 'Friendship', 'Helping Others', 'Honesty', 'Kindness'];
//   const themes = ['', 'Kindness', 'Honesty', 'Respect', 'Discipline', 'Hard Work', 'Cleanliness', 'Sharing', 'Bravery', 'Friendship'];

//   // ----- Generate Story -----
//   const generateStory = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/aicontent/story?lines=${linesCount}&language=${language}&category=${category}&theme=${theme}`
//       );
//       if (response.data.success) {
//         setStory(response.data.data);
//         toast.success('Story generated! 🎉');
//       } else {
//         throw new Error(response.data.message || 'Failed to load story');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----- Translate Story -----
//   const translateStory = async () => {
//     if (!story) return;
//     const targetLang = story.language === 'en' ? 'hi' : 'en';
//     setTranslating(true);
//     try {
//       const response = await axios.post('http://localhost:5000/api/aicontent/translate-story', {
//         story,
//         targetLanguage: targetLang,
//       });
//       if (response.data.success) {
//         setStory(response.data.data);
//         toast.success(`Translated to ${targetLang === 'en' ? 'English' : 'Hindi'}!`);
//       } else {
//         throw new Error(response.data.message || 'Translation failed');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Translation failed');
//     } finally {
//       setTranslating(false);
//     }
//   };

//   // ----- Render -----
//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         px: { xs: 2, sm: 3, md: 4 },
//         py: { xs: 2, md: 3 },
//         background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Floating decorations with lighter opacity */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '10%',
//           left: '5%',
//           fontSize: 60,
//           opacity: 0.12,
//           transform: 'rotate(-10deg)',
//           animation: 'float 8s ease-in-out infinite',
//         }}
//       >
//         🌟
//       </Box>
//       <Box
//         sx={{
//           position: 'absolute',
//           bottom: '15%',
//           right: '8%',
//           fontSize: 80,
//           opacity: 0.10,
//           transform: 'rotate(15deg)',
//           animation: 'float 10s ease-in-out infinite reverse',
//         }}
//       >
//         📚
//       </Box>
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '40%',
//           right: '20%',
//           fontSize: 50,
//           opacity: 0.12,
//           animation: 'float 12s ease-in-out infinite',
//         }}
//       >
//         ✨
//       </Box>

//       <Box sx={{ maxWidth: 900, mx: 'auto', position: 'relative', zIndex: 1 }}>
//         {/* Header */}
//         <Box mb={4} textAlign="center">
//           <Typography
//             variant="h3"
//             fontWeight="extrabold"
//             sx={{
//               color: 'white',
//               textShadow: '0 4px 20px rgba(0,0,0,0.6)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 2,
//             }}
//           >
//             <AutoAwesome sx={{ fontSize: 50, color: '#60a5fa' }} />
//             Story Time
//             <AutoAwesome sx={{ fontSize: 50, color: '#60a5fa' }} />
//           </Typography>
//           <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//             Choose story length, language, category, and theme – then generate magic!
//           </Typography>
//         </Box>

//         {/* Controls Card */}
//         <Card
//           sx={{
//             p: 3,
//             mb: 4,
//             borderRadius: 4,
//             background: 'rgba(255,255,255,0.08)',
//             backdropFilter: 'blur(15px)',
//             border: '1px solid rgba(255,255,255,0.12)',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
//           }}
//         >
//           <Grid container spacing={2} alignItems="center">
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>📏 Length</InputLabel>
//                 <Select
//                   value={linesCount}
//                   onChange={(e) => setLinesCount(e.target.value as 4 | 8 | 12)}
//                   label="📏 Length"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
//                   }}
//                 >
//                   <MenuItem value={4}>4 Lines</MenuItem>
//                   <MenuItem value={8}>8 Lines</MenuItem>
//                   <MenuItem value={12}>12 Lines</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
//                   <Translate sx={{ mr: 1, fontSize: 18 }} /> Language
//                 </InputLabel>
//                 <Select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
//                   label="Language"
//                   sx={{
//                     color: 'white',
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
//                   }}
//                 >
//                   <MenuItem value="en">English</MenuItem>
//                   <MenuItem value="hi">हिंदी</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Category – Autocomplete with free solo */}
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Autocomplete
//                 freeSolo
//                 options={categories}
//                 value={category}
//                 onChange={(event, newValue) => setCategory(newValue || 'General')}
//                 onInputChange={(event, newInputValue) => {
//                   // Allow typing custom value
//                   if (newInputValue !== undefined) {
//                     setCategory(newInputValue);
//                   }
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="📂 Category"
//                     variant="outlined"
//                     sx={{
//                       input: { color: 'white' },
//                       label: { color: 'rgba(255,255,255,0.7)' },
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
//                         '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
//                         '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
//                       },
//                     }}
//                   />
//                 )}
//                 sx={{
//                   '& .MuiAutocomplete-clearIndicator': { color: 'white' },
//                   '& .MuiAutocomplete-popupIndicator': { color: 'white' },
//                 }}
//               />
//             </Grid>

//             {/* Theme – Autocomplete with free solo */}
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Autocomplete
//                 freeSolo
//                 options={themes}
//                 value={theme}
//                 onChange={(event, newValue) => setTheme(newValue || '')}
//                 onInputChange={(event, newInputValue) => {
//                   if (newInputValue !== undefined) {
//                     setTheme(newInputValue);
//                   }
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="🎯 Theme (optional)"
//                     variant="outlined"
//                     sx={{
//                       input: { color: 'white' },
//                       label: { color: 'rgba(255,255,255,0.7)' },
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
//                         '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
//                         '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
//                       },
//                     }}
//                   />
//                 )}
//                 sx={{
//                   '& .MuiAutocomplete-clearIndicator': { color: 'white' },
//                   '& .MuiAutocomplete-popupIndicator': { color: 'white' },
//                 }}
//               />
//             </Grid>

//             <Grid size={{ xs: 12 }}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={generateStory}
//                 disabled={loading}
//                 sx={{
//                   background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
//                   color: 'white',
//                   fontWeight: 'bold',
//                   py: 1.5,
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
//                   },
//                 }}
//               >
//                 {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '🌟 Generate Story'}
//               </Button>
//             </Grid>
//           </Grid>
//         </Card>

//         {/* Story Display */}
//         {loading ? (
//           <Box display="flex" justifyContent="center" py={10}>
//             <CircularProgress sx={{ color: 'white' }} />
//           </Box>
//         ) : story ? (
//           <Card
//             sx={{
//               p: 4,
//               borderRadius: 4,
//               background: 'rgba(255,255,255,0.07)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(255,255,255,0.10)',
//               boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
//               color: 'white',
//               position: 'relative',
//             }}
//           >
//             {/* Translate & Refresh buttons */}
//             <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
//               <Tooltip title={`Translate to ${story.language === 'en' ? 'Hindi' : 'English'}`}>
//                 <IconButton onClick={translateStory} disabled={translating} sx={{ color: '#60a5fa' }}>
//                   {translating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <Translate />}
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Generate new story (keep settings)">
//                 <IconButton onClick={generateStory} disabled={loading} sx={{ color: '#60a5fa' }}>
//                   <Refresh />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Title & Chips */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
//               <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
//                 {story.title}
//               </Typography>
//               <Box display="flex" gap={1} flexWrap="wrap" mt={{ xs: 1, sm: 0 }}>
//                 <Chip label={`${story.lineCount} lines`} color="primary" sx={{ fontWeight: 'bold' }} />
//                 {story.category && <Chip label={story.category} color="secondary" size="small" />}
//                 {story.theme && <Chip label={story.theme} variant="outlined" size="small" />}
//                 <Chip label={story.language === 'en' ? '🇬🇧 EN' : '🇮🇳 HI'} variant="outlined" size="small" />
//               </Box>
//             </Box>

//             {/* Lines */}
//             {story.lines.map((line) => (
//               <Box
//                 key={line.id}
//                 sx={{
//                   p: 2,
//                   my: 1,
//                   bgcolor: 'rgba(255,255,255,0.05)',
//                   borderRadius: 2,
//                   border: '1px solid rgba(255,255,255,0.08)',
//                   animation: 'zoomFade 0.5s ease-out',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1,
//                 }}
//               >
//                 {line.emoji && (
//                   <Typography variant="h5" sx={{ mr: 1 }}>
//                     {line.emoji}
//                   </Typography>
//                 )}
//                 <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
//                   {line.text}
//                 </Typography>
//               </Box>
//             ))}

//             {/* Subhvichar / Moral */}
//             <Paper
//               sx={{
//                 p: 2,
//                 mt: 3,
//                 bgcolor: 'rgba(59, 130, 246, 0.15)',
//                 borderRadius: 2,
//                 border: '1px solid rgba(59, 130, 246, 0.2)',
//               }}
//             >
//               <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#93bbfc' }}>
//                 💡 Subhvichar / Moral:
//               </Typography>
//               <Typography variant="body1" fontStyle="italic" sx={{ color: '#e0e0e0' }}>
//                 {story.moral}
//               </Typography>
//               {story.subhVichar && (
//                 <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
//                   ✨ {story.subhVichar}
//                 </Typography>
//               )}
//             </Paper>

//             {/* Vocabulary */}
//             {story.vocabulary && story.vocabulary.length > 0 && (
//               <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
//                 <Chip icon={<MenuBook />} label="Vocabulary" color="primary" variant="outlined" />
//                 {story.vocabulary.map((word, idx) => (
//                   <Chip key={idx} label={word} size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
//                 ))}
//               </Box>
//             )}

//             {/* Fun Fact */}
//             {story.funFact && (
//               <Box mt={2}>
//                 <Chip
//                   icon={<EmojiEvents />}
//                   label={`Fun Fact: ${story.funFact}`}
//                   color="success"
//                   variant="outlined"
//                 />
//               </Box>
//             )}
//           </Card>
//         ) : (
//           <Alert severity="info" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
//             Click “Generate Story” to create a magical tale!
//           </Alert>
//         )}
//       </Box>

//       {/* Animations */}
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(5deg); }
//         }
//         @keyframes zoomFade {
//           0% { transform: scale(0.9); opacity: 0; }
//           100% { transform: scale(1); opacity: 1; }
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default AIStoryGenerator;



import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tooltip,
  Autocomplete,
  TextField,
} from '@mui/material';
import { AutoAwesome, MenuBook, EmojiEvents, Translate, Refresh } from '@mui/icons-material';

// ==================== Types ====================
interface StoryLine {
  id: number;
  text: string;
  emoji?: string;
}

interface StoryData {
  _id: string;
  title: string;
  lines: StoryLine[];
  moral: string;
  subhVichar?: string;
  vocabulary: string[];
  funFact?: string;
  language: 'en' | 'hi';
  lineCount: number;
  category: string;
  theme?: string;
}

// ==================== Main Component ====================
const AIStoryGenerator: React.FC = () => {
  // ----- State -----
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [linesCount, setLinesCount] = useState<4 | 8 | 12>(8);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Category & Theme – free text (user can type anything)
  const [category, setCategory] = useState<string>('General');
  const [theme, setTheme] = useState<string>('');

  const [translating, setTranslating] = useState(false);

  // ----- Constants (options for Autocomplete dropdown) -----
  const categoryOptions = [
    'General',
    'Family',
    'Teacher',
    'Nature',
    'Friendship',
    'Helping Others',
    'Honesty',
    'Kindness',
    'Independence',
    'Patriotism',
    'Science',
    'Adventure',
    'Mystery',
    'Festival',
    'History',
  ];

  const themeOptions = [
    '',
    'Kindness',
    'Honesty',
    'Respect',
    'Discipline',
    'Hard Work',
    'Cleanliness',
    'Sharing',
    'Bravery',
    'Friendship',
    'Patriotism',
    'Courage',
    'Curiosity',
    'Gratitude',
    'Teamwork',
  ];

  // ----- Generate Story -----
  const generateStory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/aicontent/story?lines=${linesCount}&language=${language}&category=${encodeURIComponent(
          category
        )}&theme=${encodeURIComponent(theme)}`
      );
      if (response.data.success) {
        setStory(response.data.data);
        toast.success('Story generated! 🎉');
      } else {
        throw new Error(response.data.message || 'Failed to load story');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ----- Translate Story -----
  const translateStory = async () => {
    if (!story) return;
    const targetLang = story.language === 'en' ? 'hi' : 'en';
    setTranslating(true);
    try {
      const response = await axios.post('http://localhost:5000/api/aicontent/translate-story', {
        story,
        targetLanguage: targetLang,
      });
      if (response.data.success) {
        setStory(response.data.data);
        toast.success(`Translated to ${targetLang === 'en' ? 'English' : 'Hindi'}!`);
      } else {
        throw new Error(response.data.message || 'Translation failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  // ----- Render -----
  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating decorations */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          fontSize: 60,
          opacity: 0.12,
          transform: 'rotate(-10deg)',
          animation: 'float 8s ease-in-out infinite',
        }}
      >
        🌟
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          fontSize: 80,
          opacity: 0.10,
          transform: 'rotate(15deg)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      >
        📚
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          right: '20%',
          fontSize: 50,
          opacity: 0.12,
          animation: 'float 12s ease-in-out infinite',
        }}
      >
        ✨
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box mb={4} textAlign="center">
          <Typography
            variant="h3"
            fontWeight="extrabold"
            sx={{
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <AutoAwesome sx={{ fontSize: 50, color: '#60a5fa' }} />
            Story Time
            <AutoAwesome sx={{ fontSize: 50, color: '#60a5fa' }} />
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Choose story length, language, category, and theme – or type your own!
          </Typography>
        </Box>

        {/* Controls Card */}
        <Card
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Length */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>📏 Length</InputLabel>
                <Select
                  value={linesCount}
                  onChange={(e) => setLinesCount(e.target.value as 4 | 8 | 12)}
                  label="📏 Length"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                  }}
                >
                  <MenuItem value={4}>4 Lines</MenuItem>
                  <MenuItem value={8}>8 Lines</MenuItem>
                  <MenuItem value={12}>12 Lines</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Language */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  <Translate sx={{ mr: 1, fontSize: 18 }} /> Language
                </InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                  label="Language"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                  }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">हिंदी</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Category – Autocomplete with free solo (type anything) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                freeSolo
                options={categoryOptions}
                value={category}
                onChange={(_event, newValue) => {
                  // When user selects from dropdown
                  setCategory(newValue || 'General');
                }}
                onInputChange={(_event, newInputValue) => {
                  // When user types
                  if (newInputValue !== undefined) {
                    setCategory(newInputValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="📂 Category (type any)"
                    variant="outlined"
                    sx={{
                      input: { color: 'white' },
                      label: { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Theme – Autocomplete with free solo (type anything) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                freeSolo
                options={themeOptions}
                value={theme}
                onChange={(_event, newValue) => {
                  setTheme(newValue || '');
                }}
                onInputChange={(_event, newInputValue) => {
                  if (newInputValue !== undefined) {
                    setTheme(newInputValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="🎯 Theme (type any, optional)"
                    variant="outlined"
                    sx={{
                      input: { color: 'white' },
                      label: { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Generate Button */}
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={generateStory}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '🌟 Generate Story'}
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Story Display */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : story ? (
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              color: 'white',
              position: 'relative',
            }}
          >
            {/* Translate & Refresh buttons */}
            <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
              <Tooltip title={`Translate to ${story.language === 'en' ? 'Hindi' : 'English'}`}>
                <IconButton onClick={translateStory} disabled={translating} sx={{ color: '#60a5fa' }}>
                  {translating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <Translate />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate new story (keep settings)">
                <IconButton onClick={generateStory} disabled={loading} sx={{ color: '#60a5fa' }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Title & Chips */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
                {story.title}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={{ xs: 1, sm: 0 }}>
                <Chip label={`${story.lineCount} lines`} color="primary" sx={{ fontWeight: 'bold' }} />
                {story.category && <Chip label={story.category} color="secondary" size="small" />}
                {story.theme && <Chip label={story.theme} variant="outlined" size="small" />}
                <Chip label={story.language === 'en' ? '🇬🇧 EN' : '🇮🇳 HI'} variant="outlined" size="small" />
              </Box>
            </Box>

            {/* Lines */}
            {story.lines.map((line) => (
              <Box
                key={line.id}
                sx={{
                  p: 2,
                  my: 1,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.08)',
                  animation: 'zoomFade 0.5s ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {line.emoji && (
                  <Typography variant="h5" sx={{ mr: 1 }}>
                    {line.emoji}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {line.text}
                </Typography>
              </Box>
            ))}

            {/* Subhvichar / Moral */}
            <Paper
              sx={{
                p: 2,
                mt: 3,
                bgcolor: 'rgba(59, 130, 246, 0.15)',
                borderRadius: 2,
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#93bbfc' }}>
                💡 Subhvichar / Moral:
              </Typography>
              <Typography variant="body1" fontStyle="italic" sx={{ color: '#e0e0e0' }}>
                {story.moral}
              </Typography>
              {story.subhVichar && (
                <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
                  ✨ {story.subhVichar}
                </Typography>
              )}
            </Paper>

            {/* Vocabulary */}
            {story.vocabulary && story.vocabulary.length > 0 && (
              <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                <Chip icon={<MenuBook />} label="Vocabulary" color="primary" variant="outlined" />
                {story.vocabulary.map((word, idx) => (
                  <Chip key={idx} label={word} size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                ))}
              </Box>
            )}

            {/* Fun Fact */}
            {story.funFact && (
              <Box mt={2}>
                <Chip
                  icon={<EmojiEvents />}
                  label={`Fun Fact: ${story.funFact}`}
                  color="success"
                  variant="outlined"
                />
              </Box>
            )}
          </Card>
        ) : (
          <Alert severity="info" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
            Click “Generate Story” to create a magical tale!
          </Alert>
        )}
      </Box>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes zoomFade {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default AIStoryGenerator;