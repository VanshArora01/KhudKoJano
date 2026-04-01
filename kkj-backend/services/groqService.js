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
karmic patterns, and relatable life struggles.

IMPORTANT STYLE RULE: Mix in "Hinglish" (Hindi written in English alphabet) THROUGHOUT the report. 
It should feel like a warm, relatable Indian mentor/guru talking to their student. 
Use common Hindi/Urdu words like 'zindagi', 'kamyabi', 'mehnat', 'duayein', 'safar', 'himmat' etc. naturally within the English sentences.
Respond ONLY with valid raw JSON — absolutely no markdown, no code fences, no explanation text before or after.`;

  const userPrompt = `Generate a comprehensive "Cosmic Blueprint" (Astrology Report) for:
Name: ${name}
DOB: ${dateOfBirth}
Time: ${timeOfBirth}
Place: ${placeOfBirth}
Current Location: ${currentLocation}
Specific Question: ${specificQuestion}
Analysis Level: ${plan}

IMPORTANT: Keep the descriptions concise. Do not exceed 6 lines per section.
Include a specific "hinglishInsight" field (1 deep, relatable Hinglish sentence) within EVERY major object.

The response MUST be a JSON object with this exact structure:
{
  "greeting": "A warm, 2 sentence opening in Hinglish flavor.",
  "mulank": { "number": N, "title": "", "description": "", "hinglishInsight": "" },
  "bhagyank": { "number": N, "title": "", "description": "", "hinglishInsight": "" },
  "zodiacAnalysis": { "sign": "", "element": "", "ruling_planet": "", "description": "", "hinglishInsight": "" },
  "janamPatrika": { "ascendant": "", "moonSign": "", "overview": "", "hinglishInsight": "" },
  "planetaryPositions": [
    { "planet": "Sun", "position": "", "effect": "" },
    ... etc ...
  ],
  "planetaryHinglishInsight": "A general Hinglish summary of their planets.",
  "yearlyHoroscope": { "theme": "", "career": "", "love": "", "health": "", "finance": "", "hinglishInsight": "" },
  "specificAnswer": "A profound 5-6 sentence answer in Hinglish flavor.",
  "remedies": [
    { "title": "", "description": "" },
    ... 3 total ...
  ],
  "remedyHinglishInsight": "A closing Hinglish mantra of advice.",
  "hinglishKarmicInsights": { "title": "", "content": "" },
  "hinglishDailyTips": { "title": "", "content": "" },
  "mahadashaAnalysis": "A deep analysis (Premium). Include some Hinglish.",
  "tenYearTimeline": "A breakdown (Premium). Include some Hinglish.",
  "closingBlessing": { "sanskrit": "", "translation": "" }
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 6000,
    });

    let content = completion.choices[0].message.content;
    content = content.replace(/```json/gi, '').replace(/```/g, '').trim();

    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    content = content.substring(firstBrace, lastBrace + 1);

    const parsedData = JSON.parse(content);

    // Validate required fields
    const requiredFields = [
      'greeting', 'mulank', 'bhagyank', 'zodiacAnalysis',
      'janamPatrika', 'planetaryPositions', 'yearlyHoroscope',
      'specificAnswer', 'remedies', 'closingBlessing',
      'hinglishKarmicInsights', 'hinglishDailyTips',
      'mahadashaAnalysis', 'tenYearTimeline'
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
