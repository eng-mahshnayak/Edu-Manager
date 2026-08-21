// import React, { useState } from 'react';

// // ----- Types -----
// interface Game {
//   id: string;
//   title: string;
//   category: 'mind-memory' | 'physical-coordination' | 'teamwork-strategy';
//   emoji: string;
//   description: string;
//   howToPlay: string[];
//   benefits: string[];
//   imageUrl: string;
// }

// // ----- Game Data (5 Games) -----
// const gamesData: Game[] = [
//   // ========== MIND & MEMORY GAMES (10) ==========
//   {
//     id: 'pass-the-action',
//     title: 'Pass the Action (Silent Charades Loop)',
//     category: 'mind-memory',
//     emoji: '🎭',
//     description: 'Line me action pass karo aur last wala guess kare.',
//     imageUrl: '/pass_action.png',
//     howToPlay: [
//       'Sabhi bachche ek line me ek taraf peeth karke khade hote hain.',
//       'Pehla bachcha doosre bachche ko tap karta hai aur bina bole ek action (jaise monkey, swimming, chef cooking) karke dikhata hai.',
//       'Doosra bachcha teesre ko wahi action pass karta hai.',
//       'Last wala bachcha guess karta hai ki original action kya tha.',
//     ],
//     benefits: [
//       '👀 Focus: Attention span improve hota hai.',
//       '🔍 Observation Powers: Details notice karna seekhte hain.',
//       '🤝 Non-verbal Communication: Bina bole express karna seekhte hain.',
//     ],
//   },
//   {
//     id: 'two-truths-lie',
//     title: 'Two Truths and a Lie (Sach ya Jhooth)',
//     category: 'mind-memory',
//     emoji: '🧐',
//     description: 'Do sach aur ek jhooth – baki ko pehchanna hai.',
//     imageUrl: '/truth_and_lie.png',
//     howToPlay: [
//       'Ek-ek karke bachcha apne baare me 3 baatein bolta hai—2 sach aur 1 jhooth.',
//       'Baki sabhi bachchon ko guess karna hota hai ki kaun si baat jhooth hai.',
//       'Har bachche ki baari aani chahiye.',
//       'Sahi guess karne wala point score karta hai.',
//     ],
//     benefits: [
//       '🧠 Memory Power: Doosron ki baatein yaad rakhna.',
//       '🔍 Critical Thinking: Sach aur jhooth mein antar karna.',
//       '🤝 Understanding: Ek-doosre ko samajhne me madad.',
//     ],
//   },
//   {
//     id: 'counting-mind-game',
//     title: 'The Counting Mind Game (Silent 21)',
//     category: 'mind-memory',
//     emoji: '🔢',
//     description: 'Bina order ke 1 se 21 tak ginti – agar clash ho toh restart.',
//     imageUrl: '/counting_mind.png',
//     howToPlay: [
//       'Sabhi bachche ek circle me khade hote hain.',
//       'Target hai 1 se 21 tak ginti bolna, lekin bina kisi order ke aur bina ek sath bole.',
//       'Agar do bachche ek sath same number bol dein, toh game zero se restart hota hai.',
//       'Game tab tak chalegi jab tak 21 tak pahunch jaaye bina clash ke.',
//     ],
//     benefits: [
//       '👀 Eye Contact: Doosron ko dekhte hue timing pakadna.',
//       '🧘 Patience: Apni baari ka wait karna.',
//       '🤝 Group Coordination: Team synchronization.',
//     ],
//   },
//   {
//     id: 'word-chain',
//     title: 'Word Chain (Antakshari of Words)',
//     category: 'mind-memory',
//     emoji: '🔤',
//     description: 'Last letter se naya word – vocabulary boost!',
//     imageUrl: '/word_chain.png',
//     howToPlay: [
//       'Pehla bachcha koi ek word bolta hai (e.g., "Elephant").',
//       'Agla bachcha last letter ("T") se naya word bolta hai (e.g., "Tiger").',
//       'Isko kisi specific category (jaise Animals, Countries, ya Science terms) par bhi khel sakte hain.',
//       'Jo word na bata paaye ya repeat kare, woh out ho jayega.',
//     ],
//     benefits: [
//       '📚 Vocabulary: Naye words seekhte hain.',
//       '⚡ Instant Recall: Turant word yaad karna.',
//       '🧠 Memory: Word association practice.',
//     ],
//   },
//   {
//     id: 'story-builder',
//     title: 'Story Builder (Ek Shabd Ki Kahani)',
//     category: 'mind-memory',
//     emoji: '📖',
//     description: 'Ek-ek word jod kar funny kahani banayein.',
//     imageUrl: '/story_builder_.png',
//     howToPlay: [
//       'Pehla bachcha ek kahani shuru karta hai sirf ek word bol kar (jaise "Ek").',
//       'Agla bachcha ek aur word jodh deta hai ("Raja").',
//       'Is tarah har bachcha ek-ek word jod kar ek puri funny kahani banata hai.',
//       'Koi bhi word bol sakta hai - funny, serious, ya random!',
//     ],
//     benefits: [
//       '🎨 Creativity: Nayi-nayi kahaniyan sochne ka mauka.',
//       '👂 Active Listening: Doosron ke words ko dhyan se sunna.',
//       '🧠 Instant Imagination: Turant soch kar word bolna.',
//       '🤝 Teamwork: Sab milkar ek kahani banate hain.',
//       '😄 Fun: Hasne-mazak ka mahaul banta hai.',
//     ],
//   },
//   {
//     id: 'memory-tray',
//     title: 'Memory Tray (Dhyan Ka Khel)',
//     category: 'mind-memory',
//     emoji: '🧠',
//     description: 'Floor par 10-12 cheezein dikhakar cover kar dein, fir yaad karke naam batana.',
//     imageUrl: '/pass_action.png',
//     howToPlay: [
//       'Floor par 10-12 alag-alag cheezein rakhein (pen, bottle, book, etc.)',
//       'Bachchon ko 30 second tak sab cheezein yaad karne dein',
//       'Cheezein cover kar dein (kapda ya paper se)',
//       'Bachche ek-ek karke yaad ki gayi cheezon ke naam batayen',
//       'Jo zyada yaad rakhega, woh jeetega',
//     ],
//     benefits: [
//       '🧠 Memory Power: Yaad rakhne ki capacity badhti hai',
//       '👀 Observation: Cheezon ko dhyan se dekhna seekhte hain',
//       '⚡ Focus: Concentration improve hoti hai',
//       '🏆 Competition: Healthy competition ka mahaul',
//     ],
//   },
//   {
//     id: 'back-to-back-drawing',
//     title: 'Back-to-Back Drawing',
//     category: 'mind-memory',
//     emoji: '🎨',
//     description: 'Do bachche peeth mila kar baithenge. Ek instruction dega, doosra bina dekhe draw karega.',
//     imageUrl: '/truth_and_lie.png',
//     howToPlay: [
//       'Do bachche peeth mila kar baithein',
//       'Ek bachche ke paas paper aur pencil ho (drawer)',
//       'Doosra bachcha (instructor) ek simple object describe kare (jaise "ek ghar")',
//       'Drawer bina koi sawaal kiye, sirf instruction sun kar draw kare',
//       'Draw karte waqt instructor apne drawing ko nahi dekh sakta',
//       'Time over hone par dono drawings compare karein',
//     ],
//     benefits: [
//       '👂 Active Listening: Instructions ko dhyan se sunna',
//       '🗣️ Communication: Clear instructions dena seekhte hain',
//       '🎨 Imagination: Bina dekhe object imagine karna',
//       '😄 Fun: End mein funny comparisons',
//     ],
//   },
//   {
//     id: 'zip-zap-zop',
//     title: 'Zip-Zap-Zop',
//     category: 'mind-memory',
//     emoji: '⚡',
//     description: 'Circle me fast speed se ek doosre ki taraf ishara karke "Zip", "Zap", "Zop" bolna.',
//     imageUrl: '/counting_mind.png',
//     howToPlay: [
//       'Ek circle bana kar baithein',
//       'Pehla bachcha kisi ko "Zip" kehte hue ishara karega',
//       'Jis ko "Zip" kaha gaya, woh agle ko "Zap" ishara karega',
//       'Jis ko "Zap" kaha, woh agle ko "Zop" ishara karega',
//       'Is tarah "Zip" → "Zap" → "Zop" ka sequence continue karein',
//       'Koi galat bola toh out ho jayega',
//       'Speed gradually increase karein',
//     ],
//     benefits: [
//       '⚡ Quick Thinking: Fast decision making',
//       '👀 Alertness: Continuous attention required',
//       '🎯 Focus: Distraction avoid karna',
//       '😄 Fun: High energy game',
//     ],
//   },
//   {
//     id: 'mind-reader',
//     title: 'Mind Reader (10 Questions)',
//     category: 'mind-memory',
//     emoji: '🔮',
//     description: 'Ek object soch kar sirf YES/NO questions ke zariye guess karna.',
//     imageUrl: '/word_chain.png',
//     howToPlay: [
//       'Ek bachcha apne mann mein kisi object ke baare mein soche',
//       'Doosre bachche sirf "YES" ya "NO" mein jawab dene wale sawaal puchein',
//       'Total 10 sawaal puche ja sakte hain',
//       'Agar object guess ho gaya toh guesser jeet gaya',
//       'Agar 10 sawaalon mein nahi guess kiya toh thinker jeet gaya',
//       'Example: "Kya yeh object khane ki cheez hai?" → "NO"',
//     ],
//     benefits: [
//       '🧠 Logical Thinking: Sahi sawaal puchna seekhte hain',
//       '🔍 Analytical Skills: Information filter karna',
//       '🗣️ Communication: Effective questioning',
//       '🎯 Patience: 10 questions strategy',
//     ],
//   },
//   {
//     id: 'freeze-dance-poses',
//     title: 'Freeze Dance with Poses',
//     category: 'mind-memory',
//     emoji: '💃',
//     description: 'Music stop hone par specific superhero ya animal pose me freeze hona.',
//     imageUrl: '/story_builder_.png',
//     howToPlay: [
//       'Music bajaana shuru karein',
//       'Bachche dance karein (fast/energetic)',
//       'Music band karte hi ek pose announce karein ("Superman pose" / "Lion pose")',
//       'Bachchon ko turant woh pose banana hai',
//       'Jo late karega ya galat pose banayega, woh out',
//       'Kuch poses: Tiger, Elephant, Superman, Spider-Man, Tree, etc.',
//     ],
//     benefits: [
//       '⚡ Quick Reaction: Instant action and decision',
//       '🎨 Creativity: Different poses sochna',
//       '💪 Body Awareness: Body control and flexibility',
//       '😄 Fun: High energy enjoyment',
//     ],
//   },
//   {
//     id: 'simon-says',
//     title: 'Simon Says (Raja Ka Hukm)',
//     category: 'mind-memory',
//     emoji: '👑',
//     description: 'Command ke aage "Simon says" bole tabhi action karna hai, warna out.',
//     imageUrl: '/pass_action.png',
//     howToPlay: [
//       'Ek bachcha "Simon" banta hai (Leader)',
//       'Simon commands dega, jaise "Simon says... touch your nose"',
//       'Agar command ke aage "Simon says" nahi hai, toh koi action nahi karna',
//       'Jo bina "Simon says" ke action kar le, woh out ho jayega',
//       'Commands fast aur tricky ho sakte hain',
//       'Last tak survive karne wala jeetega',
//     ],
//     benefits: [
//       '👂 Listening Skills: Instruction carefully sunna',
//       '⚡ Impulse Control: Pehle sochna, phir action',
//       '🎯 Focus: Continuous attention required',
//       '😄 Fun: Playful learning',
//     ],
//   },
//   {
//     id: 'categories-rapid-fire',
//     title: 'Categories (Rapid Fire)',
//     category: 'mind-memory',
//     emoji: '🔥',
//     description: 'Ek category (e.g., Fruits) par bina ruke fast-fast naam bolna.',
//     imageUrl: '/truth_and_lie.png',
//     howToPlay: [
//       'Ek category choose karein (Fruits, Animals, Colors, Cities, etc.)',
//       'Circle me baith kar ek-ek karke naam bolte jayen',
//       'Koi bhi naam repeat nahi kar sakta',
//       '3 second se zyada time lagne par woh out ho jayega',
//       'Jo last tak bachega, woh jeetega',
//       'Categories change karte rahein for more challenge',
//     ],
//     benefits: [
//       '⚡ Quick Thinking: Fast recall under pressure',
//       '📚 Knowledge: Vocabulary and awareness',
//       '🧠 Memory: Information retrieval practice',
//       '😄 Fun: Competitive learning',
//     ],
//   },
//   {
//     id: 'odd-one-out',
//     title: 'Odd One Out',
//     category: 'mind-memory',
//     emoji: '🎯',
//     description: 'Teacher 4 words bolegi, bachchon ko instant sabse alag word pehchanna hai.',
//     imageUrl: '/counting_mind.png',
//     howToPlay: [
//       'Teacher 4 words bolegi (jaise: Apple, Banana, Car, Mango)',
//       'Bachchon ko pehchanna hai ki kaunsa word sabse alag hai (Car)',
//       'Jo sabse pehle sahi jawab dega, woh point score karega',
//       '10 rounds ke baad maximum points wala jeetega',
//       'Multiple categories use kar sakte hain (colors, shapes, etc.)',
//     ],
//     benefits: [
//       '🧠 Analytical Thinking: Pattern recognition',
//       '🔍 Observation: Similarities and differences',
//       '⚡ Quick Decision: Instant judgment',
//       '📚 Learning: Concept clarity',
//     ],
//   },
//   {
//     id: 'pattern-clapping',
//     title: 'Pattern Clapping',
//     category: 'mind-memory',
//     emoji: '👏',
//     description: 'Teacher ek rhythm me taali bajaegi, bachchon ko exact follow karna hoga.',
//     imageUrl: '/word_chain.png',
//     howToPlay: [
//       'Teacher ek taali ka pattern bajata hai (jaise: clap-clap-pause-clap)',
//       'Bachchon ko exactly woh pattern repeat karna hai',
//       'Pattern gradually complex hota jayega',
//       'Jo galat karega, woh out ho jayega',
//       'Last tak survive karne wala jeetega',
//     ],
//     benefits: [
//       '👂 Listening Skills: Pattern recognition',
//       '🧠 Memory: Pattern recall',
//       '⚡ Coordination: Hand-eye coordination',
//       '🎯 Focus: Concentration',
//     ],
//   },
//   {
//     id: 'blindfold-navigator',
//     title: 'Blindfold Navigator',
//     category: 'mind-memory',
//     emoji: '🧭',
//     description: 'Ek bachche ki aankh par patti hogi, doosra sirf voice instruction se rasta dikhaega.',
//     imageUrl: '/story_builder_.png',
//     howToPlay: [
//       'Ek bachche ki aankh band kar ke (or patti bandh kar)',
//       'Doosra bachcha (Navigator) instructions dega - "Left", "Right", "Forward", "Back"',
//       'Blindfolded bachcha instructions follow karega',
//       'Ek target point (chair/object) tak pahunchana hai',
//       'Bina touch kiye, sirf voice se guide karna hai',
//       'Time kam se kam lene wali team jeetegi',
//     ],
//     benefits: [
//       '🗣️ Communication: Clear instructions',
//       '👂 Trust: Partner par trust build karna',
//       '🧠 Spatial Awareness: Direction sense',
//       '🤝 Teamwork: Coordination',
//     ],
//   },

//   // ========== PHYSICAL & COORDINATION GAMES (10) ==========
//   {
//     id: 'shadow-catchers',
//     title: 'Shadow Catchers',
//     category: 'physical-coordination',
//     emoji: '🕵️',
//     description: 'Ek doosre ki parchhai (shadow) par pair rakhne wala game.',
//     imageUrl: '/pass_action.png',
//     howToPlay: [
//       'Sunlight wali jagah mein khelein (shadow dikhni chahiye)',
//       'Ek bachcha "Catcher" banta hai',
//       'Catcher doosron ki shadow par pair rakhne ki koshish karega',
//       'Jiski shadow par pair lag gaya, woh new catcher ban jayega',
//       'Bhaagte waqt shadow ko avoid karna hai',
//       'Fast aur energetic game',
//     ],
//     benefits: [
//       '💪 Physical Activity: Running and movement',
//       '⚡ Reflexes: Quick reactions',
//       '🕵️ Awareness: Body and shadow awareness',
//       '😄 Fun: Outdoor enjoyment',
//     ],
//   },
//   {
//     id: 'caterpillar-race',
//     title: 'Caterpillar Race',
//     category: 'physical-coordination',
//     emoji: '🐛',
//     description: 'Team me ek doosre ke shoulder pakad kar bina chain tode bhaagna.',
//     imageUrl: '/truth_and_lie.png',
//     howToPlay: [
//       'Team ke 4-5 members ek line mein khade hon',
//       'Har ek apne aage wale ke shoulders pakad le',
//       'Chain nahi tootna chahiye (caterpillar ki tarah)',
//       'Signal milne par team ek saath race start karegi',
//       'Sabse fast finish line paar karne wali team jeetegi',
//       'Chain tootne par wapas start se shuru karna hoga',
//     ],
//     benefits: [
//       '🤝 Teamwork: Coordination and unity',
//       '💪 Strength: Physical effort',
//       '⚡ Speed: Quick movement',
//       '😂 Fun: Laughter and enjoyment',
//     ],
//   },
//   {
//     id: 'dragons-tail',
//     title: 'The Dragon\'s Tail',
//     category: 'physical-coordination',
//     emoji: '🐉',
//     description: 'Lambi chain me aage wala (Head) sabse peeche wale (Tail) ko pakadne ki koshish karega.',
//     imageUrl: '/counting_mind.png',
//     howToPlay: [
//       '5-6 bachche ek chain banaen (ek doosre ke waist pakad kar)',
//       'Aage wala bachcha "Head" hai, peeche wala "Tail"',
//       'Head ko Tail ko pakadna hai',
//       'Tail ko dodna hai (apne team ko protect karte hue)',
//       'Chain toot nahi sakta',
//       'Tail pakadne par Head wali team jeet gayi',
//     ],
//     benefits: [
//       '🏃 Physical Activity: Running and agility',
//       '🤝 Teamwork: Chain maintain karna',
//       '⚡ Strategy: Movement planning',
//       '😄 Fun: Exciting game',
//     ],
//   },
//   {
//     id: 'fire-in-mountain',
//     title: 'Fire in the Mountain',
//     category: 'physical-coordination',
//     emoji: '⛰️',
//     description: 'Circle me bhaagte hue bola gaya number (Group of 3/4) turant banana.',
//     imageUrl: '/word_chain.png',
//     howToPlay: [
//       'Bachche circle mein bhaag rahe hain',
//       'Teacher/Leader bolega "Fire in the Mountain! Group of 3!"',
//       'Bachchon ko turant 3-3 ke groups banane hain',
//       'Jo group nahi bana paayega, woh out ho jayega',
//       'Number change karte rahein (2, 3, 4, 5...)',
//       'Last tak bachega, woh jeetega',
//     ],
//     benefits: [
//       '⚡ Quick Reaction: Fast grouping',
//       '🧮 Counting: Number sense',
//       '🤝 Teamwork: Quick collaboration',
//       '🏃 Physical: Running and coordination',
//     ],
//   },
//   {
//     id: 'statue-tag',
//     title: 'Statue Tag',
//     category: 'physical-coordination',
//     emoji: '🗿',
//     description: 'Out hone par statue ban jana, jab tak koi teammate touch karke free na kare.',
//     imageUrl: '/story_builder_.png',
//     howToPlay: [
//       'Ek bachcha "Tagger" banta hai',
//       'Tagger doosron ko touch karne ki koshish karega',
//       'Jo bhi touch ho jayega, woh statue ban jayega (freeze)',
//       'Statue ko koi teammate touch karke free kar sakta hai',
//       'Game tab tak chalegi jab tak sab statue na ban jayen',
//       'Last tak bachne wala jeetega',
//     ],
//     benefits: [
//       '🏃 Physical Activity: Running and dodging',
//       '🤝 Teamwork: Helping teammates',
//       '⚡ Strategy: Movement planning',
//       '😂 Fun: Exciting game',
//     ],
//   },
//   {
//     id: 'red-light-green-light',
//     title: 'Red Light, Green Light',
//     category: 'physical-coordination',
//     emoji: '🚦',
//     description: 'Green light par aage badhna, Red light par turant stop hona.',
//     imageUrl: '/pass_action.png',
//     howToPlay: [
//       'Ek bachcha "Traffic Light" banta hai (door khada)',
//       'Baaqi bachche start line par khade hain',
//       'Traffic Light bolega "Green Light!" → sab aage badhenge',
//       '"Red Light!" → turant stop hona hai',
//       'Jo move karega (red light par), woh wapas start line par jayega',
//       'Jo pehle Traffic Light tak pahuncha, woh jeet gaya',
//     ],
//     benefits: [
//       '⚡ Quick Reaction: Instant stop and go',
//       '👂 Listening Skills: Instructions follow karna',
//       '🏃 Physical: Running and control',
//       '🎯 Focus: Attention and discipline',
//     ],
//   },
//   {
//     id: 'duck-duck-goose',
//     title: 'Duck Duck Goose',
//     category: 'physical-coordination',
//     emoji: '🦆',
//     description: 'Circle me baithkar ek bachcha sabke head tap karega aur "Goose" bolte hi race shuru.',
//     imageUrl: '/truth_and_lie.png',
//     howToPlay: [
//       'Bachche circle mein baithte hain',
//       'Ek bachcha "It" banta hai, bahar khada hai',
//       'It circle ke bahar chalega aur sabke head tap karega (Duck, Duck, Duck...)',
//       'Jab "Goose" bolega, toh woh bachcha uth ke It ka peecha karega',
//       'It ko apni seat par pahunch kar baithna hai',
//       'Agar It seat par baith gaya toh Goose new It ban jayega',
//       'Agar Goose ne pakad liya toh It dubara karega',
//     ],
//     benefits: [
//       '🏃 Physical Activity: Running and dodging',
//       '⚡ Quick Reaction: Fast response',
//       '👂 Listening Skills: Attention',
//       '😄 Fun: Popular game',
//     ],
//   },
//   {
//     id: 'locomotive-train',
//     title: 'Locomotive Train',
//     category: 'physical-coordination',
//     emoji: '🚂',
//     description: 'Ek leader ke peeche sabhi train banenge aur leader ke speed/direction changes copy karenge.',
//     imageUrl: '/counting_mind.png',
//     howToPlay: [
//       'Ek leader choose karein (Engine)',
//       'Baaqi bachche leader ke peeche train ki tarah line banayein',
//       'Leader speed change karega (fast/slow)',
//       'Leader direction change karega (left/right)',
//       'Sabhi ko leader ki exact copy karni hai',
//       'Jo bhi chain toda (ya different speed/direction), woh out',
//     ],
//     benefits: [
//       '👂 Listening: Instructions follow',
//       '🤝 Coordination: Team synchronization',
//       '🏃 Physical: Movement and agility',
//       '🎯 Focus: Attention and imitation',
//     ],
//   },
//   {
//     id: 'crab-walk-race',
//     title: 'Crab Walk Race',
//     category: 'physical-coordination',
//     emoji: '🦀',
//     description: 'Haath aur pair par ulta hokar (Crab position) race lagana.',
//     imageUrl: '/word_chain.png',
//     howToPlay: [
//       'Crab position: Haath aur pair zameen par, pet upar (ulta)',
//       'Start signal par sab crab walk karke race karein',
//       'Finish line tak pahunchne wala jeetega',
//       'Relay style: Team ke members ek-ek karke race karein',
//       'Form maintain karna hai (nahi toh restart)',
//     ],
//     benefits: [
//       '💪 Strength: Core and arm strength',
//       '⚡ Coordination: Body coordination',
//       '🏃 Physical: Whole body workout',
//       '😄 Fun: Unusual movement',
//     ],
//   },
//   {
//     id: 'hopscotch-liddo',
//     title: 'Hopscotch (Liddo)',
//     category: 'physical-coordination',
//     emoji: '🏃',
//     description: 'Floor par chalk se boxes bana kar single-leg balance jump karna.',
//     imageUrl: '/story_builder_.png',
//     howToPlay: [
//       'Floor par chalk se boxes ka pattern banaen (1-10 numbers)',
//       'Ek stone/pitcher throw karein (number 1 box par)',
//       'Stone wale box ko chhod kar single leg par saare boxes jump karein',
//       'Double boxes par dono pair se jump karein',
//       'Wapas aate waqt stone uthaen',
//       'Bina balance khoye saare boxes complete karne hain',
//     ],
//     benefits: [
//       '⚡ Balance: Single leg coordination',
//       '💪 Strength: Leg strength',
//       '🧠 Focus: Concentration and counting',
//       '😄 Fun: Classic outdoor game',
//     ],
//   },

//   // ========== TEAMWORK & STRATEGY GAMES (10) ==========
//   {
//     id: 'human-knot',
//     title: 'Human Knot',
//     category: 'teamwork-strategy',
//     emoji: '🪢',
//     description: 'Circle me haath pakad kar bane knot ko bina haath chhode suljhana.',
//     imageUrl: '/pass_action.png',
//     howToPlay: [
//       '8-10 bachche circle mein khade hon',
//       'Saare bachche doosron ke haath pakad lein (crossed)',
//       'Ek complex knot ban jayega',
//       'Bina haath chhode knot ko suljhana hai',
//       'Communication and coordination use karein',
//       'Suljha kar circle bana lein',
//     ],
//     benefits: [
//       '🤝 Teamwork: Collective problem solving',
//       '🗣️ Communication: Verbal and non-verbal',
//       '🧠 Strategy: Planning and execution',
//       '🎯 Patience: Step-by-step approach',
//     ],
//   },
//   {
//     id: 'mirror-mirror',
//     title: 'Mirror Mirror',
//     category: 'teamwork-strategy',
//     emoji: '🪞',
//     description: 'Partner ke bilkul saamne khade hokar uske movement ki exact copy karna.',
//     imageUrl: '/truth_and_lie.png',
//     howToPlay: [
//       'Do bachche pair banaen (face to face)',
//       'Ek bachcha "Leader" banta hai',
//       'Leader slow movements karega (hand raise, turn, etc.)',
//       'Doosra bachcha "Mirror" hai, exact copy karega',
//       '2 minute baad roles swap karein',
//       'Slow aur smooth movements karein',
//     ],
//     benefits: [
//       '👀 Observation: Detail watching',
//       '⚡ Coordination: Body synchronization',
//       '🤝 Trust: Partner connection',
//       '🎯 Focus: Concentrating on partner',
//     ],
//   },
//   {
//     id: 'untangle-web',
//     title: 'Untangle the Web',
//     category: 'teamwork-strategy',
//     emoji: '🕸️',
//     description: 'Ek team doosri team ki body position dekh kar coordination se cross karegi.',
//     imageUrl: '/counting_mind.png',
//     howToPlay: [
//       'Team A complex body positions banaegi (arms crossed, legs twisted)',
//       'Team B observe karegi positions',
//       'Team B ko same positions copy karni hain without touching',
//       'Coordination se cross kar ke exact positions banaen',
//       'Time limit mein kaun sahi banata hai, woh jeetega',
//     ],
//     benefits: [
//       '👀 Observation: Visual memory',
//       '🤝 Teamwork: Coordination',
//       '🧠 Strategy: Planning and execution',
//       '⚡ Precision: Exact movements',
//     ],
//   },
//   {
//     id: 'land-sea-air',
//     title: 'Land, Sea, and Air',
//     category: 'teamwork-strategy',
//     emoji: '🌊',
//     description: 'Line ke aage (Land), peeche (Sea), aur jump (Air) karne ki fast command.',
//     imageUrl: '/word_chain.png',
//     howToPlay: [
//       'Ek line banayein (middle line)',
//       'Leader commands dega: "Land!" (aage jump), "Sea!" (peeche jump), "Air!" (upar jump)',
//       'Bachchon ko command ke hisaab se turant action karna hai',
//       'Jo galat karega, woh out ho jayega',
//       'Speed gradually increase karein',
//     ],
//     benefits: [
//       '⚡ Quick Reaction: Instant response',
//       '👂 Listening Skills: Command recognition',
//       '🏃 Physical: Jumping and movement',
//       '🎯 Focus: Attention and accuracy',
//     ],
//   },
//   {
//     id: 'touch-something-blue',
//     title: 'Touch Something Blue',
//     category: 'teamwork-strategy',
//     emoji: '🔵',
//     description: 'Captain bolega "Touch Blue", sabhi ko room/ground me us color ko touch karna hai.',
//     imageUrl: '/story_builder_.png',
//     howToPlay: [
//       'Leader/Captain ek color bolega (Red, Blue, Green, etc.)',
//       'Bachchon ko turant us color ki cheez ko touch karna hai',
//       'Jo sabse pehle touch karega, woh point score karega',
//       'Jo 5 second mein nahi touch kar paaya, woh out',
//       'Colors change karte rahein',
//     ],
//     benefits: [
//       '👀 Observation: Color recognition',
//       '⚡ Quick Reaction: Fast response',
//       '🏃 Physical: Running and movement',
//       '🎯 Focus: Attention and speed',
//     ],
//   },
//   {
//     id: 'steal-rooster',
//     title: 'Steal the Rooster',
//     category: 'teamwork-strategy',
//     emoji: '🐓',
//     description: 'Do teams me se ek-ek member aakar center se point score karne ki koshish karega.',
//     imageUrl: '/pass_action.png',
//     howToPlay: [
//       'Do teams banaen',
//       'Center mein ek object rakhein (Rooster/Flag)',
//       'Har team se ek-ek player center ki taraf bhaagega',
//       'Center object le kar wapas apni team ke side pahunchana hai',
//       'Doosri team ka player object chura sakta hai',
//       'Maximum points wali team jeetegi',
//     ],
//     benefits: [
//       '⚡ Strategy: Attack and defense planning',
//       '🤝 Teamwork: Coordination',
//       '🏃 Physical: Running and agility',
//       '😄 Fun: Competitive excitement',
//     ],
//   },
//   {
//     id: 'pass-high-five',
//     title: 'Pass the High Five',
//     category: 'teamwork-strategy',
//     emoji: '✋',
//     description: 'Line me bina bole fast high-five pass karna.',
//     imageUrl: '/truth_and_lie.png',
//     howToPlay: [
//       'Bachche line mein khade hon',
//       'Pehla bachcha next ko high-five karega',
//       'High-five chain reaction ki tarah aage badhti hai',
//       'Koi bhi verbal communication nahi karna',
//       'Chain jaldi-jaaldi complete karni hai',
//       'Time kam se kam lene wali team jeetegi',
//     ],
//     benefits: [
//       '⚡ Speed: Fast coordination',
//       '🤝 Teamwork: Non-verbal communication',
//       '👀 Observation: Anticipating turn',
//       '🎯 Focus: Attention and timing',
//     ],
//   },
//   {
//     id: 'ruler-kingdom',
//     title: 'Ruler of the Kingdom',
//     category: 'teamwork-strategy',
//     emoji: '👑',
//     description: 'Action banakar pure group se follow karwana bina pakde gaye.',
//     imageUrl: '/counting_mind.png',
//     howToPlay: [
//       'Ek bachcha "Ruler" banta hai',
//       'Ruler koi action karega (dance move, hand movement, etc.)',
//       'Sabhi ko Ruler ki copy karni hai',
//       'Ruler action change karta rahega',
//       'Jo pakda gaya (galat copy), woh out',
//       'Secret signal use karein for change',
//     ],
//     benefits: [
//       '👀 Observation: Detail watching',
//       '🎨 Creativity: Different actions',
//       '🤝 Teamwork: Following leader',
//       '😄 Fun: Playful game',
//     ],
//   },
//   {
//     id: 'silent-lineup',
//     title: 'Silent Line-up',
//     category: 'teamwork-strategy',
//     emoji: '🤫',
//     description: 'Bina bole sirf gestures se height ya birth month ke hisaab se line banana.',
//     imageUrl: '/word_chain.png',
//     howToPlay: [
//       'Bachchon ko kisi bhi kram mein khada karein',
//       'Unhe bina bole (silent) kisi order mein khada hona hai',
//       'Examples: Height (shortest to tallest), Birth month (Jan to Dec)',
//       'Sirf gestures, actions, signs use kar sakte hain',
//       'Jaldi-sahi order banane wali team jeetegi',
//       'Coordination and observation use karein',
//     ],
//     benefits: [
//       '🗣️ Non-verbal Communication: Gestures and signs',
//       '🤝 Teamwork: Silent coordination',
//       '🧠 Strategy: Planning without words',
//       '👀 Observation: Body language reading',
//     ],
//   },
//   {
//     id: 'group-balance',
//     title: 'Group Balance Challenge',
//     category: 'teamwork-strategy',
//     emoji: '⚖️',
//     description: 'Pure group ko ek sath single leg par 10 seconds tak balance karna.',
//     imageUrl: '/story_builder_.png',
//     howToPlay: [
//       'Pure group ek sath single leg par khada ho',
//       '10 second countdown shuru karein',
//       'Kisi ko bhi doosra pair zameen par nahi rakhna',
//       'Haath pakad kar balance maintain karein',
//       'Group effort se 10 seconds complete karein',
//       'Har baar time increase karte jayein (15, 20, 30 sec)',
//     ],
//     benefits: [
//       '🤝 Teamwork: Collective effort',
//       '⚖️ Balance: Group coordination',
//       '💪 Strength: Core and leg strength',
//       '🎯 Focus: Concentration and unity',
//     ],
//   },
// ];

// // ----- Main Component -----
// const GameLibrary: React.FC = () => {
//   const [selectedGame, setSelectedGame] = useState<Game | null>(null);

//   // Close modal
//   const closeModal = () => setSelectedGame(null);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-3">
//             <span>🎮</span> Game Library
//             <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
//               {gamesData.length} Games
//             </span>
//           </h1>
//           <p className="text-gray-400 mt-2">Fun games for kids - Mind & Memory</p>
//         </div>

//         {/* Games Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
//           {gamesData.map((game) => (
//             <div
//               key={game.id}
//               onClick={() => setSelectedGame(game)}
//               className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
//             >
//               {/* Image */}
//               <div className="h-40 overflow-hidden bg-gray-800/50 flex items-center justify-center">
//                 <img
//                   src={game.imageUrl}
//                   alt={game.title}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     // Fallback if image fails to load
//                     (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%234b5563"/><text x="50" y="55" font-size="40" text-anchor="middle" fill="%23ffffff">${game.emoji}</text></svg>`;
//                   }}
//                 />
//               </div>
//               {/* Content */}
//               <div className="p-4">
//                 <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{game.title}</h3>
//                 <p className="text-gray-400 text-xs line-clamp-2">{game.description}</p>
//                 <div className="mt-2 text-blue-400 text-xs font-medium flex items-center gap-1">
//                   <span>Click to explore</span>
//                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ===== MODAL ===== */}
//      {/* ===== MODAL ===== */}
// {selectedGame && (
//   <div
//     className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
//     onClick={closeModal}
//   >
//     <div
//       className="bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-3xl 
//                  w-full max-w-3xl max-h-[95vh] overflow-y-auto 
//                  border border-white/10 shadow-2xl shadow-blue-500/20"
//       onClick={(e) => e.stopPropagation()}
//     >

//       {/* ===== HEADER ===== */}
//       <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-xl 
//                       px-5 sm:px-7 py-4 border-b border-white/10 
//                       flex justify-between items-center">

//         <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
//           <span className="text-2xl sm:text-3xl">
//             {selectedGame.emoji}
//           </span>

//           <span className="line-clamp-2">
//             {selectedGame.title}
//           </span>
//         </h2>

//         <button
//           onClick={closeModal}
//           className="flex-shrink-0 ml-3 text-gray-400 hover:text-white 
//                      bg-white/5 hover:bg-red-500/20 
//                      p-2 rounded-full transition-all duration-200"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//       </div>

//       {/* ===== MODAL BODY ===== */}
//       <div className="p-4 sm:p-6 md:p-7 space-y-6">

//         {/* ===== GAME IMAGE ===== */}
//         <div
//           className="relative w-full overflow-hidden rounded-2xl 
//                      border border-white/10 bg-black/30 
//                      shadow-xl"
//         >
//           <img
//             src={selectedGame.imageUrl}
//             alt={selectedGame.title}
//             className="
//               w-full
//               h-auto
//               max-h-[420px]
//               sm:max-h-[480px]
//               object-cover
//               transition-transform duration-500
//               hover:scale-[1.02]
//             "
//             onError={(e) => {
//               (e.target as HTMLImageElement).src =
//                 `data:image/svg+xml,
//                 <svg xmlns="http://www.w3.org/2000/svg"
//                 width="600" height="400"
//                 viewBox="0 0 600 400">
//                 <rect width="600" height="400" fill="%231f2937"/>
//                 <text x="300" y="220"
//                 font-size="100"
//                 text-anchor="middle"
//                 fill="white">
//                 ${selectedGame.emoji}
//                 </text>
//                 </svg>`;
//             }}
//           />

//           {/* Image overlay */}
//           <div className="absolute inset-x-0 bottom-0 h-20 
//                           bg-gradient-to-t from-black/60 to-transparent 
//                           pointer-events-none" />
//         </div>


//         {/* ===== DESCRIPTION ===== */}
//         <div
//           className="bg-white/5 border border-white/10 
//                      rounded-2xl p-4 sm:p-5"
//         >
//           <h3 className="text-yellow-400 font-bold text-lg mb-2 flex items-center gap-2">
//             <span>🎮</span>
//             Game Ke Baare Mein
//           </h3>

//           <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
//             {selectedGame.description}
//           </p>
//         </div>


//         {/* ===== HOW TO PLAY ===== */}
//         <div
//           className="bg-blue-500/5 border border-blue-400/10 
//                      rounded-2xl p-4 sm:p-5"
//         >
//           <h3 className="text-blue-400 font-bold text-lg mb-4 flex items-center gap-2">
//             <span>🎯</span>
//             Kaise Khelte Hain?
//           </h3>

//           <ol className="space-y-3">
//             {selectedGame.howToPlay.map((step, idx) => (
//               <li
//                 key={idx}
//                 className="flex items-start gap-3 
//                            bg-white/5 rounded-xl p-3 
//                            hover:bg-white/10 transition"
//               >
//                 <span
//                   className="flex-shrink-0 w-7 h-7 
//                              rounded-full bg-blue-500 
//                              text-white text-sm font-bold 
//                              flex items-center justify-center"
//                 >
//                   {idx + 1}
//                 </span>

//                 <span className="text-gray-300 text-sm sm:text-base leading-relaxed pt-0.5">
//                   {step}
//                 </span>
//               </li>
//             ))}
//           </ol>
//         </div>


//         {/* ===== BENEFITS ===== */}
//         <div
//           className="bg-green-500/5 border border-green-400/10 
//                      rounded-2xl p-4 sm:p-5"
//         >
//           <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
//             <span>✨</span>
//             Benefits
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {selectedGame.benefits.map((benefit, idx) => (
//               <div
//                 key={idx}
//                 className="flex items-start gap-3 
//                            bg-white/5 rounded-xl p-3 
//                            hover:bg-white/10 transition"
//               >
//                 <span
//                   className="flex-shrink-0 w-7 h-7 
//                              rounded-full bg-green-500/20 
//                              text-green-400 
//                              flex items-center justify-center"
//                 >
//                   ✓
//                 </span>

//                 <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
//                   {benefit}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>


//         {/* ===== CLOSE BUTTON ===== */}
//         <button
//           onClick={closeModal}
//           className="w-full py-3 rounded-xl 
//                      bg-gradient-to-r from-blue-600 to-indigo-600
//                      hover:from-blue-500 hover:to-indigo-500
//                      text-white font-semibold
//                      transition-all duration-300
//                      shadow-lg shadow-blue-500/20"
//         >
//           🎮 Game Samajh Gaya — Let's Play!
//         </button>

//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default GameLibrary;




import React, { useState } from 'react';

// ----- Types -----
interface Game {
  id: string;
  title: string;
  category: 'mind-memory' | 'physical-coordination' | 'teamwork-strategy';
  emoji: string;
  description: string;
  howToPlay: string[];
  benefits: string[];
  imageUrl: string;
}

// ----- Game Data (30 Games) -----
const gamesData: Game[] = [
  // ========== MIND & MEMORY GAMES (10) ==========
  {
    id: 'pass-the-action',
    title: 'Pass the Action (Silent Charades Loop)',
    category: 'mind-memory',
    emoji: '🎭',
    description: 'Line me action pass karo aur last wala guess kare.',
    imageUrl: '/pass_action.png',
    howToPlay: [
      'Sabhi bachche ek line me ek taraf peeth karke khade hote hain.',
      'Pehla bachcha doosre bachche ko tap karta hai aur bina bole ek action (jaise monkey, swimming, chef cooking) karke dikhata hai.',
      'Doosra bachcha teesre ko wahi action pass karta hai.',
      'Last wala bachcha guess karta hai ki original action kya tha.',
    ],
    benefits: [
      '👀 Focus: Attention span improve hota hai.',
      '🔍 Observation Powers: Details notice karna seekhte hain.',
      '🤝 Non-verbal Communication: Bina bole express karna seekhte hain.',
    ],
  },
  {
    id: 'two-truths-lie',
    title: 'Two Truths and a Lie (Sach ya Jhooth)',
    category: 'mind-memory',
    emoji: '🧐',
    description: 'Do sach aur ek jhooth – baki ko pehchanna hai.',
    imageUrl: '/truth_and_lie.png',
    howToPlay: [
      'Ek-ek karke bachcha apne baare me 3 baatein bolta hai—2 sach aur 1 jhooth.',
      'Baki sabhi bachchon ko guess karna hota hai ki kaun si baat jhooth hai.',
      'Har bachche ki baari aani chahiye.',
      'Sahi guess karne wala point score karta hai.',
    ],
    benefits: [
      '🧠 Memory Power: Doosron ki baatein yaad rakhna.',
      '🔍 Critical Thinking: Sach aur jhooth mein antar karna.',
      '🤝 Understanding: Ek-doosre ko samajhne me madad.',
    ],
  },
  {
    id: 'counting-mind-game',
    title: 'The Counting Mind Game (Silent 21)',
    category: 'mind-memory',
    emoji: '🔢',
    description: 'Bina order ke 1 se 21 tak ginti – agar clash ho toh restart.',
    imageUrl: '/counting_mind.png',
    howToPlay: [
      'Sabhi bachche ek circle me khade hote hain.',
      'Target hai 1 se 21 tak ginti bolna, lekin bina kisi order ke aur bina ek sath bole.',
      'Agar do bachche ek sath same number bol dein, toh game zero se restart hota hai.',
      'Game tab tak chalegi jab tak 21 tak pahunch jaaye bina clash ke.',
    ],
    benefits: [
      '👀 Eye Contact: Doosron ko dekhte hue timing pakadna.',
      '🧘 Patience: Apni baari ka wait karna.',
      '🤝 Group Coordination: Team synchronization.',
    ],
  },
  {
    id: 'word-chain',
    title: 'Word Chain (Antakshari of Words)',
    category: 'mind-memory',
    emoji: '🔤',
    description: 'Last letter se naya word – vocabulary boost!',
    imageUrl: '/word_chain.png',
    howToPlay: [
      'Pehla bachcha koi ek word bolta hai (e.g., "Elephant").',
      'Agla bachcha last letter ("T") se naya word bolta hai (e.g., "Tiger").',
      'Isko kisi specific category (jaise Animals, Countries, ya Science terms) par bhi khel sakte hain.',
      'Jo word na bata paaye ya repeat kare, woh out ho jayega.',
    ],
    benefits: [
      '📚 Vocabulary: Naye words seekhte hain.',
      '⚡ Instant Recall: Turant word yaad karna.',
      '🧠 Memory: Word association practice.',
    ],
  },
  {
    id: 'story-builder',
    title: 'Story Builder (Ek Shabd Ki Kahani)',
    category: 'mind-memory',
    emoji: '📖',
    description: 'Ek-ek word jod kar funny kahani banayein.',
    imageUrl: '/story_builder_.png',
    howToPlay: [
      'Pehla bachcha ek kahani shuru karta hai sirf ek word bol kar (jaise "Ek").',
      'Agla bachcha ek aur word jodh deta hai ("Raja").',
      'Is tarah har bachcha ek-ek word jod kar ek puri funny kahani banata hai.',
      'Koi bhi word bol sakta hai - funny, serious, ya random!',
    ],
    benefits: [
      '🎨 Creativity: Nayi-nayi kahaniyan sochne ka mauka.',
      '👂 Active Listening: Doosron ke words ko dhyan se sunna.',
      '🧠 Instant Imagination: Turant soch kar word bolna.',
      '🤝 Teamwork: Sab milkar ek kahani banate hain.',
      '😄 Fun: Hasne-mazak ka mahaul banta hai.',
    ],
  },
  {
    id: 'memory-tray',
    title: 'Memory Tray (Dhyan Ka Khel)',
    category: 'mind-memory',
    emoji: '🧠',
    description: 'Floor par 10-12 cheezein dikhakar cover kar dein, fir yaad karke naam batana.',
    imageUrl: '/pass_action.png',
    howToPlay: [
      'Floor par 10-12 alag-alag cheezein rakhein (pen, bottle, book, etc.)',
      'Bachchon ko 30 second tak sab cheezein yaad karne dein',
      'Cheezein cover kar dein (kapda ya paper se)',
      'Bachche ek-ek karke yaad ki gayi cheezon ke naam batayen',
      'Jo zyada yaad rakhega, woh jeetega',
    ],
    benefits: [
      '🧠 Memory Power: Yaad rakhne ki capacity badhti hai',
      '👀 Observation: Cheezon ko dhyan se dekhna seekhte hain',
      '⚡ Focus: Concentration improve hoti hai',
      '🏆 Competition: Healthy competition ka mahaul',
    ],
  },
  {
    id: 'back-to-back-drawing',
    title: 'Back-to-Back Drawing',
    category: 'mind-memory',
    emoji: '🎨',
    description: 'Do bachche peeth mila kar baithenge. Ek instruction dega, doosra bina dekhe draw karega.',
    imageUrl: '/truth_and_lie.png',
    howToPlay: [
      'Do bachche peeth mila kar baithein',
      'Ek bachche ke paas paper aur pencil ho (drawer)',
      'Doosra bachcha (instructor) ek simple object describe kare (jaise "ek ghar")',
      'Drawer bina koi sawaal kiye, sirf instruction sun kar draw kare',
      'Draw karte waqt instructor apne drawing ko nahi dekh sakta',
      'Time over hone par dono drawings compare karein',
    ],
    benefits: [
      '👂 Active Listening: Instructions ko dhyan se sunna',
      '🗣️ Communication: Clear instructions dena seekhte hain',
      '🎨 Imagination: Bina dekhe object imagine karna',
      '😄 Fun: End mein funny comparisons',
    ],
  },
  {
    id: 'zip-zap-zop',
    title: 'Zip-Zap-Zop',
    category: 'mind-memory',
    emoji: '⚡',
    description: 'Circle me fast speed se ek doosre ki taraf ishara karke "Zip", "Zap", "Zop" bolna.',
    imageUrl: '/counting_mind.png',
    howToPlay: [
      'Ek circle bana kar baithein',
      'Pehla bachcha kisi ko "Zip" kehte hue ishara karega',
      'Jis ko "Zip" kaha gaya, woh agle ko "Zap" ishara karega',
      'Jis ko "Zap" kaha, woh agle ko "Zop" ishara karega',
      'Is tarah "Zip" → "Zap" → "Zop" ka sequence continue karein',
      'Koi galat bola toh out ho jayega',
      'Speed gradually increase karein',
    ],
    benefits: [
      '⚡ Quick Thinking: Fast decision making',
      '👀 Alertness: Continuous attention required',
      '🎯 Focus: Distraction avoid karna',
      '😄 Fun: High energy game',
    ],
  },
  {
    id: 'mind-reader',
    title: 'Mind Reader (10 Questions)',
    category: 'mind-memory',
    emoji: '🔮',
    description: 'Ek object soch kar sirf YES/NO questions ke zariye guess karna.',
    imageUrl: '/word_chain.png',
    howToPlay: [
      'Ek bachcha apne mann mein kisi object ke baare mein soche',
      'Doosre bachche sirf "YES" ya "NO" mein jawab dene wale sawaal puchein',
      'Total 10 sawaal puche ja sakte hain',
      'Agar object guess ho gaya toh guesser jeet gaya',
      'Agar 10 sawaalon mein nahi guess kiya toh thinker jeet gaya',
      'Example: "Kya yeh object khane ki cheez hai?" → "NO"',
    ],
    benefits: [
      '🧠 Logical Thinking: Sahi sawaal puchna seekhte hain',
      '🔍 Analytical Skills: Information filter karna',
      '🗣️ Communication: Effective questioning',
      '🎯 Patience: 10 questions strategy',
    ],
  },
  {
    id: 'freeze-dance-poses',
    title: 'Freeze Dance with Poses',
    category: 'mind-memory',
    emoji: '💃',
    description: 'Music stop hone par specific superhero ya animal pose me freeze hona.',
    imageUrl: '/story_builder_.png',
    howToPlay: [
      'Music bajaana shuru karein',
      'Bachche dance karein (fast/energetic)',
      'Music band karte hi ek pose announce karein ("Superman pose" / "Lion pose")',
      'Bachchon ko turant woh pose banana hai',
      'Jo late karega ya galat pose banayega, woh out',
      'Kuch poses: Tiger, Elephant, Superman, Spider-Man, Tree, etc.',
    ],
    benefits: [
      '⚡ Quick Reaction: Instant action and decision',
      '🎨 Creativity: Different poses sochna',
      '💪 Body Awareness: Body control and flexibility',
      '😄 Fun: High energy enjoyment',
    ],
  },
  {
    id: 'simon-says',
    title: 'Simon Says (Raja Ka Hukm)',
    category: 'mind-memory',
    emoji: '👑',
    description: 'Command ke aage "Simon says" bole tabhi action karna hai, warna out.',
    imageUrl: '/pass_action.png',
    howToPlay: [
      'Ek bachcha "Simon" banta hai (Leader)',
      'Simon commands dega, jaise "Simon says... touch your nose"',
      'Agar command ke aage "Simon says" nahi hai, toh koi action nahi karna',
      'Jo bina "Simon says" ke action kar le, woh out ho jayega',
      'Commands fast aur tricky ho sakte hain',
      'Last tak survive karne wala jeetega',
    ],
    benefits: [
      '👂 Listening Skills: Instruction carefully sunna',
      '⚡ Impulse Control: Pehle sochna, phir action',
      '🎯 Focus: Continuous attention required',
      '😄 Fun: Playful learning',
    ],
  },
  {
    id: 'categories-rapid-fire',
    title: 'Categories (Rapid Fire)',
    category: 'mind-memory',
    emoji: '🔥',
    description: 'Ek category (e.g., Fruits) par bina ruke fast-fast naam bolna.',
    imageUrl: '/truth_and_lie.png',
    howToPlay: [
      'Ek category choose karein (Fruits, Animals, Colors, Cities, etc.)',
      'Circle me baith kar ek-ek karke naam bolte jayen',
      'Koi bhi naam repeat nahi kar sakta',
      '3 second se zyada time lagne par woh out ho jayega',
      'Jo last tak bachega, woh jeetega',
      'Categories change karte rahein for more challenge',
    ],
    benefits: [
      '⚡ Quick Thinking: Fast recall under pressure',
      '📚 Knowledge: Vocabulary and awareness',
      '🧠 Memory: Information retrieval practice',
      '😄 Fun: Competitive learning',
    ],
  },
  {
    id: 'odd-one-out',
    title: 'Odd One Out',
    category: 'mind-memory',
    emoji: '🎯',
    description: 'Teacher 4 words bolegi, bachchon ko instant sabse alag word pehchanna hai.',
    imageUrl: '/counting_mind.png',
    howToPlay: [
      'Teacher 4 words bolegi (jaise: Apple, Banana, Car, Mango)',
      'Bachchon ko pehchanna hai ki kaunsa word sabse alag hai (Car)',
      'Jo sabse pehle sahi jawab dega, woh point score karega',
      '10 rounds ke baad maximum points wala jeetega',
      'Multiple categories use kar sakte hain (colors, shapes, etc.)',
    ],
    benefits: [
      '🧠 Analytical Thinking: Pattern recognition',
      '🔍 Observation: Similarities and differences',
      '⚡ Quick Decision: Instant judgment',
      '📚 Learning: Concept clarity',
    ],
  },
  {
    id: 'pattern-clapping',
    title: 'Pattern Clapping',
    category: 'mind-memory',
    emoji: '👏',
    description: 'Teacher ek rhythm me taali bajaegi, bachchon ko exact follow karna hoga.',
    imageUrl: '/word_chain.png',
    howToPlay: [
      'Teacher ek taali ka pattern bajata hai (jaise: clap-clap-pause-clap)',
      'Bachchon ko exactly woh pattern repeat karna hai',
      'Pattern gradually complex hota jayega',
      'Jo galat karega, woh out ho jayega',
      'Last tak survive karne wala jeetega',
    ],
    benefits: [
      '👂 Listening Skills: Pattern recognition',
      '🧠 Memory: Pattern recall',
      '⚡ Coordination: Hand-eye coordination',
      '🎯 Focus: Concentration',
    ],
  },
  {
    id: 'blindfold-navigator',
    title: 'Blindfold Navigator',
    category: 'mind-memory',
    emoji: '🧭',
    description: 'Ek bachche ki aankh par patti hogi, doosra sirf voice instruction se rasta dikhaega.',
    imageUrl: '/story_builder_.png',
    howToPlay: [
      'Ek bachche ki aankh band kar ke (or patti bandh kar)',
      'Doosra bachcha (Navigator) instructions dega - "Left", "Right", "Forward", "Back"',
      'Blindfolded bachcha instructions follow karega',
      'Ek target point (chair/object) tak pahunchana hai',
      'Bina touch kiye, sirf voice se guide karna hai',
      'Time kam se kam lene wali team jeetegi',
    ],
    benefits: [
      '🗣️ Communication: Clear instructions',
      '👂 Trust: Partner par trust build karna',
      '🧠 Spatial Awareness: Direction sense',
      '🤝 Teamwork: Coordination',
    ],
  },

  // ========== PHYSICAL & COORDINATION GAMES (10) ==========
  {
    id: 'shadow-catchers',
    title: 'Shadow Catchers',
    category: 'physical-coordination',
    emoji: '🕵️',
    description: 'Ek doosre ki parchhai (shadow) par pair rakhne wala game.',
    imageUrl: '/pass_action.png',
    howToPlay: [
      'Sunlight wali jagah mein khelein (shadow dikhni chahiye)',
      'Ek bachcha "Catcher" banta hai',
      'Catcher doosron ki shadow par pair rakhne ki koshish karega',
      'Jiski shadow par pair lag gaya, woh new catcher ban jayega',
      'Bhaagte waqt shadow ko avoid karna hai',
      'Fast aur energetic game',
    ],
    benefits: [
      '💪 Physical Activity: Running and movement',
      '⚡ Reflexes: Quick reactions',
      '🕵️ Awareness: Body and shadow awareness',
      '😄 Fun: Outdoor enjoyment',
    ],
  },
  {
    id: 'caterpillar-race',
    title: 'Caterpillar Race',
    category: 'physical-coordination',
    emoji: '🐛',
    description: 'Team me ek doosre ke shoulder pakad kar bina chain tode bhaagna.',
    imageUrl: '/truth_and_lie.png',
    howToPlay: [
      'Team ke 4-5 members ek line mein khade hon',
      'Har ek apne aage wale ke shoulders pakad le',
      'Chain nahi tootna chahiye (caterpillar ki tarah)',
      'Signal milne par team ek saath race start karegi',
      'Sabse fast finish line paar karne wali team jeetegi',
      'Chain tootne par wapas start se shuru karna hoga',
    ],
    benefits: [
      '🤝 Teamwork: Coordination and unity',
      '💪 Strength: Physical effort',
      '⚡ Speed: Quick movement',
      '😂 Fun: Laughter and enjoyment',
    ],
  },
  {
    id: 'dragons-tail',
    title: 'The Dragon\'s Tail',
    category: 'physical-coordination',
    emoji: '🐉',
    description: 'Lambi chain me aage wala (Head) sabse peeche wale (Tail) ko pakadne ki koshish karega.',
    imageUrl: '/counting_mind.png',
    howToPlay: [
      '5-6 bachche ek chain banaen (ek doosre ke waist pakad kar)',
      'Aage wala bachcha "Head" hai, peeche wala "Tail"',
      'Head ko Tail ko pakadna hai',
      'Tail ko dodna hai (apne team ko protect karte hue)',
      'Chain toot nahi sakta',
      'Tail pakadne par Head wali team jeet gayi',
    ],
    benefits: [
      '🏃 Physical Activity: Running and agility',
      '🤝 Teamwork: Chain maintain karna',
      '⚡ Strategy: Movement planning',
      '😄 Fun: Exciting game',
    ],
  },
  {
    id: 'fire-in-mountain',
    title: 'Fire in the Mountain',
    category: 'physical-coordination',
    emoji: '⛰️',
    description: 'Circle me bhaagte hue bola gaya number (Group of 3/4) turant banana.',
    imageUrl: '/word_chain.png',
    howToPlay: [
      'Bachche circle mein bhaag rahe hain',
      'Teacher/Leader bolega "Fire in the Mountain! Group of 3!"',
      'Bachchon ko turant 3-3 ke groups banane hain',
      'Jo group nahi bana paayega, woh out ho jayega',
      'Number change karte rahein (2, 3, 4, 5...)',
      'Last tak bachega, woh jeetega',
    ],
    benefits: [
      '⚡ Quick Reaction: Fast grouping',
      '🧮 Counting: Number sense',
      '🤝 Teamwork: Quick collaboration',
      '🏃 Physical: Running and coordination',
    ],
  },
  {
    id: 'statue-tag',
    title: 'Statue Tag',
    category: 'physical-coordination',
    emoji: '🗿',
    description: 'Out hone par statue ban jana, jab tak koi teammate touch karke free na kare.',
    imageUrl: '/story_builder_.png',
    howToPlay: [
      'Ek bachcha "Tagger" banta hai',
      'Tagger doosron ko touch karne ki koshish karega',
      'Jo bhi touch ho jayega, woh statue ban jayega (freeze)',
      'Statue ko koi teammate touch karke free kar sakta hai',
      'Game tab tak chalegi jab tak sab statue na ban jayen',
      'Last tak bachne wala jeetega',
    ],
    benefits: [
      '🏃 Physical Activity: Running and dodging',
      '🤝 Teamwork: Helping teammates',
      '⚡ Strategy: Movement planning',
      '😂 Fun: Exciting game',
    ],
  },
  {
    id: 'red-light-green-light',
    title: 'Red Light, Green Light',
    category: 'physical-coordination',
    emoji: '🚦',
    description: 'Green light par aage badhna, Red light par turant stop hona.',
    imageUrl: '/pass_action.png',
    howToPlay: [
      'Ek bachcha "Traffic Light" banta hai (door khada)',
      'Baaqi bachche start line par khade hain',
      'Traffic Light bolega "Green Light!" → sab aage badhenge',
      '"Red Light!" → turant stop hona hai',
      'Jo move karega (red light par), woh wapas start line par jayega',
      'Jo pehle Traffic Light tak pahuncha, woh jeet gaya',
    ],
    benefits: [
      '⚡ Quick Reaction: Instant stop and go',
      '👂 Listening Skills: Instructions follow karna',
      '🏃 Physical: Running and control',
      '🎯 Focus: Attention and discipline',
    ],
  },
  {
    id: 'duck-duck-goose',
    title: 'Duck Duck Goose',
    category: 'physical-coordination',
    emoji: '🦆',
    description: 'Circle me baithkar ek bachcha sabke head tap karega aur "Goose" bolte hi race shuru.',
    imageUrl: '/truth_and_lie.png',
    howToPlay: [
      'Bachche circle mein baithte hain',
      'Ek bachcha "It" banta hai, bahar khada hai',
      'It circle ke bahar chalega aur sabke head tap karega (Duck, Duck, Duck...)',
      'Jab "Goose" bolega, toh woh bachcha uth ke It ka peecha karega',
      'It ko apni seat par pahunch kar baithna hai',
      'Agar It seat par baith gaya toh Goose new It ban jayega',
      'Agar Goose ne pakad liya toh It dubara karega',
    ],
    benefits: [
      '🏃 Physical Activity: Running and dodging',
      '⚡ Quick Reaction: Fast response',
      '👂 Listening Skills: Attention',
      '😄 Fun: Popular game',
    ],
  },
  {
    id: 'locomotive-train',
    title: 'Locomotive Train',
    category: 'physical-coordination',
    emoji: '🚂',
    description: 'Ek leader ke peeche sabhi train banenge aur leader ke speed/direction changes copy karenge.',
    imageUrl: '/counting_mind.png',
    howToPlay: [
      'Ek leader choose karein (Engine)',
      'Baaqi bachche leader ke peeche train ki tarah line banayein',
      'Leader speed change karega (fast/slow)',
      'Leader direction change karega (left/right)',
      'Sabhi ko leader ki exact copy karni hai',
      'Jo bhi chain toda (ya different speed/direction), woh out',
    ],
    benefits: [
      '👂 Listening: Instructions follow',
      '🤝 Coordination: Team synchronization',
      '🏃 Physical: Movement and agility',
      '🎯 Focus: Attention and imitation',
    ],
  },
  {
    id: 'crab-walk-race',
    title: 'Crab Walk Race',
    category: 'physical-coordination',
    emoji: '🦀',
    description: 'Haath aur pair par ulta hokar (Crab position) race lagana.',
    imageUrl: '/word_chain.png',
    howToPlay: [
      'Crab position: Haath aur pair zameen par, pet upar (ulta)',
      'Start signal par sab crab walk karke race karein',
      'Finish line tak pahunchne wala jeetega',
      'Relay style: Team ke members ek-ek karke race karein',
      'Form maintain karna hai (nahi toh restart)',
    ],
    benefits: [
      '💪 Strength: Core and arm strength',
      '⚡ Coordination: Body coordination',
      '🏃 Physical: Whole body workout',
      '😄 Fun: Unusual movement',
    ],
  },
  {
    id: 'hopscotch-liddo',
    title: 'Hopscotch (Liddo)',
    category: 'physical-coordination',
    emoji: '🏃',
    description: 'Floor par chalk se boxes bana kar single-leg balance jump karna.',
    imageUrl: '/story_builder_.png',
    howToPlay: [
      'Floor par chalk se boxes ka pattern banaen (1-10 numbers)',
      'Ek stone/pitcher throw karein (number 1 box par)',
      'Stone wale box ko chhod kar single leg par saare boxes jump karein',
      'Double boxes par dono pair se jump karein',
      'Wapas aate waqt stone uthaen',
      'Bina balance khoye saare boxes complete karne hain',
    ],
    benefits: [
      '⚡ Balance: Single leg coordination',
      '💪 Strength: Leg strength',
      '🧠 Focus: Concentration and counting',
      '😄 Fun: Classic outdoor game',
    ],
  },

  // ========== TEAMWORK & STRATEGY GAMES (10) ==========
  {
    id: 'human-knot',
    title: 'Human Knot',
    category: 'teamwork-strategy',
    emoji: '🪢',
    description: 'Circle me haath pakad kar bane knot ko bina haath chhode suljhana.',
    imageUrl: '/pass_action.png',
    howToPlay: [
      '8-10 bachche circle mein khade hon',
      'Saare bachche doosron ke haath pakad lein (crossed)',
      'Ek complex knot ban jayega',
      'Bina haath chhode knot ko suljhana hai',
      'Communication and coordination use karein',
      'Suljha kar circle bana lein',
    ],
    benefits: [
      '🤝 Teamwork: Collective problem solving',
      '🗣️ Communication: Verbal and non-verbal',
      '🧠 Strategy: Planning and execution',
      '🎯 Patience: Step-by-step approach',
    ],
  },
  {
    id: 'mirror-mirror',
    title: 'Mirror Mirror',
    category: 'teamwork-strategy',
    emoji: '🪞',
    description: 'Partner ke bilkul saamne khade hokar uske movement ki exact copy karna.',
    imageUrl: '/truth_and_lie.png',
    howToPlay: [
      'Do bachche pair banaen (face to face)',
      'Ek bachcha "Leader" banta hai',
      'Leader slow movements karega (hand raise, turn, etc.)',
      'Doosra bachcha "Mirror" hai, exact copy karega',
      '2 minute baad roles swap karein',
      'Slow aur smooth movements karein',
    ],
    benefits: [
      '👀 Observation: Detail watching',
      '⚡ Coordination: Body synchronization',
      '🤝 Trust: Partner connection',
      '🎯 Focus: Concentrating on partner',
    ],
  },
  {
    id: 'untangle-web',
    title: 'Untangle the Web',
    category: 'teamwork-strategy',
    emoji: '🕸️',
    description: 'Ek team doosri team ki body position dekh kar coordination se cross karegi.',
    imageUrl: '/counting_mind.png',
    howToPlay: [
      'Team A complex body positions banaegi (arms crossed, legs twisted)',
      'Team B observe karegi positions',
      'Team B ko same positions copy karni hain without touching',
      'Coordination se cross kar ke exact positions banaen',
      'Time limit mein kaun sahi banata hai, woh jeetega',
    ],
    benefits: [
      '👀 Observation: Visual memory',
      '🤝 Teamwork: Coordination',
      '🧠 Strategy: Planning and execution',
      '⚡ Precision: Exact movements',
    ],
  },
  {
    id: 'land-sea-air',
    title: 'Land, Sea, and Air',
    category: 'teamwork-strategy',
    emoji: '🌊',
    description: 'Line ke aage (Land), peeche (Sea), aur jump (Air) karne ki fast command.',
    imageUrl: '/word_chain.png',
    howToPlay: [
      'Ek line banayein (middle line)',
      'Leader commands dega: "Land!" (aage jump), "Sea!" (peeche jump), "Air!" (upar jump)',
      'Bachchon ko command ke hisaab se turant action karna hai',
      'Jo galat karega, woh out ho jayega',
      'Speed gradually increase karein',
    ],
    benefits: [
      '⚡ Quick Reaction: Instant response',
      '👂 Listening Skills: Command recognition',
      '🏃 Physical: Jumping and movement',
      '🎯 Focus: Attention and accuracy',
    ],
  },
  {
    id: 'touch-something-blue',
    title: 'Touch Something Blue',
    category: 'teamwork-strategy',
    emoji: '🔵',
    description: 'Captain bolega "Touch Blue", sabhi ko room/ground me us color ko touch karna hai.',
    imageUrl: '/story_builder_.png',
    howToPlay: [
      'Leader/Captain ek color bolega (Red, Blue, Green, etc.)',
      'Bachchon ko turant us color ki cheez ko touch karna hai',
      'Jo sabse pehle touch karega, woh point score karega',
      'Jo 5 second mein nahi touch kar paaya, woh out',
      'Colors change karte rahein',
    ],
    benefits: [
      '👀 Observation: Color recognition',
      '⚡ Quick Reaction: Fast response',
      '🏃 Physical: Running and movement',
      '🎯 Focus: Attention and speed',
    ],
  },
  {
    id: 'steal-rooster',
    title: 'Steal the Rooster',
    category: 'teamwork-strategy',
    emoji: '🐓',
    description: 'Do teams me se ek-ek member aakar center se point score karne ki koshish karega.',
    imageUrl: '/pass_action.png',
    howToPlay: [
      'Do teams banaen',
      'Center mein ek object rakhein (Rooster/Flag)',
      'Har team se ek-ek player center ki taraf bhaagega',
      'Center object le kar wapas apni team ke side pahunchana hai',
      'Doosri team ka player object chura sakta hai',
      'Maximum points wali team jeetegi',
    ],
    benefits: [
      '⚡ Strategy: Attack and defense planning',
      '🤝 Teamwork: Coordination',
      '🏃 Physical: Running and agility',
      '😄 Fun: Competitive excitement',
    ],
  },
  {
    id: 'pass-high-five',
    title: 'Pass the High Five',
    category: 'teamwork-strategy',
    emoji: '✋',
    description: 'Line me bina bole fast high-five pass karna.',
    imageUrl: '/truth_and_lie.png',
    howToPlay: [
      'Bachche line mein khade hon',
      'Pehla bachcha next ko high-five karega',
      'High-five chain reaction ki tarah aage badhti hai',
      'Koi bhi verbal communication nahi karna',
      'Chain jaldi-jaaldi complete karni hai',
      'Time kam se kam lene wali team jeetegi',
    ],
    benefits: [
      '⚡ Speed: Fast coordination',
      '🤝 Teamwork: Non-verbal communication',
      '👀 Observation: Anticipating turn',
      '🎯 Focus: Attention and timing',
    ],
  },
  {
    id: 'ruler-kingdom',
    title: 'Ruler of the Kingdom',
    category: 'teamwork-strategy',
    emoji: '👑',
    description: 'Action banakar pure group se follow karwana bina pakde gaye.',
    imageUrl: '/counting_mind.png',
    howToPlay: [
      'Ek bachcha "Ruler" banta hai',
      'Ruler koi action karega (dance move, hand movement, etc.)',
      'Sabhi ko Ruler ki copy karni hai',
      'Ruler action change karta rahega',
      'Jo pakda gaya (galat copy), woh out',
      'Secret signal use karein for change',
    ],
    benefits: [
      '👀 Observation: Detail watching',
      '🎨 Creativity: Different actions',
      '🤝 Teamwork: Following leader',
      '😄 Fun: Playful game',
    ],
  },
  {
    id: 'silent-lineup',
    title: 'Silent Line-up',
    category: 'teamwork-strategy',
    emoji: '🤫',
    description: 'Bina bole sirf gestures se height ya birth month ke hisaab se line banana.',
    imageUrl: '/word_chain.png',
    howToPlay: [
      'Bachchon ko kisi bhi kram mein khada karein',
      'Unhe bina bole (silent) kisi order mein khada hona hai',
      'Examples: Height (shortest to tallest), Birth month (Jan to Dec)',
      'Sirf gestures, actions, signs use kar sakte hain',
      'Jaldi-sahi order banane wali team jeetegi',
      'Coordination and observation use karein',
    ],
    benefits: [
      '🗣️ Non-verbal Communication: Gestures and signs',
      '🤝 Teamwork: Silent coordination',
      '🧠 Strategy: Planning without words',
      '👀 Observation: Body language reading',
    ],
  },
  {
    id: 'group-balance',
    title: 'Group Balance Challenge',
    category: 'teamwork-strategy',
    emoji: '⚖️',
    description: 'Pure group ko ek sath single leg par 10 seconds tak balance karna.',
    imageUrl: '/story_builder_.png',
    howToPlay: [
      'Pure group ek sath single leg par khada ho',
      '10 second countdown shuru karein',
      'Kisi ko bhi doosra pair zameen par nahi rakhna',
      'Haath pakad kar balance maintain karein',
      'Group effort se 10 seconds complete karein',
      'Har baar time increase karte jayein (15, 20, 30 sec)',
    ],
    benefits: [
      '🤝 Teamwork: Collective effort',
      '⚖️ Balance: Group coordination',
      '💪 Strength: Core and leg strength',
      '🎯 Focus: Concentration and unity',
    ],
  },
];

// ----- Main Component -----
const GameLibrary: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mind-memory' | 'physical-coordination' | 'teamwork-strategy'>('all');

  // Close modal
  const closeModal = () => setSelectedGame(null);

  // Filter games based on category
  const filteredGames = selectedCategory === 'all'
    ? gamesData
    : gamesData.filter(game => game.category === selectedCategory);

  // Category labels for buttons
  const categoryLabels = {
    'mind-memory': '🧠 Mind & Memory',
    'physical-coordination': '🏃 Physical & Coordination',
    'teamwork-strategy': '🤝 Teamwork & Strategy',
  };

  // Count games per category (for display)
  const counts = {
    all: gamesData.length,
    'mind-memory': gamesData.filter(g => g.category === 'mind-memory').length,
    'physical-coordination': gamesData.filter(g => g.category === 'physical-coordination').length,
    'teamwork-strategy': gamesData.filter(g => g.category === 'teamwork-strategy').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-3">
            <span>🎮</span> Game Library
            <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
              {gamesData.length} Games
            </span>
          </h1>
          <p className="text-gray-400 mt-2">Fun games for kids - Mind, Physical & Teamwork</p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            🎯 All Games <span className="ml-1 text-xs opacity-70">({counts.all})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('mind-memory')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              selectedCategory === 'mind-memory'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            🧠 Mind & Memory <span className="ml-1 text-xs opacity-70">({counts['mind-memory']})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('physical-coordination')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              selectedCategory === 'physical-coordination'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            🏃 Physical & Coordination <span className="ml-1 text-xs opacity-70">({counts['physical-coordination']})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('teamwork-strategy')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              selectedCategory === 'teamwork-strategy'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            🤝 Teamwork & Strategy <span className="ml-1 text-xs opacity-70">({counts['teamwork-strategy']})</span>
          </button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Image */}
              <div className="h-40 overflow-hidden bg-gray-800/50 flex items-center justify-center">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%234b5563"/><text x="50" y="55" font-size="40" text-anchor="middle" fill="%23ffffff">${game.emoji}</text></svg>`;
                  }}
                />
              </div>
              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{game.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">{game.description}</p>
                <div className="mt-2 text-blue-400 text-xs font-medium flex items-center gap-1">
                  <span>Click to explore</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No games found in this category.</p>
          </div>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {selectedGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-3xl 
                       w-full max-w-3xl max-h-[95vh] overflow-y-auto 
                       border border-white/10 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ===== HEADER ===== */}
            <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-xl 
                            px-5 sm:px-7 py-4 border-b border-white/10 
                            flex justify-between items-center">
              <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">{selectedGame.emoji}</span>
                <span className="line-clamp-2">{selectedGame.title}</span>
              </h2>
              <button
                onClick={closeModal}
                className="flex-shrink-0 ml-3 text-gray-400 hover:text-white 
                           bg-white/5 hover:bg-red-500/20 
                           p-2 rounded-full transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ===== MODAL BODY ===== */}
            <div className="p-4 sm:p-6 md:p-7 space-y-6">
              {/* ===== GAME IMAGE ===== */}
              <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-xl">
                <img
                  src={selectedGame.imageUrl}
                  alt={selectedGame.title}
                  className="w-full h-auto max-h-[420px] sm:max-h-[480px] object-cover transition-transform duration-500 hover:scale-[1.02]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `data:image/svg+xml,
                      <svg xmlns="http://www.w3.org/2000/svg"
                      width="600" height="400"
                      viewBox="0 0 600 400">
                      <rect width="600" height="400" fill="%231f2937"/>
                      <text x="300" y="220"
                      font-size="100"
                      text-anchor="middle"
                      fill="white">
                      ${selectedGame.emoji}
                      </text>
                      </svg>`;
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>

              {/* ===== DESCRIPTION ===== */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                <h3 className="text-yellow-400 font-bold text-lg mb-2 flex items-center gap-2">
                  <span>🎮</span> Game Ke Baare Mein
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {selectedGame.description}
                </p>
              </div>

              {/* ===== HOW TO PLAY ===== */}
              <div className="bg-blue-500/5 border border-blue-400/10 rounded-2xl p-4 sm:p-5">
                <h3 className="text-blue-400 font-bold text-lg mb-4 flex items-center gap-2">
                  <span>🎯</span> Kaise Khelte Hain?
                </h3>
                <ol className="space-y-3">
                  {selectedGame.howToPlay.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-gray-300 text-sm sm:text-base leading-relaxed pt-0.5">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* ===== BENEFITS ===== */}
              <div className="bg-green-500/5 border border-green-400/10 rounded-2xl p-4 sm:p-5">
                <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                  <span>✨</span> Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedGame.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                        ✓
                      </span>
                      <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== CLOSE BUTTON ===== */}
              <button
                onClick={closeModal}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                🎮 Game Samajh Gaya — Let's Play!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLibrary;