const express = require('express');
const router = express.Router();
const Caption = require('../models/Caption');
const Trending = require('../models/Trending');
const Blog = require('../models/Blog');

const getDynamicHashtags = (topic, count = 10) => {
  const cleanTopic = (topic || 'trending').toLowerCase().trim();
  const requestedCount = Math.min(parseInt(count) || 10, 100);

  const niches = {
    fitness: ['gym', 'workout', 'fitnessmotivation', 'bodybuilding', 'health', 'training', 'fitlife', 'muscle', 'crossfit', 'wellness', 'physique', 'gymrat', 'fitfam', 'cardio', 'yoga', 'strength', 'diet', 'abs', 'gains', 'powerlifting'],
    tech: ['programming', 'coding', 'developer', 'software', 'ai', 'techlife', 'webdev', 'javascript', 'cybersecurity', 'innovation', 'python', 'reactjs', 'data', 'cloud', 'future', 'robotics', 'gadgets', 'apple', 'linux', 'crypto'],
    fashion: ['ootd', 'style', 'fashionista', 'outfit', 'luxury', 'streetwear', 'model', 'shopping', 'clothing', 'beauty', 'jewelry', 'heels', 'dress', 'fashionblogger', 'vogue', 'runway', 'outfitoftheday', 'instafashion'],
    travel: ['wanderlust', 'adventure', 'explore', 'vacation', 'nature', 'landscape', 'trip', 'travelgram', 'photography', 'beach', 'mountains', 'getaway', 'solotravel', 'travelblogger', 'sunset', 'islands', 'hiking', 'wildlife'],
    food: ['foodie', 'delicious', 'cooking', 'recipe', 'yummy', 'dinner', 'healthyfood', 'chef', 'restaurant', 'homemade', 'breakfast', 'vegan', 'dessert', 'coffee', 'organic', 'lunch', 'streetfood', 'foodporn'],
    business: ['entrepreneur', 'marketing', 'success', 'hustle', 'finance', 'startup', 'branding', 'wealth', 'passiveincome', 'workfromhome', 'motivation', 'leader', 'sales', 'growth', 'investing', 'stocks', 'realestate', 'boss']
  };

  const discoveryTags = [
    'viral', 'trending', 'explorepage', 'fyp', 'foryou', 'aesthetic', 'lifestyle', 'reels', '2026', 'algorithm',
    'instadaily', 'instagood', 'video', 'content', 'growth', 'shorts', 'tiktok', 'socialmedia', 'creator', 'studio',
    'daily', 'vibes', 'inspiration', 'goals', 'minimalism', 'highcontrast', 'premium', 'luxury', 'exclusive', 'pro',
    'shortsindia', 'reelsindia', 'viralreels', 'trendingnow', 'bestvideo', 'watchthis', 'mindset', 'lifehacks', 'tips',
    'newpost', 'follow', 'like', 'share', 'comment', 'engagement', 'audience', 'analytics', 'strategy', 'blueprint',
    'secret', 'unlocked', 'mastery', 'professional', 'expert', 'guide', 'tutorial', 'behindthescenes', 'vlog', 'dayinlife',
    'morning', 'night', 'weekend', 'mood', 'energy', 'positive', 'goodvibes', 'beautiful', 'awesome', 'amazing',
    'magic', 'pure', 'real', 'authentic', 'raw', 'underrated', 'hidden', 'gem', 'mustwatch', 'legendary'
  ];

  let nicheTags = [];
  Object.keys(niches).forEach(n => {
    if (cleanTopic.includes(n) || n.includes(cleanTopic.split(' ')[0])) {
      nicheTags = nicheTags.concat(niches[n]);
    }
  });

  const topicParts = cleanTopic.split(/\s+/).filter(p => p.length > 2);
  const userRelatedTags = [];
  
  topicParts.forEach(part => {
    userRelatedTags.push(part);
    userRelatedTags.push(`${part}vibes`);
    userRelatedTags.push(`${part}tips`);
    userRelatedTags.push(`${part}hacks`);
    userRelatedTags.push(`${part}growth`);
    userRelatedTags.push(`${part}daily`);
    userRelatedTags.push(`${part}2026`);
    userRelatedTags.push(`viral${part}`);
    userRelatedTags.push(`best${part}`);
    userRelatedTags.push(`pro${part}`);
    userRelatedTags.push(`${part}style`);
    userRelatedTags.push(`${part}guide`);
  });

  if (topicParts.length > 1) {
    userRelatedTags.push(topicParts.join(''));
    userRelatedTags.push(topicParts.join('_'));
  }

  let pool = [...new Set([...userRelatedTags, ...nicheTags, ...discoveryTags])];
  
  // Ensure we have enough tags to reach 100 if requested
  while (pool.length < requestedCount) {
    const randomWord = discoveryTags[Math.floor(Math.random() * discoveryTags.length)];
    const randomUserWord = topicParts[Math.floor(Math.random() * topicParts.length)] || 'viral';
    pool.push(`${randomUserWord}_${randomWord}`);
  }

  return pool.sort(() => 0.5 - Math.random()).slice(0, requestedCount).map(t => `#${t}`);
};

router.post('/hashtags', async (req, res) => {
  try {
    const { topic, count = 10 } = req.body;
    const result = getDynamicHashtags(topic, count);
    res.json({ hashtags: result });
  } catch (error) {
    res.status(500).json({ error: 'Generation failed' });
  }
});

// Improved helper to simulate complex AI generation from "outside source"
const generateAIResponse = async (topic, platform, tone, language, audience, goal, keywords) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allContent = {
        'English': {
          hooks: [
            `Stop scrolling! You NEED to see this! 🛑😱`,
            `The secret they don't want you to know about ${topic}... 🤐🔥`,
            `I tried the ultimate ${topic} hack so you don't have to! 🤯✨`,
            `Why nobody is talking about ${topic}? 🤷‍♂️`,
            `This changed my life: ${topic} 🚀`
          ],
          titles: [
            `Unlocking the Secrets of ${topic} 🔑`,
            `How to Master ${topic} in 2026 📈`,
            `The Ultimate Guide to ${topic} | 100% Viral 🚀`,
            `I did something crazy with ${topic}... (Watch till end) 😱`,
            `${topic}: What they aren't telling you! 🤫`
          ],
          captions: {
            'Viral': [
              `POV: You just discovered the best thing about ${topic} for ${audience}. 🤯✨`,
              `This ${topic} vibe is unmatched. Perfect for ${audience} looking for ${goal}. 🙋‍♂️🔥`,
              `Obsessed with this ${topic} aesthetic. 💖 Keywords: ${keywords || 'Trending'}`,
              `Leveling up my ${topic} game for my fellow ${audience}. What do you think? 🚀`,
              `Manifesting more of this ${topic} energy for ${goal}. ✨`
            ],
            'Motivational': [
              `${topic} isn’t always about greatness. For ${audience}, it’s about consistency and ${goal}. ⏳🔥`,
              `They told me I couldn't, so I did ${topic} to achieve ${goal}. Simple as that. 🚀🎬`,
              `Don't stop until you're proud of your ${topic}. Every ${audience} starts somewhere. 💪`,
              `Your ${topic} journey starts today. Are you ready to crush your ${goal}? 🔥`,
              `Be the reason someone smiles today through ${topic}. Keywords: ${keywords} ✨`
            ],
            'Funny': [
              `Me trying to explain ${topic} to my cat as a ${audience}. 🐱🤷‍♂️`,
              `If ${topic} was a person, we'd be besties. Especially when focusing on ${goal}. 😂`,
              `Current status: Expert at ${topic} (not really). Just ${audience} things. 🤡`,
              `My bank account after seeing ${topic} vs my ${goal}: 📉`,
              `${topic} logic: if it fits, it sits. Keywords: ${keywords} 🏠`
            ],
            'Professional': [
               `Elevating industry standards for ${audience} with our latest approach to ${topic}. 💼✨`,
               `Strategic insights into the evolution of ${topic} for ${goal} in 2026. 📈`,
               `The intersection of innovation and execution: ${topic}. Essential for ${audience}. 🚀`,
               `Redefining what's possible in the world of ${topic} specifically for ${goal}. 🛠️`,
               `Expert-led perspective on the future of ${topic}. A guide for ${audience}. 🎓`
            ],
            'Emotional': [
               `Finding peace in the simple moments of ${topic}. Grateful for this ${audience} community. 🌸❤️`,
               `${topic} reminds me that every small step towards ${goal} counts. ✨`,
               `This journey of ${topic} has taught me so much about life and ${goal}. 🌿`,
               `Grateful for the beauty that ${topic} brings into my world as a ${audience}. 💖`,
               `Connecting with the heart of ${topic}. Keywords: ${keywords}. 🕊️`
            ],
            'Savage': [
              `While you're watching, I'm mastering ${topic}. Stay tuned, ${audience}. 💅🔥`,
              `${topic} isn't for the weak. Only for those chasing ${goal}. 😤`,
              `Keep your opinions, I'll keep my results in ${topic}. 💼`,
              `Imagine not knowing about ${topic} in 2026. Can't relate. 🤡`,
              `Building ${topic} while they're still talking. 🚀`
            ],
            'Minimalist': [
              `${topic}. ${goal}. Simple. ✨`,
              `Less noise, more ${topic}. 🌿`,
              `${topic} for the modern ${audience}. 📐`,
              `Pure ${topic} energy. 🕊️`,
              `Focus: ${topic}. Keywords: ${keywords}. 📍`
            ]
          }
        },
        'Malayalam': {
          hooks: [
            `ഇത് കണ്ടില്ലെങ്കിൽ നിങ്ങൾ വലിയൊരു നഷ്ടം വരുത്തും! 🛑😱`,
            `${topic}-നെ കുറിച്ച് ആരും പറയാത്ത രഹസ്യങ്ങൾ! 🤐🔥`,
            `ഞാൻ പരീക്ഷിച്ച മികച്ച ${topic} ടിപ്‌സ് ഇതാ! 🤯✨`,
            `എന്തുകൊണ്ടാണ് എല്ലാവരും ${topic}-നെ കുറിച്ച് സംസാരിക്കാത്തത്? 🤷‍♂️`,
            `${topic}: ഇത് എന്റെ ജീവിതം തന്നെ മാറ്റിമറിച്ചു! 🚀`
          ],
          titles: [
             `${topic} രഹസ്യങ്ങൾ അൺലോക്ക് ചെയ്യുന്നു 🔑`,
             `2026-ൽ ${topic} എങ്ങനെ മാസ്റ്റർ ചെയ്യാം 📈`,
             `${topic}-ലേക്ക് ഒരു ഗൈഡ് | 100% വൈറൽ 🚀`,
             `${topic} ഉപയോഗിച്ച് ഞാൻ ചെയ്ത അത്ഭുതം... 😱`,
             `${topic}: അവർ പറയാത്ത കാര്യങ്ങൾ! 🤫`
          ],
          captions: {
            'Viral': [
              `${topic}-നെ കുറിച്ചുള്ള ഏറ്റവും നല്ല കാര്യം ഇപ്പോൾ കണ്ടെത്തി. 🤯✨`,
              `${topic} വൈബ് വേറെ തന്നെയാണ്. കൂടെ ആരുണ്ട്? 🙋‍♂️🔥`,
              `${topic} ഇഷ്ടപ്പെടുന്നവർക്കായി. 💖 #DailyDose`,
              `${topic} ഗെയിം ലെവൽ അപ്പ് ചെയ്യുന്നു. നിങ്ങൾക്കെന്ത് തോന്നും? 🚀`,
              `${topic} എനർജി ജീവിതത്തിലേക്ക് പകർത്തുമ്പോൾ. ✨`
            ],
            'Motivational': [
              `${topic} എന്നത് എല്ലായ്പ്പോഴും വലിയ കാര്യങ്ങളെക്കുറിച്ചല്ല. സ്ഥിരതയെക്കുറിച്ചാണ്. ⏳🔥`,
              `പറ്റില്ല എന്ന് പറഞ്ഞവരോട് ${topic} ചെയ്ത് കാണിച്ചു കൊടുത്തു. 🚀🎬`,
              `${topic} മികച്ചതാക്കുന്നത് വരെ നിർത്തരുത്. 💪`,
              `നിങ്ങളുടെ ${topic} യാത്ര ഇന്ന് തുടങ്ങുന്നു. നിങ്ങൾ റെഡി ആണോ? 🔥`,
              `${topic} ലൂടെ ഒരാളുടെ മുഖത്ത് ചിരി വരുത്താൻ ശ്രമിക്കാം. ✨`
            ],
            'Funny': [
              `${topic}-നെ കുറിച്ച് എന്റെ പൂച്ചയോട് സംസാരിക്കുമ്പോൾ. 🐱🤷‍♂️`,
              `${topic} ഒരു വ്യക്തിയായിരുന്നെങ്കിൽ നമ്മൾ ബെസ്റ്റീസ് ആയേനെ. 😂`,
              `${topic}-ൽ ഞാൻ എക്സ്പെർട്ട് ആണ് (ചുമ്മാ പറഞ്ഞതാ). 🤡`,
              `${topic} കണ്ടതിന് ശേഷമുള്ള എന്റെ ബാങ്ക് അക്കൗണ്ട്: 📉`,
              `${topic} ലോജിക്: ഇത് ശരിയായാൽ അത് ശരിയായി. 🏠`
            ],
            'Professional': [
               `${topic}-ലേക്കുള്ള ഞങ്ങളുടെ ഏറ്റവും പുതിയ സമീപനത്തിലൂടെ ഇൻഡസ്ട്രി നിലവാരം ഉയർത്തുന്നു. 💼✨`,
               `2026-ൽ ${topic}-ന്റെ പരിണാമത്തെക്കുറിച്ചുള്ള തന്ത്രപരമായ ഉൾക്കാഴ്ചകൾ. 📈`,
               `നവീകരണത്തിന്റെയും നടത്തിപ്പിന്റെയും സമാഗമം: ${topic}. 🚀`,
               `${topic} ലോകത്ത് സാധ്യമായവയെ പുനർനിർവചിക്കുന്നു. 🛠️`,
               `${topic}-ന്റെ ഭാവിയെക്കുറിച്ചുള്ള വിദഗ്ധരുടെ കാഴ്ചപ്പാട്. 🎓`
            ],
            'Emotional': [
               `${topic}-ന്റെ ലളിതമായ നിമിഷങ്ങളിൽ സമാധാനം കണ്ടെത്തുന്നു. 🌸❤️`,
               `${topic} എന്നെ ഓർമ്മിപ്പിക്കുന്നു ഓരോ ചെറിയ ചുവടുവെപ്പും പ്രധാനമാണെന്ന്. ✨`,
               `ഈ ${topic} യാത്ര ജീവിതത്തെക്കുറിച്ച് ഒരുപാട് കാര്യങ്ങൾ എന്നെ പഠിപ്പിച്ചു. 🌿`,
               `${topic} എന്റെ ലോകത്തേക്ക് കൊണ്ടുവരുന്ന സൗന്ദര്യത്തിന് നന്ദിയുണ്ട്. 💖`,
               `${topic}-ന്റെ ഹൃദയവുമായി ബന്ധപ്പെടുന്നു. 🕊️`
            ]
          }
        },
        'Hindi': {
          hooks: [
            `रुको! तुम्हें ये देखने की ज़रूरत है! 🛑😱`,
            `${topic} के बारे में वो राज़ जो कोई नहीं जानता! 🤐🔥`,
            `मैंने ${topic} का ये हैक ट्राई किया और रिज़ल्ट कमाल का था! 🤯✨`,
            `${topic} के बारे में कोई बात क्यों नहीं कर रहा? 🤷‍♂️`,
            `इस चीज़ ने मेरी लाइफ बदल दी: ${topic} 🚀`
          ],
          titles: [
            `${topic} के राज़ खोल रहे हैं 🔑`,
             `2026 में ${topic} के मास्टर कैसे बनें 📈`,
             `${topic} गाइड | 100% वायरल 🚀`,
             `${topic} के साथ मैंने कुछ तूफ़ानी किया... 😱`,
             `${topic}: वो बातें जो आपको पता होनी चाहिए! 🤫`
          ],
          captions: {
            'Viral': [
              `POV: आपने अभी ${topic} के बारे में सबसे अच्छी चीज़ खोजी है। 🤯✨`,
              `ये ${topic} वाइब सबसे अलग है। कौन-कौन साथ है? 🙋‍♂️🔥`,
              `${topic} की इस खूबसूरती का दीवाना हूँ। 💖 #DailyDose`,
              `अपना ${topic} गेम लेवल अप कर रहा हूँ। आपको क्या लगता है? 🚀`,
              `${topic} की इस एनर्जी को फील कर रहा हूँ। ✨`
            ],
            'Motivational': [
              `${topic} सिर्फ़ महान बनने के बारे में नहीं है। ये कंसिस्टेंसी के बारे में है। ⏳🔥`,
              `सबने कहा नहीं हो पाएगा, फिर मैंने ${topic} कर दिखाया। 🚀🎬`,
              `तब तक मत रुको जब तक तुम्हें अपने ${topic} पर गर्व न हो। 💪`,
              `आपकी ${topic} जर्नी आज से शुरू होती है। क्या आप तैयार हैं? 🔥`,
              `${topic} के ज़रिए किसी के चेहरे पर मुस्कान लाएँ। ✨`
            ]
          }
        }
      };

      const langContent = allContent[language] || allContent['English'];
      const rawCaptions = (langContent.captions && langContent.captions[tone]) || (langContent.captions ? langContent.captions['Viral'] : []);
      
      const hashtags = getDynamicHashtags(topic, 12);
      if (language === 'Malayalam') hashtags.push('#malayalam');
      if (language === 'Hindi') hashtags.push('#hindi');

      // Add high-reach keywords to each caption for maximum visibility
      const reachKeywords = platform === 'Instagram' ? ' #reels #explore #viral' : ' #shorts #trending #viral';
      const captionsWithReach = rawCaptions.map(cap => `${cap}${reachKeywords}`);

      resolve({
        captions: captionsWithReach,
        hashtags: hashtags,
        hooks: (langContent.hooks || []).slice(0, 3),
        titles: (langContent.titles || []).slice(0, 3),
        viralScore: Math.floor(Math.random() * 10) + 90
      });
    }, 1500);
  });
};

router.post('/generate', async (req, res) => {
  try {
    const { topic, platform, tone, language, audience, goal, keywords } = req.body;
    const aiData = await generateAIResponse(topic, platform, tone, language, audience, goal, keywords);
    res.json(aiData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate captions' });
  }
});

router.post('/save', async (req, res) => {
  try {
    const { userId, topic, platform, tone, language, captions, hashtags, hooks, viralScore } = req.body;
    const newCaption = new Caption({
      userId, topic, platform, tone, language, captions, hashtags, hooks, viralScore
    });
    await newCaption.save();
    res.json({ success: true, data: newCaption });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save generation' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await Caption.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Caption.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const categories = ['All', 'Love', 'Attitude', 'Travel', 'Funny', 'Motivation', 'Bike', 'Fitness', 'Tech', 'Food', 'Fashion'];
    const viralDictionary = {
      'Love': ["In your eyes, I've found my home. ❤️🏠", "Collecting moments with you. ✨💖", "Every love story is beautiful. 🌹"],
      'Attitude': ["Be a voice, not an echo. 🗣️🔥", "Success is the revenge. 💼💸", "Born to lead. 🦁"],
      'Travel': ["Adventure awaits. 🌍✈️", "Not all who wander are lost. 🏔️", "Paradise found. 🏝️💙"],
      'Funny': ["Seafood diet. I see food. 🍕🤤", "Life is short. Smile. 😁🦷", "Energy saving mode. 🔋😴"],
      'Motivation': ["Believe in yourself. 🌟💪", "Dream big. 🎯🔥", "Difficult roads lead home. 🌈"],
      'Bike': ["Two wheels move the soul. 🏍️💨", "Ride hard. 🏁🔥", "Life is better on bikes. 🚲"],
      'Fitness': ["Discipline > Motivation. 💪🔥", "Don't stop when it hurts, stop when you're done. 🏋️‍♂️", "Your only limit is you. ✨"],
      'Tech': ["Innovation distinguishes between a leader and a follower. 💻🚀", "Stay hungry, stay foolish. 🍎", "Code is life. ⌨️"],
      'Food': ["Cooking is love made visible. 🍜❤️", "Life is too short for boring food. 🍔✨", "First, we eat. Then we do everything else. 🍕"],
      'Fashion': ["Style is a way to say who you are without speaking. 👗✨", "Fashion is what you buy, style is what you do with it. 👠", "Keep it simple but significant. 👔"]
    };

    let trendingData = [];
    categories.forEach(cat => {
      if (cat === 'All') return;
      const texts = viralDictionary[cat] || [];
      const captions = texts.map(text => ({ text, viralScore: Math.floor(Math.random() * 8) + 92 }));
      trendingData.push({ category: cat, captions });
    });
    res.json(trendingData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending' });
  }
});

router.get('/blogs', async (req, res) => {
  res.json([
    { title: "The AI Hook Blueprint: 7 Patterns That Stop the Scroll", slug: "ai-hook-patterns", desc: "Scientific psychological patterns used by top creators to guarantee attention in the first 0.3 seconds.", category: "Strategy", date: "April 10, 2026", readTime: "4 min", author: "AI Team" },
    { title: "Instagram SEO: Mastering the 2026 Discovery Algorithm", slug: "ig-seo-mastery", desc: "Beyond hashtags. Learn how to optimize your captions for keyword search and explore page dominance.", category: "Growth", date: "April 08, 2026", readTime: "6 min", author: "Growth Lead" },
    { title: "The Neutral Palette: Why Less is More in 2026", slug: "neutral-minimalism", desc: "How to use high-contrast aesthetics and minimalist design to build a premium creator identity.", category: "Design", date: "April 05, 2026", readTime: "3 min", author: "Design Pro" },
    { title: "Monetization 2.0: Scaling Passion into a High-Ticket SaaS", slug: "saas-monetization", desc: "Turn your content engine into a recurring revenue machine without sacrificing authenticity.", category: "Profit", date: "April 02, 2026", readTime: "8 min", author: "SaaS Expert" },
    { title: "Lighting for High-Contrast: The Soft-Key Technique", slug: "lighting-pro", desc: "A technical guide to achieving professional studio lighting with minimal equipment.", category: "Visuals", date: "March 28, 2026", readTime: "5 min", author: "DOP" }
  ]);
});

router.get('/blog/:slug', async (req, res) => {
  const contentMap = {
    'ai-hook-patterns': {
      title: "The AI Hook Blueprint",
      content: `
        <h2>The 0.3 Second Rule</h2>
        <p>In 2026, the scroll-stop is the only metric that matters. Our AI analysis shows that negative constraints are 40% more effective.</p>
        <h3>1. The Pattern Interrupt</h3>
        <p>Start with a visual or textual contradiction. For example: "Why my 1M view video actually failed."</p>
        <h3>2. The Specific Outcome</h3>
        <p>Instead of "How to grow," use "How I gained 432 followers while sleeping." Specificity generates trust.</p>
      `,
      metaTitle: "AI Hook Blueprint 2026",
      metaDescription: "Master the art of stopping the scroll with AI-driven hook patterns.",
      captions: ["Stop scrolling. Here is why your reach is dying. 🛑", "The secret to 1M views in 24 hours. 🤫"],
      hashtags: ["#HookPoint #ViralStrategy #ContentCreator"]
    },
    'ig-seo-mastery': {
       title: "Instagram SEO Mastery",
       content: `
         <h2>Keywords > Hashtags</h2>
         <p>The 2026 algorithm prioritizes semantic relevance over simple tag matching. Here is how to optimize.</p>
         <h3>Step 1: The Bio-Alt Strategy</h3>
         <p>Ensure your bio and image alt-text share 3 primary keywords within your niche.</p>
         <h3>Step 2: Natural Keyword Integration</h3>
         <p>Integrate your high-volume keywords into the first 2 lines of your caption naturally.</p>
       `,
       metaTitle: "IG SEO 2026 Guide",
       metaDescription: "Master the Instagram search engine optimization patterns.",
       captions: ["SEO is the new algorithm. 🖱️", "Found on Explore? Here is how. ✨"],
       hashtags: ["#IGSEO #GrowthHacks #Discovery"]
    },
    'saas-monetization': {
       title: "Monetization 2.0: SaaS Scale",
       content: `
         <h2>Beyond Brand Deals</h2>
         <p>Creators are moving from influencers to founders. This shift requires a product-first mindset.</p>
         <p>Learn how to build a community that doesn't just watch, but pays for value.</p>
       `,
       metaTitle: "Monetization Strategy 2026",
       metaDescription: "Scaling creator revenue through SaaS.",
       captions: ["Influencer to Founder. 💼", "Stop selling ads, start selling value. 💰"],
       hashtags: ["#SaaS #CreatorEconomy #Business"]
    }
  };

  const article = contentMap[req.params.slug] || {
    title: "Expert Strategy Guide",
    content: "<h2>Insight Depth Update</h2><p>Our team is currently finalizing the deep-dive research for this case study. Check back in 24 hours for the full breakdown.</p>",
    metaTitle: "Strategy Report",
    metaDescription: "Professional creator blueprint.",
    captions: [],
    hashtags: []
  };
  res.json(article);
});

module.exports = router;
