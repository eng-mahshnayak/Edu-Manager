


// import React, { useState, type ChangeEvent } from "react";
// import axios from 'axios';
// import toast from 'react-hot-toast';

// interface APIResponse {
//   success: boolean;
//   images?: string[];
//   error?: string;
// }

// // 📚 Sample Stories Database - Multiple Stories
// const SAMPLE_STORIES = [
//   // Story 1: The Magical Forest
//   {
//     scenes: [
//       "A little girl named Meera discovers a glowing door in an old tree in the magical forest",
//       "Meera steps through the door and finds herself in a world where animals can talk",
//       "A wise old owl tells Meera she must find the golden flower to save the forest",
//       "Meera bravely crosses a sparkling river and climbs a rainbow mountain to find the flower",
//       "Meera finds the golden flower and returns home, the forest is saved and everyone celebrates"
//     ]
//   },
//   // Story 2: The Space Adventure
//   {
//     scenes: [
//       "A young astronaut named Arjun builds a rocket ship in his backyard with his robot friend",
//       "Arjun and his robot blast off into space and see beautiful planets and stars",
//       "Their rocket ship gets stuck in an asteroid field and they must find a way through",
//       "Arjun uses his intelligence to navigate through the asteroids and discovers a new planet",
//       "They land on the new planet, make friends with aliens, and return home as heroes"
//     ]
//   },
//   // Story 3: The Ocean Mystery
//   {
//     scenes: [
//       "A brave girl named Maya finds a mysterious message in a bottle on the beach",
//       "Maya follows the map in the bottle and dives into the deep blue ocean",
//       "She meets friendly dolphins who guide her to a hidden underwater cave",
//       "Inside the cave, Maya discovers a treasure chest filled with magical pearls",
//       "Maya returns to the surface, shares the pearls with her village, and everyone is happy"
//     ]
//   },
//   // Story 4: The Jungle Safari
//   {
//     scenes: [
//       "Two friends, Ravi and Simran, go on a jungle safari and see beautiful animals",
//       "They hear a strange sound and find a baby elephant trapped in a net",
//       "Ravi and Simran work together to free the baby elephant from the net",
//       "The mother elephant arrives and thanks them, and they all become friends",
//       "The elephants guide them back to the camp safely and they have an amazing story to tell"
//     ]
//   },
//   // Story 5: The Birthday Surprise
//   {
//     scenes: [
//       "It's Rahul's birthday and his friends plan a surprise party for him",
//       "Rahul's friends decorate the room with balloons, streamers, and a big cake",
//       "Rahul comes home and is surprised to see all his friends shouting 'Happy Birthday!'",
//       "They all play games, sing songs, and Rahul makes a wish before cutting the cake",
//       "Rahul thanks all his friends and says it's the best birthday ever"
//     ]
//   },
//   // Story 6: The Lost Puppy
//   {
//     scenes: [
//       "A little boy named Amit finds a lost puppy shivering in the rain",
//       "Amit takes the puppy home and gives it warm milk and a soft bed",
//       "Amit puts up 'Lost Puppy' posters all around the neighborhood",
//       "A little girl calls and says the puppy belongs to her and comes to pick it up",
//       "Amit is happy to see the puppy reunited with its owner and gets a new friend"
//     ]
//   },
//   // Story 7: The Magic Paintbrush
//   {
//     scenes: [
//       "An artist named Priya finds a magic paintbrush that brings her paintings to life",
//       "Priya paints a beautiful garden and flowers start blooming in her room",
//       "She paints a bird and it flies around her, singing sweet songs",
//       "Priya uses the magic paintbrush to help others and paint happiness everywhere",
//       "Priya learns that true magic is sharing joy and kindness with others"
//     ]
//   },
//   // Story 8: The Mountain Climbing
//   {
//     scenes: [
//       "A group of friends decide to climb the highest mountain in their village",
//       "They start their journey early morning with backpacks full of food and water",
//       "The climb becomes difficult and one friend gets tired, others help him",
//       "They reach the top together and see the most beautiful sunrise of their lives",
//       "They take photos, celebrate, and climb down safely, feeling proud of themselves"
//     ]
//   },
//   // Story 9: The School Play
//   {
//     scenes: [
//       "The students of Class 5 are preparing for their annual school play",
//       "Everyone gets a role and they practice hard every day after school",
//       "On the day of the play, one student forgets his lines but others help him",
//       "The play goes beautifully and all the parents clap and cheer",
//       "The teacher praises everyone for their teamwork and they celebrate together"
//     ]
//   },
//   // Story 10: The Rainbow Village
//   {
//     scenes: [
//       "In a village where everything was grey, a girl named Lila wished for colors",
//       "Lila planted colorful flowers in her garden and painted her house with bright colors",
//       "Other villagers saw Lila's colors and started painting their houses too",
//       "Soon the whole village was filled with beautiful rainbow colors everywhere",
//       "Lila and the villagers had a colorful festival and everyone was happy"
//     ]
//   }
// ];

// const StoryGenerator: React.FC = () => {
//   const [sceneDescriptions, setSceneDescriptions] = useState<string[]>(['', '', '', '', '']);
//   const [images, setImages] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errorMsg, setErrorMsg] = useState<string>('');
//   const [currentLoadingIndex, setCurrentLoadingIndex] = useState<number>(0);
//   const [storyCount, setStoryCount] = useState<number>(0);

//   // Scene titles and placeholders
//   const scenes: any[] = [
//     {
//       id: 1,
//       title: "🌟 Scene 1: Beginning",
//       placeholder: "Describe the beginning of your story..."
//     },
//     {
//       id: 2,
//       title: "🚀 Scene 2: The Journey",
//       placeholder: "Describe the journey or adventure..."
//     },
//     {
//       id: 3,
//       title: "⚡ Scene 3: The Challenge",
//       placeholder: "Describe the main challenge or problem..."
//     },
//     {
//       id: 4,
//       title: "🎯 Scene 4: The Climax",
//       placeholder: "Describe how they overcome the challenge..."
//     },
//     {
//       id: 5,
//       title: "🏆 Scene 5: Happy Ending",
//       placeholder: "Describe the happy ending..."
//     }
//   ];

//   const handleSceneChange = (index: number, value: string) => {
//     const newDescriptions = [...sceneDescriptions];
//     newDescriptions[index] = value;
//     setSceneDescriptions(newDescriptions);
//   };

//   const handleGenerate = async () => {
//     const hasDescription = sceneDescriptions.some(desc => desc.trim().length > 0);
    
//     if (!hasDescription) {
//       toast.error('Please describe at least one scene');
//       return;
//     }

//     setLoading(true);
//     setImages([]);
//     setCurrentLoadingIndex(0);
//     setErrorMsg('');

//     try {
//       const response = await axios.post<APIResponse>(
//         'http://localhost:5000/api/generate-sketch',
//         { 
//           scenes: sceneDescriptions.map(desc => desc.trim() || 'A beautiful scene'),
//           description: sceneDescriptions.join(' ')
//         }
//       );

//       if (response.data.success && response.data.images && response.data.images.length > 0) {
//         setImages(response.data.images);
//         toast.success('🎉 Story generated successfully!');
//       } else {
//         setErrorMsg('Failed to generate story links.');
//         toast.error('Failed to generate story');
//       }
//     } catch (error) {
//       console.error('Error generating story:', error);
//       setErrorMsg('Server connection error. Please try again.');
//       toast.error('Server error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageFinish = () => {
//     setCurrentLoadingIndex((prev) => prev + 1);
//   };

//   const clearAll = () => {
//     setSceneDescriptions(['', '', '', '', '']);
//     setImages([]);
//     setErrorMsg('');
//   };

//   // 🔄 Fill with random sample story - HAR BAAR NAYI STORY
//   const fillSample = () => {
//     // Random story select karein
//     const randomIndex = Math.floor(Math.random() * SAMPLE_STORIES.length);
//     const selectedStory = SAMPLE_STORIES[randomIndex];
    
//     setSceneDescriptions(selectedStory.scenes);
//     setImages([]);
//     setErrorMsg('');
//     setStoryCount(prev => prev + 1);
    
//     toast.success(`📖 Story ${storyCount + 1} loaded! (${randomIndex + 1}/${SAMPLE_STORIES.length})`);
//   };

//   // 🎲 Get specific story by number (optional)
//   const loadStoryByNumber = (storyNumber: number) => {
//     const index = storyNumber % SAMPLE_STORIES.length;
//     const selectedStory = SAMPLE_STORIES[index];
//     setSceneDescriptions(selectedStory.scenes);
//     setImages([]);
//     setErrorMsg('');
//   };

//   return (
//     <div style={{ 
//       maxWidth: '1200px', 
//       margin: '30px auto', 
//       padding: '20px',
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//       borderRadius: '20px',
//     }}>
//       <div style={{
//         background: 'white',
//         borderRadius: '20px',
//         padding: '40px',
//         boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
//       }}>
//         <h2 style={{ 
//           fontSize: '32px', 
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           marginBottom: '10px',
//           textAlign: 'center',
//         }}>
//           📖 AI Storybook Generator
//         </h2>
//         <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
//           Describe each scene of your story in detail
//         </p>

//         {/* Story Counter */}
//         {storyCount > 0 && (
//           <div style={{ 
//             textAlign: 'center', 
//             marginBottom: '15px',
//             padding: '8px',
//             backgroundColor: '#e3f2fd',
//             borderRadius: '8px',
//             color: '#1976d2',
//           }}>
//             📚 Stories Loaded: {storyCount} | Click "Fill Sample Story" for a new story!
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
//           <button
//             onClick={fillSample}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontSize: '14px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//             }}
//           >
//             🔄 Random Story
//           </button>
//           <button
//             onClick={() => loadStoryByNumber(0)}
//             style={{
//               padding: '10px 15px',
//               backgroundColor: '#2196F3',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontSize: '13px',
//             }}
//           >
//             📖 Story 1
//           </button>
//           <button
//             onClick={() => loadStoryByNumber(1)}
//             style={{
//               padding: '10px 15px',
//               backgroundColor: '#2196F3',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontSize: '13px',
//             }}
//           >
//             📖 Story 2
//           </button>
//           <button
//             onClick={() => loadStoryByNumber(2)}
//             style={{
//               padding: '10px 15px',
//               backgroundColor: '#2196F3',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontSize: '13px',
//             }}
//           >
//             📖 Story 3
//           </button>
//           <button
//             onClick={() => loadStoryByNumber(3)}
//             style={{
//               padding: '10px 15px',
//               backgroundColor: '#2196F3',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontSize: '13px',
//             }}
//           >
//             📖 Story 4
//           </button>
//           <button
//             onClick={clearAll}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#f44336',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontSize: '14px',
//             }}
//           >
//             🗑️ Clear All
//           </button>
//         </div>

//         {/* 5 Scene Input Boxes */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//           {scenes.map((scene, index) => (
//             <div
//               key={scene.id}
//               style={{
//                 border: '2px solid #e0e0e0',
//                 borderRadius: '12px',
//                 padding: '15px',
//                 backgroundColor: '#fafafa',
//                 transition: 'border-color 0.3s',
//               }}
//             >
//               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
//                 <span style={{ fontSize: '18px' }}>{scene.title}</span>
//                 <span style={{ 
//                   fontSize: '12px', 
//                   color: '#999',
//                   marginLeft: 'auto',
//                 }}>
//                   {sceneDescriptions[index].split(/\s+/).filter(w => w).length} words
//                 </span>
//               </div>
//               <textarea
//                 rows={2}
//                 style={{
//                   width: '100%',
//                   padding: '12px',
//                   fontSize: '15px',
//                   borderRadius: '8px',
//                   border: '1px solid #ddd',
//                   fontFamily: 'inherit',
//                   resize: 'vertical',
//                   transition: 'border-color 0.3s',
//                 }}
//                 placeholder={scene.placeholder}
//                 value={sceneDescriptions[index]}
//                 onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleSceneChange(index, e.target.value)}
//                 disabled={loading}
//                 onFocus={(e) => e.target.style.borderColor = '#667eea'}
//                 onBlur={(e) => e.target.style.borderColor = '#ddd'}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Generate Button */}
//         <div style={{ textAlign: 'center', marginTop: '25px' }}>
//           <button
//             onClick={handleGenerate}
//             disabled={loading}
//             style={{
//               padding: '14px 50px',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               backgroundColor: loading ? '#ccc' : '#667eea',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '12px',
//               cursor: loading ? 'not-allowed' : 'pointer',
//               transition: 'all 0.3s',
//               boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
//               display: 'inline-flex',
//               alignItems: 'center',
//               gap: '10px',
//             }}
//           >
//             {loading ? (
//               <>
//                 <span className="spinner">⏳</span>
//                 Generating Storyboard...
//               </>
//             ) : (
//               '✨ Generate 5 Image Story'
//             )}
//           </button>
//         </div>

//         {errorMsg && (
//           <div style={{
//             marginTop: '20px',
//             padding: '12px',
//             backgroundColor: '#ffebee',
//             borderRadius: '8px',
//             color: '#c62828',
//             textAlign: 'center',
//           }}>
//             ❌ {errorMsg}
//           </div>
//         )}

//         {/* Progress Indicator */}
//         {images.length > 0 && currentLoadingIndex < images.length && (
//           <p style={{ 
//             color: '#667eea', 
//             fontWeight: 'bold', 
//             marginTop: '20px',
//             textAlign: 'center',
//           }}>
//             ⏳ Generating Scene {currentLoadingIndex + 1} of {images.length}...
//           </p>
//         )}

//         {/* Images Grid */}
//         {images.length > 0 && (
//           <div style={{ marginTop: '40px' }}>
//             <h3 style={{ 
//               fontSize: '24px', 
//               marginBottom: '20px',
//               textAlign: 'center',
//               color: '#333',
//             }}>
//               🎨 Your Storyboard
//             </h3>
//             <div
//               style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//                 gap: '25px',
//                 marginTop: '20px',
//               }}
//             >
//               {images.map((url, index) => {
//                 const canLoad = index <= currentLoadingIndex;

//                 return (
//                   <div
//                     key={index}
//                     style={{
//                       border: '2px solid #e0e0e0',
//                       borderRadius: '16px',
//                       padding: '15px',
//                       backgroundColor: '#f9f9f9',
//                       boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
//                       minHeight: '280px',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       transition: 'all 0.3s',
//                     }}
//                   >
//                     <h4 style={{ margin: '8px 0', color: '#444', fontSize: '16px' }}>
//                       {scenes[index]?.title || `Scene ${index + 1}`}
//                     </h4>

//                     {canLoad ? (
//                       <img
//                         src={url}
//                         alt={scenes[index]?.title || `Scene ${index + 1}`}
//                         onLoad={handleImageFinish}
//                         onError={handleImageFinish}
//                         style={{
//                           width: '100%',
//                           height: 'auto',
//                           borderRadius: '10px',
//                           maxHeight: '300px',
//                           objectFit: 'cover',
//                         }}
//                       />
//                     ) : (
//                       <div style={{ 
//                         margin: '20px 0', 
//                         color: '#888', 
//                         fontSize: '14px',
//                         textAlign: 'center',
//                       }}>
//                         ⏳ Waiting for previous scene...
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StoryGenerator;



import React, { useState, type ChangeEvent } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';

interface APIResponse {
  success: boolean;
  images?: string[];
  error?: string;
}

// 📚 Sample Stories Database - Multiple Stories
const SAMPLE_STORIES = [
  // Story 1: The Magical Forest
  {
    scenes: [
      "A little girl named Meera discovers a glowing door in an old tree in the magical forest",
      "Meera steps through the door and finds herself in a world where animals can talk",
      "A wise old owl tells Meera she must find the golden flower to save the forest",
      "Meera bravely crosses a sparkling river and climbs a rainbow mountain to find the flower",
      "Meera finds the golden flower and returns home, the forest is saved and everyone celebrates"
    ]
  },
  // Story 2: The Space Adventure
  {
    scenes: [
      "A young astronaut named Arjun builds a rocket ship in his backyard with his robot friend",
      "Arjun and his robot blast off into space and see beautiful planets and stars",
      "Their rocket ship gets stuck in an asteroid field and they must find a way through",
      "Arjun uses his intelligence to navigate through the asteroids and discovers a new planet",
      "They land on the new planet, make friends with aliens, and return home as heroes"
    ]
  },
  // Story 3: The Ocean Mystery
  {
    scenes: [
      "A brave girl named Maya finds a mysterious message in a bottle on the beach",
      "Maya follows the map in the bottle and dives into the deep blue ocean",
      "She meets friendly dolphins who guide her to a hidden underwater cave",
      "Inside the cave, Maya discovers a treasure chest filled with magical pearls",
      "Maya returns to the surface, shares the pearls with her village, and everyone is happy"
    ]
  },
  // Story 4: The Jungle Safari
  {
    scenes: [
      "Two friends, Ravi and Simran, go on a jungle safari and see beautiful animals",
      "They hear a strange sound and find a baby elephant trapped in a net",
      "Ravi and Simran work together to free the baby elephant from the net",
      "The mother elephant arrives and thanks them, and they all become friends",
      "The elephants guide them back to the camp safely and they have an amazing story to tell"
    ]
  },
  // Story 5: The Birthday Surprise
  {
    scenes: [
      "It's Rahul's birthday and his friends plan a surprise party for him",
      "Rahul's friends decorate the room with balloons, streamers, and a big cake",
      "Rahul comes home and is surprised to see all his friends shouting 'Happy Birthday!'",
      "They all play games, sing songs, and Rahul makes a wish before cutting the cake",
      "Rahul thanks all his friends and says it's the best birthday ever"
    ]
  },
  // Story 6: The Lost Puppy
  {
    scenes: [
      "A little boy named Amit finds a lost puppy shivering in the rain",
      "Amit takes the puppy home and gives it warm milk and a soft bed",
      "Amit puts up 'Lost Puppy' posters all around the neighborhood",
      "A little girl calls and says the puppy belongs to her and comes to pick it up",
      "Amit is happy to see the puppy reunited with its owner and gets a new friend"
    ]
  },
  // Story 7: The Magic Paintbrush
  {
    scenes: [
      "An artist named Priya finds a magic paintbrush that brings her paintings to life",
      "Priya paints a beautiful garden and flowers start blooming in her room",
      "She paints a bird and it flies around her, singing sweet songs",
      "Priya uses the magic paintbrush to help others and paint happiness everywhere",
      "Priya learns that true magic is sharing joy and kindness with others"
    ]
  },
  // Story 8: The Mountain Climbing
  {
    scenes: [
      "A group of friends decide to climb the highest mountain in their village",
      "They start their journey early morning with backpacks full of food and water",
      "The climb becomes difficult and one friend gets tired, others help him",
      "They reach the top together and see the most beautiful sunrise of their lives",
      "They take photos, celebrate, and climb down safely, feeling proud of themselves"
    ]
  },
  // Story 9: The School Play
  {
    scenes: [
      "The students of Class 5 are preparing for their annual school play",
      "Everyone gets a role and they practice hard every day after school",
      "On the day of the play, one student forgets his lines but others help him",
      "The play goes beautifully and all the parents clap and cheer",
      "The teacher praises everyone for their teamwork and they celebrate together"
    ]
  },
  // Story 10: The Rainbow Village
  {
    scenes: [
      "In a village where everything was grey, a girl named Lila wished for colors",
      "Lila planted colorful flowers in her garden and painted her house with bright colors",
      "Other villagers saw Lila's colors and started painting their houses too",
      "Soon the whole village was filled with beautiful rainbow colors everywhere",
      "Lila and the villagers had a colorful festival and everyone was happy"
    ]
  }
];

const StoryGenerator: React.FC = () => {
  const [sceneDescriptions, setSceneDescriptions] = useState<string[]>(['', '', '', '', '']);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [currentLoadingIndex, setCurrentLoadingIndex] = useState<number>(0);
  const [storyCount, setStoryCount] = useState<number>(0);

  // Scene titles and placeholders
  const scenes: any[] = [
    {
      id: 1,
      title: "🌟 Scene 1: Beginning",
      placeholder: "Describe the beginning of your story..."
    },
    {
      id: 2,
      title: "🚀 Scene 2: The Journey",
      placeholder: "Describe the journey or adventure..."
    },
    {
      id: 3,
      title: "⚡ Scene 3: The Challenge",
      placeholder: "Describe the main challenge or problem..."
    },
    {
      id: 4,
      title: "🎯 Scene 4: The Climax",
      placeholder: "Describe how they overcome the challenge..."
    },
    {
      id: 5,
      title: "🏆 Scene 5: Happy Ending",
      placeholder: "Describe the happy ending..."
    }
  ];

  const handleSceneChange = (index: number, value: string) => {
    const newDescriptions = [...sceneDescriptions];
    newDescriptions[index] = value;
    setSceneDescriptions(newDescriptions);
  };

  const handleGenerate = async () => {
    const hasDescription = sceneDescriptions.some(desc => desc.trim().length > 0);
    
    if (!hasDescription) {
      toast.error('Please describe at least one scene');
      return;
    }

    setLoading(true);
    setImages([]);
    setCurrentLoadingIndex(0);
    setErrorMsg('');

    try {
      const response = await axios.post<APIResponse>(
        'http://localhost:5000/api/generate-sketch',
        { 
          scenes: sceneDescriptions.map(desc => desc.trim() || 'A beautiful scene'),
          description: sceneDescriptions.join(' ')
        }
      );

      if (response.data.success && response.data.images && response.data.images.length > 0) {
        setImages(response.data.images);
        toast.success('🎉 Story generated successfully!');
      } else {
        setErrorMsg('Failed to generate story links.');
        toast.error('Failed to generate story');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      setErrorMsg('Server connection error. Please try again.');
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageFinish = () => {
    setCurrentLoadingIndex((prev) => prev + 1);
  };

  const clearAll = () => {
    setSceneDescriptions(['', '', '', '', '']);
    setImages([]);
    setErrorMsg('');
  };

  // 🔄 Fill with random sample story - HAR BAAR NAYI STORY
  const fillSample = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_STORIES.length);
    const selectedStory = SAMPLE_STORIES[randomIndex];
    
    setSceneDescriptions(selectedStory.scenes);
    setImages([]);
    setErrorMsg('');
    setStoryCount(prev => prev + 1);
    
    toast.success(`📖 Story ${storyCount + 1} loaded! (${randomIndex + 1}/${SAMPLE_STORIES.length})`);
  };

  // 🎲 Get specific story by number (optional)
  const loadStoryByNumber = (storyNumber: number) => {
    const index = storyNumber % SAMPLE_STORIES.length;
    const selectedStory = SAMPLE_STORIES[index];
    setSceneDescriptions(selectedStory.scenes);
    setImages([]);
    setErrorMsg('');
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '30px auto', 
      padding: '20px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      borderRadius: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating decorations */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        fontSize: '60px',
        opacity: 0.12,
        transform: 'rotate(-10deg)',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none',
      }}>🌟</div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        fontSize: '80px',
        opacity: 0.10,
        transform: 'rotate(15deg)',
        animation: 'float 10s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }}>📚</div>
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '20%',
        fontSize: '50px',
        opacity: 0.12,
        animation: 'float 12s ease-in-out infinite',
        pointerEvents: 'none',
      }}>✨</div>

      <div style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.10)',
        position: 'relative',
        zIndex: 1,
      }}>
        <h2 style={{ 
          fontSize: '32px', 
          background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px',
          textAlign: 'center',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          📖 AI Storybook Generator
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px', textAlign: 'center' }}>
          Describe each scene of your story in detail
        </p>

        {/* Story Counter */}
        {storyCount > 0 && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '15px',
            padding: '8px',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderRadius: '8px',
            color: '#93bbfc',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}>
            📚 Stories Loaded: {storyCount} | Click "Random Story" for a new one!
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={fillSample}
            style={{
              padding: '10px 20px',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#22c55e'}
          >
            🔄 Random Story
          </button>
          <button
            onClick={() => loadStoryByNumber(0)}
            style={{
              padding: '10px 15px',
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.8)'}
          >
            📖 Story 1
          </button>
          <button
            onClick={() => loadStoryByNumber(1)}
            style={{
              padding: '10px 15px',
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.8)'}
          >
            📖 Story 2
          </button>
          <button
            onClick={() => loadStoryByNumber(2)}
            style={{
              padding: '10px 15px',
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.8)'}
          >
            📖 Story 3
          </button>
          <button
            onClick={() => loadStoryByNumber(3)}
            style={{
              padding: '10px 15px',
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.8)'}
          >
            📖 Story 4
          </button>
          <button
            onClick={clearAll}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            🗑️ Clear All
          </button>
        </div>

        {/* 5 Scene Input Boxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '15px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                transition: 'border-color 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px', color: '#e0e0e0' }}>{scene.title}</span>
                <span style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255,255,255,0.5)',
                  marginLeft: 'auto',
                }}>
                  {sceneDescriptions[index].split(/\s+/).filter(w => w).length} words
                </span>
              </div>
              <textarea
                rows={2}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  transition: 'border-color 0.3s',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: '#e0e0e0',
                }}
                placeholder={scene.placeholder}
                value={sceneDescriptions[index]}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleSceneChange(index, e.target.value)}
                disabled={loading}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              padding: '14px 50px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: loading ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: loading ? '#4b5563' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {loading ? (
              <>
                <span className="spinner">⏳</span>
                Generating Storyboard...
              </>
            ) : (
              '✨ Generate 5 Image Story'
            )}
          </button>
        </div>

        {errorMsg && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderRadius: '8px',
            color: '#fca5a5',
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}>
            ❌ {errorMsg}
          </div>
        )}

        {/* Progress Indicator */}
        {images.length > 0 && currentLoadingIndex < images.length && (
          <p style={{ 
            color: '#93bbfc', 
            fontWeight: 'bold', 
            marginTop: '20px',
            textAlign: 'center',
          }}>
            ⏳ Generating Scene {currentLoadingIndex + 1} of {images.length}...
          </p>
        )}

        {/* Images Grid */}
        {images.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '20px',
              textAlign: 'center',
              color: '#e0e0e0',
            }}>
              🎨 Your Storyboard
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '25px',
                marginTop: '20px',
              }}
            >
              {images.map((url, index) => {
                const canLoad = index <= currentLoadingIndex;

                return (
                  <div
                    key={index}
                    style={{
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: '16px',
                      padding: '15px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      minHeight: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                    }}
                  >
                    <h4 style={{ margin: '8px 0', color: '#cbd5e1', fontSize: '16px' }}>
                      {scenes[index]?.title || `Scene ${index + 1}`}
                    </h4>

                    {canLoad ? (
                      <img
                        src={url}
                        alt={scenes[index]?.title || `Scene ${index + 1}`}
                        onLoad={handleImageFinish}
                        onError={handleImageFinish}
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '10px',
                          maxHeight: '300px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div style={{ 
                        margin: '20px 0', 
                        color: 'rgba(255,255,255,0.4)', 
                        fontSize: '14px',
                        textAlign: 'center',
                      }}>
                        ⏳ Waiting for previous scene...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Inject animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes zoomFade {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StoryGenerator;