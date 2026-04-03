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

IMPORTANT STYLE RULE: Use a rich, premium mix of "English" and "Hinglish" (Hindi written in English alphabet). 
It should feel like a warm, relatable Indian mentor/guru talking to their student. 
Use common Hindi/Urdu words like 'zindagi', 'kamyabi', 'mehnat', 'duayein', 'safar', 'himmat' etc. 
Provide punchy, high-impact wisdom. Focus on quality over quantity. Keep the insights sharp and direct.`;

  const userPrompt = `Generate a concise, high-impact "Cosmic Blueprint" (Astrology Report) for:
Name: ${name}
DOB: ${dateOfBirth}
Time: ${timeOfBirth}
Place: ${placeOfBirth}
Current Location: ${currentLocation}
Specific Question: ${specificQuestion}
Analysis Level: ${plan}

IMPORTANT: Be extremely concise. Keep every description to a MAXIMUM of 4-5 lines. Do not exceed this limit.
Include a specific "hinglishInsight" field (1-2 soul-stirring Hinglish sentences) within EVERY major object.

The response MUST be a JSON object with this exact structure:
{
  "greeting": "A warm, soul-stirring 2 sentence opening in a rich English-Hinglish mix.",
  "mulank": { "number": N, "title": "", "description": "A punchy, insightful 4-line summary of this number.", "hinglishInsight": "" },
  "bhagyank": { "number": N, "title": "", "description": "A punchy, insightful 4-line analysis of destiny.", "hinglishInsight": "" },
  "zodiacAnalysis": { "sign": "", "element": "", "ruling_planet": "", "description": "A brief 5-line summary of their Sun Sign traits.", "hinglishInsight": "" },
  "janamPatrika": { "ascendant": "", "moonSign": "", "overview": "A brief 5-line overview of their Lagna and mental makeup.", "hinglishInsight": "" },
  "luckyTraits": { "color": "", "number": "", "day": "", "gemstone": "", "hinglishInsight": "A quick Hinglish tip." },
  "planetaryPositions": [
    { "planet": "Sun", "position": "Aries", "effect": "A brief 2-3 line karmic effect." },
    { "planet": "Moon", "position": "Taurus", "effect": "A brief 2-3 line emotional effect." }
  ],
  "planetaryHinglishInsight": "A deep, concise one-paragraph Hinglish summary of how planets are shaping their life.",
  "yearlyHoroscope": { "theme": "", "career": "A crisp 3-line analysis.", "love": "A crisp 3-line analysis.", "health": "A crisp 3-line analysis.", "finance": "A crisp 3-line analysis.", "hinglishInsight": "" },
  "specificAnswer": "A profound 8-10 line direct answer to their specific question in Hinglish flavor.",
  "remedies": [
    { "title": "First", "description": "2 lines of simple instructions." },
    { "title": "Second", "description": "2 lines instructions." },
    { "title": "Third", "description": "2 lines instructions." }
  ],
  "remedyHinglishInsight": "A closing Hinglish mantra of advice and hope.",
  "hinglishKarmicInsights": { "title": "Apna Purana Karma Samjhein", "content": "A high-impact short paragraph about their past life patterns." },
  "hinglishDailyTips": { "title": "Zindagi Ka Sach", "content": "A crisp, high-impact Hinglish paragraph." },
  "mahadashaAnalysis": "A crisp, powerful 8-line analysis (Premium). Include rich Hinglish.",
  "tenYearTimeline": "A quick breakdown of the next decade (Premium).",
  "gemstoneRecommendation": { "stone": "", "wearing_instructions": "", "benefits": "A crisp bulleted list of 3 major benefits." },
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
      'mahadashaAnalysis', 'tenYearTimeline', 'luckyTraits', 'gemstoneRecommendation'
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
