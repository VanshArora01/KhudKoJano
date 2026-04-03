const escapeHtml = (str, fallback = '') => {
    return String(str || fallback)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const getReportTemplate = (data, orderId, orderDate) => {
    const safe = {
        name: data.name || 'Seeker',
        greeting: data.greeting || '',
        mulank: data.mulank || { number: '', title: '', description: '', hinglishInsight: '' },
        bhagyank: data.bhagyank || { number: '', title: '', description: '', hinglishInsight: '' },
        zodiacAnalysis: data.zodiacAnalysis || { sign: '', element: '', ruling_planet: '', description: '', hinglishInsight: '' },
        janamPatrika: data.janamPatrika || { ascendant: '', moonSign: '', overview: '', hinglishInsight: '' },
        planetaryPositions: data.planetaryPositions || [],
        planetaryHinglishInsight: data.planetaryHinglishInsight || '',
        yearlyHoroscope: data.yearlyHoroscope || { theme: '', career: '', love: '', health: '', finance: '', hinglishInsight: '' },
        specificAnswer: data.specificAnswer || '',
        remedies: data.remedies || [],
        remedyHinglishInsight: data.remedyHinglishInsight || '',
        closingBlessing: data.closingBlessing || { sanskrit: '', translation: '' },
        hinglishKarmicInsights: data.hinglishKarmicInsights || { title: 'Aapka Karmic Safar', content: 'Connecting with your soul...' },
        hinglishDailyTips: data.hinglishDailyTips || { title: 'Daily Kamyabi ka Mantra', content: 'Stay positive and keep growing.' },
        mahadashaAnalysis: data.mahadashaAnalysis || 'Deep cosmic shift analysis...',
        tenYearTimeline: data.tenYearTimeline || 'Next decade projection...',
        plan: data.plan || 'standard',
        specificQuestion: data.specificQuestion || '',
        luckyTraits: data.luckyTraits || { color: 'Gold', number: '7', day: 'Thursday', gemstone: 'Yellow Sapphire', hinglishInsight: '' },
        gemstoneRecommendation: data.gemstoneRecommendation || { stone: '', wearing_instructions: '', benefits: '' }
    };

    const planLabel = safe.plan === 'fasttrack' ? '⚡ Fast Track Analysis' : '✦ Standard Analysis';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cosmic Blueprint - ${escapeHtml(safe.name, 'Seeker')}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:ital,wght@0,300;0,400;1,300&display=swap');
        
        /* Fallback fonts if Google Fonts fails to load */
        h1, h2, h3, .cinzel { font-family: 'Cinzel', 'Times New Roman', Georgia, serif; }
        body, p { font-family: 'Lato', Arial, sans-serif; }

        :root {
            --bg: #07071a;
            --gold: #c9a84c;
            --gold-light: #f0d080;
            --silver: #e8e8f0;
            --card-bg: rgba(201, 168, 76, 0.05);
            --card-border: rgba(201, 168, 76, 0.3);
            --accent: #111133;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg);
            color: var(--silver);
            font-family: 'Lato', sans-serif;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
        }

        .page {
            width: 210mm;
            height: 297mm;
            padding: 50px 70px;
            position: relative;
            overflow: hidden;
            page-break-after: always;
            background-color: var(--bg);
            display: flex;
            flex-direction: column;
        }

        /* Persistent Border Frame */
        .page::before {
            content: "";
            position: absolute;
            top: 20px;
            bottom: 20px;
            left: 20px;
            right: 20px;
            border: 2px solid var(--gold);
            pointer-events: none;
            z-index: 100;
        }

        .page::after {
            content: "";
            position: absolute;
            top: 25px;
            bottom: 25px;
            left: 25px;
            right: 25px;
            border: 1px solid rgba(201, 168, 76, 0.4);
            pointer-events: none;
            z-index: 100;
        }

        /* Border Ornaments (Corners) */
        .corner {
            position: absolute;
            width: 35px;
            height: 35px;
            border: 4px solid var(--gold);
            z-index: 101;
        }
        .top-left { top: 20px; left: 20px; border-right: 0; border-bottom: 0; }
        .top-right { top: 20px; right: 20px; border-left: 0; border-bottom: 0; }
        .bottom-left { bottom: 20px; left: 20px; border-right: 0; border-top: 0; }
        .bottom-right { bottom: 20px; right: 20px; border-left: 0; border-top: 0; }

        h1, h2, h3, h4, .cinzel {
            font-family: 'Cinzel', serif;
            letter-spacing: 1px;
        }

        .text-gold { color: var(--gold); }
        .text-center { text-align: center; }

        /* Cover Page Specials */
        .cover {
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0;
        }

        .mandala-container {
            width: 320px;
            height: 320px;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .mandala svg {
            width: 100%;
            height: 100%;
            stroke: var(--gold);
            stroke-width: 1;
            fill: none;
        }

        .om-main {
            font-size: 56px;
            color: var(--gold-light);
            margin-bottom: 15px;
            text-shadow: 0 0 15px rgba(201, 168, 76, 0.4);
        }

        .report-title {
            font-size: 38px;
            color: var(--gold);
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 6px;
        }

        .user-name {
            font-size: 20px;
            color: var(--silver);
            margin-bottom: 30px;
            font-weight: 300;
            letter-spacing: 2px;
        }

        /* Section Headings */
        .section-header {
            margin-bottom: 25px;
            text-align: center;
        }

        .section-header h2 {
            font-size: 24px;
            color: var(--gold);
            text-transform: uppercase;
            margin-bottom: 8px;
            display: inline-block;
            position: relative;
        }

        .section-header h2::after {
            content: "✦";
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            opacity: 0.6;
        }

        /* Grid & Cards */
        .card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            padding: 18px;
            border-radius: 4px;
            margin-bottom: 20px;
            position: relative;
        }

        .card-header {
            color: var(--gold);
            font-size: 16px;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(201, 168, 76, 0.2);
            padding-bottom: 8px;
        }

        /* Numerology Page */
        .num-flex {
            display: flex;
            gap: 20px;
            margin-top: 15px;
        }

        .num-box {
            flex: 1;
            text-align: center;
        }

        .num-val {
            font-size: 60px;
            font-weight: 700;
            color: var(--gold);
            font-family: 'Cinzel', serif;
            margin-bottom: 8px;
            line-height: 1;
        }

        /* Zodiac Page */
        .zod-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }

        .zod-sign-icon {
            font-size: 64px;
            color: var(--gold);
            line-height: 1;
        }

        /* Planetary Table */
        .planets-table {
            width: 100%;
            border-collapse: collapse;
        }

        .planets-table th {
            text-align: left;
            padding: 10px;
            font-family: 'Cinzel', serif;
            font-size: 12px;
            color: var(--gold);
            border-bottom: 2px solid var(--gold);
        }

        .planets-table td {
            padding: 10px;
            border-bottom: 1px solid rgba(201, 168, 76, 0.1);
            font-size: 13px;
        }

        /* Horoscope Grid */
        .horo-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        /* Specific Question Answer */
        .answer-box {
            font-style: italic;
            line-height: 1.6;
            font-size: 15px;
            padding: 24px;
            background: rgba(201, 168, 76, 0.08);
            border-left: 3px solid var(--gold);
        }

        .guru-vachan {
            margin-top: 25px;
            padding: 15px;
            background: rgba(201, 168, 76, 0.03);
            border-top: 1px solid rgba(201, 168, 76, 0.2);
            border-bottom: 1px solid rgba(201, 168, 76, 0.2);
            text-align: center;
            font-style: italic;
            font-size: 14px;
            color: var(--gold-light);
        }

        .guru-vachan::before { content: "Guru Vachan: "; font-weight: bold; font-family: 'Cinzel', serif; font-style: normal; font-size: 10px; letter-spacing: 2px; display: block; margin-bottom: 5px; opacity: 0.6; }

        /* Footer Branding */
        .page-footer {
            position: absolute;
            bottom: 30px;
            left: 50px;
            right: 50px;
            text-align: center;
            font-size: 11px;
            opacity: 0.5;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        /* Unicode Zodiac */
        .zod-icon::after { font-size: 40px; margin-left: 10px; vertical-align: middle; }
        .zod-Aries::after { content: "♈"; }
        .zod-Taurus::after { content: "♉"; }
        .zod-Gemini::after { content: "♊"; }
        .zod-Cancer::after { content: "♋"; }
        .zod-Leo::after { content: "♌"; }
        .zod-Virgo::after { content: "♍"; }
        .zod-Libra::after { content: "♎"; }
        .zod-Scorpio::after { content: "♏"; }
        .zod-Sagittarius::after { content: "♐"; }
        .zod-Capricorn::after { content: "♑"; }
        .zod-Aquarius::after { content: "♒"; }
        .zod-Pisces::after { content: "♓"; }

        @media print {
            .page { page-break-after: always; }
        }
    </style>
</head>
<body>
    <!-- PAGE 1: COVER -->
    <div class="page cover">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
        
        <div class="mandala-container">
            <div class="mandala">
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" />
                    <path d="M50 5 L95 82 L5 82 Z" />
                    <path d="M50 95 L95 18 L5 18 Z" />
                    <circle cx="50" cy="50" r="12" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M21.7 21.7 L78.3 78.3 M21.7 78.3 L78.3 21.7" stroke-opacity="0.3"/>
                </svg>
            </div>
        </div>

        <div class="om-main cinzel">ॐ</div>
        <h1 class="report-title cinzel">Cosmic Blueprint</h1>
        <div class="user-name cinzel">Dedicated to ${escapeHtml(safe.name, 'Seeker')}</div>
        
        <div style="margin-top: 40px; opacity: 0.7; font-size: 14px;">
            <p>Report ID: ${escapeHtml(orderId)}</p>
            <p>Celestial Alignment Date: ${escapeHtml(orderDate)}</p>
            <p style="margin-top: 15px; color: var(--gold); letter-spacing: 2px;">${escapeHtml(planLabel)}</p>
        </div>

        <div class="page-footer cinzel">OM KHUD KO JAANO</div>
    </div>

    <!-- PAGE 2: PERSONALIZED GREETING & NUMEROLOGY -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <div class="section-header">
            <h2 class="cinzel">The Divine Introduction</h2>
        </div>

        <div class="card" style="font-style: italic; font-weight: 300;">
            ${escapeHtml(safe.greeting, 'Your cosmic journey begins...')}
        </div>

        <div class="section-header" style="margin-top: 40px;">
            <h2 class="cinzel">Sacred Numerology</h2>
        </div>

        <div class="num-flex">
            <div class="card num-box">
                <div class="num-val">${escapeHtml(safe.mulank?.number, '0')}</div>
                <div class="card-header cinzel">Mulank (Psychic Number)</div>
                <h4 class="text-gold" style="margin-bottom: 10px;">${escapeHtml(safe.mulank?.title, 'Core Essence')}</h4>
                <p style="font-size: 14px; opacity: 0.9;">${safe.mulank?.description}</p>
            </div>
            <div class="card num-box">
                <div class="num-val">${escapeHtml(safe.bhagyank?.number, '0')}</div>
                <div class="card-header cinzel">Bhagyank (Destiny Number)</div>
                <h4 class="text-gold" style="margin-bottom: 10px;">${escapeHtml(safe.bhagyank?.title, 'Path of Destiny')}</h4>
                <p style="font-size: 14px; opacity: 0.9;">${safe.bhagyank?.description}</p>
            </div>
        </div>

        <div class="guru-vachan">
            ${escapeHtml(safe.mulank?.hinglishInsight)} ... ${escapeHtml(safe.bhagyank?.hinglishInsight)}
        </div>

        <div class="page-footer cinzel">ॐ Khud Ko Jaano — Confidential Astrology Report</div>
    </div>

    <!-- PAGE 3: ZODIAC IDENTITY -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <div class="section-header">
            <h2 class="cinzel">Celestial Identity</h2>
        </div>

        <div class="card">
            <div class="zod-header">
                <div class="zod-sign-icon zod-icon zod-${escapeHtml(safe.zodiacAnalysis?.sign, 'Star Sign')}"></div>
                <div>
                    <h3 class="cinzel text-gold" style="font-size: 32px;">${escapeHtml(safe.zodiacAnalysis?.sign, 'Star Sign')}</h3>
                    <p style="opacity: 0.7; letter-spacing: 2px; text-transform: uppercase;">
                        ${escapeHtml(safe.zodiacAnalysis?.element, 'Element')} Element &nbsp;•&nbsp; Ruled by ${escapeHtml(safe.zodiacAnalysis?.ruling_planet, 'Ruling Planet')}
                    </p>
                </div>
            </div>
            <p style="line-height: 1.8;">${safe.zodiacAnalysis?.description}</p>
        </div>

        <div class="section-header" style="margin-top: 40px;">
            <h2 class="cinzel">Janam Patrika Overview</h2>
        </div>

        <div class="horo-grid">
            <div class="card">
                <div class="card-header cinzel">Ascendant (Lagna)</div>
                <p class="text-gold cinzel" style="font-size: 20px;">${escapeHtml(safe.janamPatrika?.ascendant, 'Ascendant')}</p>
            </div>
            <div class="card">
                <div class="card-header cinzel">Moon Sign (Rashi)</div>
                <p class="text-gold cinzel" style="font-size: 20px;">${escapeHtml(safe.janamPatrika?.moonSign, 'Moon Sign')}</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header cinzel">Spiritual Portrait</div>
            <p style="line-height: 1.8;">${safe.janamPatrika?.overview}</p>
            <div class="guru-vachan" style="margin-top: 15px; border-bottom: 0;">
                ${escapeHtml(safe.janamPatrika?.hinglishInsight)}
            </div>
        </div>

        <div class="page-footer cinzel">Prepared exclusively for ${escapeHtml(safe.name, 'Seeker')}</div>
    </div>

    <!-- PAGE 4: PLANETARY ALIGNMENTS -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <div class="section-header">
            <h2 class="cinzel">Planetary Council</h2>
        </div>

        <div class="card" style="padding: 0;">
            <table class="planets-table">
                <thead>
                    <tr>
                        <th>Celestial Body</th>
                        <th>Position</th>
                        <th>Karmic Influence</th>
                    </tr>
                </thead>
                <tbody>
                    ${(safe.planetaryPositions || []).map(p => `
                        <tr>
                            <td class="cinzel text-gold">${escapeHtml(p.planet)}</td>
                            <td style="opacity: 0.8;">${escapeHtml(p.position)}</td>
                            <td style="font-size: 13px;">${escapeHtml(p.effect)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="guru-vachan">
            ${escapeHtml(safe.planetaryHinglishInsight)}
        </div>

        <p style="margin-top: 30px; font-size: 13px; font-style: italic; text-align: center; opacity: 0.6;">
            "The stars do not compel us, they guide us."
        </p>

        <div class="page-footer cinzel">OM KHUD KO JAANO</div>
    </div>

    <!-- PAGE 5: LUCKY ALIGNMENTS & GEMSTONES -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <div class="section-header">
            <h2 class="cinzel">Sacred Alignments</h2>
        </div>

        <div class="horo-grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px;">
            <div class="card text-center">
                <div class="card-header cinzel" style="font-size: 10px;">Lucky Color</div>
                <div class="cinzel text-gold" style="font-size: 14px;">${escapeHtml(safe.luckyTraits?.color)}</div>
            </div>
            <div class="card text-center">
                <div class="card-header cinzel" style="font-size: 10px;">Lucky Number</div>
                <div class="cinzel text-gold" style="font-size: 14px;">${escapeHtml(safe.luckyTraits?.number)}</div>
            </div>
            <div class="card text-center">
                <div class="card-header cinzel" style="font-size: 10px;">Lucky Day</div>
                <div class="cinzel text-gold" style="font-size: 14px;">${escapeHtml(safe.luckyTraits?.day)}</div>
            </div>
            <div class="card text-center">
                <div class="card-header cinzel" style="font-size: 10px;">Gemstone</div>
                <div class="cinzel text-gold" style="font-size: 14px;">${escapeHtml(safe.luckyTraits?.gemstone)}</div>
            </div>
        </div>

        <div class="guru-vachan" style="margin-bottom: 30px;">
            ${escapeHtml(safe.luckyTraits?.hinglishInsight)}
        </div>

        <div class="section-header">
            <h2 class="cinzel">Gemstone Prescription</h2>
        </div>

        <div class="card" style="border: 1px solid var(--gold); background: rgba(201, 168, 76, 0.1);">
            <div class="card-header cinzel" style="font-size: 18px; color: var(--gold-light);">Recommended: ${escapeHtml(safe.gemstoneRecommendation?.stone)}</div>
            <p style="margin-top: 10px; font-weight: bold; color: var(--gold);">Shakti: Why this stone?</p>
            <p style="font-size: 14px; line-height: 1.6; margin-bottom: 15px;">${escapeHtml(safe.gemstoneRecommendation?.benefits)}</p>
            
            <p style="font-weight: bold; color: var(--gold);">Vidhi: How to wear?</p>
            <p style="font-size: 14px; line-height: 1.6;">${escapeHtml(safe.gemstoneRecommendation?.wearing_instructions)}</p>
        </div>

        <div class="page-footer cinzel">Empower your aura — Khud Ko Jaano</div>
    </div>

    <!-- PAGE 6: THE YEAR AHEAD -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <div class="section-header">
            <h2 class="cinzel">The Flow of 2024-2025</h2>
        </div>

        <div class="card text-center" style="background: rgba(201, 168, 76, 0.15); border: 2px solid var(--gold);">
            <div class="card-header cinzel" style="border: 0;">Your Year Theme</div>
            <h3 style="font-style: italic; color: var(--silver);">${escapeHtml(safe.yearlyHoroscope?.theme)}</h3>
        </div>

        <div class="horo-grid">
            <div class="card">
                <div class="card-header cinzel">Career & Ambition</div>
                <p style="font-size: 13px;">${escapeHtml(safe.yearlyHoroscope?.career)}</p>
            </div>
            <div class="card">
                <div class="card-header cinzel">Love & Relations</div>
                <p style="font-size: 13px;">${escapeHtml(safe.yearlyHoroscope?.love)}</p>
            </div>
            <div class="card">
                <div class="card-header cinzel">Financial Growth</div>
                <p style="font-size: 13px;">${escapeHtml(safe.yearlyHoroscope?.finance)}</p>
            </div>
            <div class="card">
                <div class="card-header cinzel">Vitality & Health</div>
                <p style="font-size: 13px;">${escapeHtml(safe.yearlyHoroscope?.health)}</p>
            </div>
        </div>

        <div class="guru-vachan">
            ${escapeHtml(safe.yearlyHoroscope?.hinglishInsight)}
        </div>

        <div class="page-footer cinzel">ॐ Khud Ko Jaano — Celestial Timeline</div>
    </div>

    <!-- PAGE 7: THE DIVINE ANSWER -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <div class="section-header">
            <h2 class="cinzel">The Stars Speak</h2>
        </div>

        <div class="card" style="text-align: center; border-style: dashed;">
            <p style="opacity: 0.6; font-size: 12px; text-transform: uppercase;">Your Inquiry:</p>
            <h4 style="margin-top: 10px; font-style: italic; font-weight: 400;">"${escapeHtml(safe.specificQuestion)}"</h4>
        </div>

        <div class="answer-box cinzel" style="font-size: 16px; line-height: 1.8;">
            ${escapeHtml(safe.specificAnswer)}
        </div>

        <div class="page-footer cinzel">Soul Guidance for ${escapeHtml(safe.name, 'Seeker')}</div>
    </div>

    <!-- PAGE 8: SACRED REMEDIES -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <div class="section-header">
            <h2 class="cinzel">Sacred Remedies</h2>
        </div>

        ${(safe.remedies || []).map(r => `
            <div class="card">
                <div class="card-header cinzel">${escapeHtml(r.title)}</div>
                <p style="line-height: 1.6; font-size: 15px;">${escapeHtml(r.description)}</p>
            </div>
        `).join('')}

        <div class="guru-vachan">
            ${escapeHtml(safe.remedyHinglishInsight)}
        </div>

        <div class="page-footer cinzel">OM KHUD KO JAANO</div>
    </div>

    <!-- PAGE 9: KARMIC INSIGHTS (HINGLISH) -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <div class="section-header">
            <h2 class="cinzel">${escapeHtml(safe.hinglishKarmicInsights?.title, 'Karmic Insights')}</h2>
        </div>

        <div class="card" style="margin-top: 40px; padding: 40px; border-style: double; border-width: 3px;">
            <p style="font-size: 18px; line-height: 1.8; text-align: center; font-style: italic; color: var(--gold-light);">
                "${escapeHtml(safe.hinglishKarmicInsights?.content)}"
            </p>
        </div>

        <div class="page-footer cinzel">Karmic Journey of ${escapeHtml(safe.name, 'Seeker')}</div>
    </div>

    <!-- PAGE 10: DAILY GUIDANCE (HINGLISH) -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <div class="section-header">
            <h2 class="cinzel">${escapeHtml(safe.hinglishDailyTips?.title, 'Daily Mantra')}</h2>
        </div>

        <div class="card" style="background: rgba(201, 168, 76, 0.12); border: 2px solid var(--gold); padding: 50px;">
            <p style="font-size: 18px; line-height: 1.9; color: var(--silver); text-align: center;">
                ${escapeHtml(safe.hinglishDailyTips?.content)}
            </p>
        </div>

        <div class="page-footer cinzel">OM KHUD KO JAANO</div>
    </div>

    ${safe.plan === 'fasttrack' ? `
    <!-- PAGE: MAHADASHA (Premium only) -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
        <div class="section-header"><h2 class="cinzel">Mahadasha Analysis</h2></div>
        <div class="card" style="margin-top: 40px; border-left: 4px solid var(--gold); padding: 40px;">
            <p style="font-size: 16px; line-height: 1.8;">${escapeHtml(safe.mahadashaAnalysis)}</p>
        </div>
        <div class="page-footer cinzel">Priority Analysis — ${escapeHtml(safe.name)}</div>
    </div>

    <!-- PAGE: 10-YEAR TIMELINE (Premium only) -->
    <div class="page">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
        <div class="section-header"><h2 class="cinzel">10-Year Timeline</h2></div>
        <div class="card" style="background: rgba(201, 168, 76, 0.08); border-top: 2px solid var(--gold); margin-top: 40px; padding: 40px;">
            <p style="font-size: 16px; line-height: 1.8; color: var(--gold-light);">${escapeHtml(safe.tenYearTimeline)}</p>
        </div>
        <div class="page-footer cinzel">Future Projection — KKJ</div>
    </div>
    ` : ''}

    <!-- PAGE 11: CLOSING BLESSING -->
    <div class="page cover">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <div class="om-main" style="font-size: 100px;">ॐ</div>
        
        <div style="max-width: 80%; margin: 0 auto;">
            <p style="font-size: 28px; color: var(--gold); line-height: 1.5; margin-bottom: 30px; font-style: italic;">
                ${escapeHtml(safe.closingBlessing?.sanskrit, 'Om Shanti Shanti Shanti')}
            </p>
            <div style="width: 100px; height: 1px; background: var(--gold); margin: 30px auto;"></div>
            <p style="font-size: 18px; opacity: 0.8; font-style: italic;">
                "${escapeHtml(safe.closingBlessing?.translation, 'May peace be with you always.')}"
            </p>
        </div>

        <div style="margin-top: 60px;">
            <p class="cinzel" style="letter-spacing: 3px; font-size: 14px; opacity: 0.7;">May your stars always guide you home.</p>
            <h2 class="cinzel" style="color: var(--gold); margin-top: 10px;">Khud Ko Jaano</h2>
        </div>

        <div class="page-footer cinzel">End of Cosmic Blueprint — ${escapeHtml(safe.name, 'Seeker')}</div>
    </div>
</body>
</html>
    `;
};

module.exports = { getReportTemplate };
