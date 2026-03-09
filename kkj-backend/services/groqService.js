const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateAstrologyReport = async (userData) => {
  const { name, dateOfBirth, timeOfBirth, placeOfBirth, currentLocation, specificQuestion, plan } = userData;

  const systemPrompt = `You are a legendary Vedic & KP Astrologer with 40 years of experience.
Your tone is empathetic, wise, and deeply spiritual yet practical. 
You avoid generic "horoscope-style" writing. Instead, you focus on deep psychological insights, 
karmic patterns, and relatable life struggles (finding purpose, career confusion, relationship harmony, financial stability).
Write in a way that makes the reader feel you truly understand their soul's journey.
Respond ONLY with valid raw JSON — absolutely no markdown, no code fences, no explanation text before or after.`;

  const userPrompt = `Generate a comprehensive "Cosmic Blueprint" (Astrology Report) for:
Name: ${name}
DOB: ${dateOfBirth}
Time: ${timeOfBirth}
Place: ${placeOfBirth}
Current Location: ${currentLocation}
Specific Question: ${specificQuestion}
Analysis Level: ${plan}

IMPORTANT: Keep the descriptions concise to ensure they fit properly on a printed page. Do not generate overly long paragraphs. The response MUST be a JSON object with this exact structure:
{
  "greeting": "A warm, 2 sentence opening addressing ${name} directly, acknowledging their journey.",
  "mulank": {
    "number": N,
    "title": "A short, powerful title for this number",
    "description": "2-3 highly relatable and concise sentences about their personality and core drivers."
  },
  "bhagyank": {
    "number": N,
    "title": "A short, powerful title for this number",
    "description": "2-3 highly relatable and concise sentences about their destiny path and life lessons."
  },
  "zodiacAnalysis": {
    "sign": "",
    "element": "",
    "ruling_planet": "",
    "description": "3 concise sentences explaining how their Sun/Moon sign influences their core identity."
  },
  "janamPatrika": {
    "ascendant": "",
    "moonSign": "",
    "overview": "A 3-4 sentence concise summary of their Lagna (Ascendant) and overall planetary alignment."
  },
  "planetaryPositions": [
    { "planet": "Sun",     "position": "", "effect": "Concise effect on career/ego (1-2 sentences)" },
    { "planet": "Moon",    "position": "", "effect": "Concise effect on mind/emotions (1-2 sentences)" },
    { "planet": "Mars",    "position": "", "effect": "Concise effect on energy/siblings (1-2 sentences)" },
    { "planet": "Mercury", "position": "", "effect": "Concise effect on speech/business (1-2 sentences)" },
    { "planet": "Jupiter", "position": "", "effect": "Concise effect on wealth/wisdom (1-2 sentences)" },
    { "planet": "Venus",   "position": "", "effect": "Concise effect on love/luxury (1-2 sentences)" },
    { "planet": "Saturn",  "position": "", "effect": "Concise effect on karma/delays (1-2 sentences)" },
    { "planet": "Rahu",    "position": "", "effect": "Concise effect on obsessions/fame (1-2 sentences)" },
    { "planet": "Ketu",    "position": "", "effect": "Concise effect on spirituality/detachment (1-2 sentences)" }
  ],
  "yearlyHoroscope": {
    "theme": "A profound, 1-sentence spiritual theme for their current year",
    "career": "2 concise sentences: Real-world advice on growth or stability.",
    "love": "2 concise sentences: Guidance on existing relationships or finding a partner.",
    "health": "2 concise sentences: Specific energy points and physical health advice.",
    "finance": "2 concise sentences: Wealth creation and monetary warnings."
  },
  "specificAnswer": "A profound 5-6 sentence master-level analysis answering their exact question ('${specificQuestion}'). Be specific but do not exceed 6 sentences.",
  "remedies": [
    { "title": "Sacred Ritual", "description": "A specific mantra, gemstone, or daily habit for spiritual alignment (2 sentences)." },
    { "title": "Practical Action", "description": "Something they should literally DO in the physical world to fix their problem (2 sentences)." },
    { "title": "Mental Shift", "description": "How they should change their mindset/thoughts to manifest better results (2 sentences)." }
  ],
  "closingBlessing": {
    "sanskrit": "A relevant short Sanskrit Shlok",
    "translation": "Deeply moving English translation"
  }
}`;

  try {
    // Timeout handling
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Groq AI request timed out after 60 seconds')), 60000);
    });

    const completionPromise = groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 6000,
    });

    const completion = await Promise.race([completionPromise, timeoutPromise]);
    let content = completion.choices[0].message.content;

    // Robust JSON cleaning
    content = content.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Find the first { and last } to handle any extra text Groq might add
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('AI response did not contain valid JSON format');
    }
    content = content.substring(firstBrace, lastBrace + 1);

    const parsedData = JSON.parse(content);

    // Validate required fields
    const requiredFields = [
      'greeting', 'mulank', 'bhagyank', 'zodiacAnalysis',
      'janamPatrika', 'planetaryPositions', 'yearlyHoroscope',
      'specificAnswer', 'remedies', 'closingBlessing'
    ];

    const missingFields = requiredFields.filter(field => !parsedData[field]);
    if (missingFields.length > 0) {
      throw new Error(`AI response missing required fields: ${missingFields.join(', ')}`);
    }

    return parsedData;
  } catch (error) {
    console.error('Groq Service Error:', error.message);
    throw new Error(`Cosmic alignment failed: ${error.message}`);
  }
};

module.exports = { generateAstrologyReport };
