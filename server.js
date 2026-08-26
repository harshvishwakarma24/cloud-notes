import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint for AI Text Operations (Fix grammar, Make longer, Change tone, Translate, Replace)
app.post('/api/ai/suggest', async (req, res) => {
  try {
    const { action, text, targetTone, targetLanguage } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      let fallbackResult = text;
      if (action === 'fix-grammar') fallbackResult = `Creativity is not about perfection; It's about authenticity.`;
      else if (action === 'make-longer') fallbackResult = `${text}\n\nFurthermore, true creativity unfolds organically when we release judgment, embrace mindful observation, and allow original thoughts to breathe.`;
      else if (action === 'change-tone') fallbackResult = `Creativity thrives in raw expression, transcending rigid perfectionism.`;
      else if (action === 'translate') fallbackResult = `La creatividad no se trata de ser perfecto; se trata de autenticidad.`;
      else fallbackResult = `Creativity is not about perfection; It's about authenticity.`;

      return res.json({ result: fallbackResult });
    }

    let prompt = '';
    if (action === 'fix-grammar') {
      prompt = `Correct any spelling, punctuation, or grammatical errors in the following text while keeping a warm, natural, and serene tone. Return ONLY the corrected text without intro or explanations:\n\n"${text}"`;
    } else if (action === 'make-longer') {
      prompt = `Elaborate and expand thoughtfully on the following note excerpt, maintaining a meditative and beautiful writing style. Return ONLY the expanded text:\n\n"${text}"`;
    } else if (action === 'change-tone') {
      const tone = targetTone || 'poetic and calm';
      prompt = `Rewrite the following text in a ${tone} tone. Return ONLY the rewritten text:\n\n"${text}"`;
    } else if (action === 'translate') {
      const lang = targetLanguage || 'Spanish';
      prompt = `Translate the following text accurately into ${lang}. Return ONLY the translated text:\n\n"${text}"`;
    } else {
      prompt = `Improve and polish the following text to make it clear, concise, and authentic. Return ONLY the refined text:\n\n"${text}"`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a serene, poetic, and highly intelligent AI writing assistant for Cloud Notes. Provide clear, refined responses directly.',
      },
    });

    const result = response.text?.trim() || text;
    res.json({ result });
  } catch (error) {
    console.error('Gemini API Error in /api/ai/suggest:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI suggestion' });
  }
});

// API Endpoint for AI Companion (Summary, Improve writing, Make shorter, Q&A)
app.post('/api/ai/companion', async (req, res) => {
  try {
    const { noteTitle, noteContent, userQuery } = req.body;
    const ai = getGenAI();

    if (!ai) {
      if (userQuery) {
        return res.json({ answer: `In quiet observation regarding "${userQuery}": true clarity comes from focusing on what matters most in the present moment.` });
      }
      return res.json({
        summary: "A reflection on slowing down and choosing clarity over distraction.",
        improved: "Some days are for rushing, and some days are for remembering what truly matters. Today, I choose clarity over noise.",
        shorter: "Some days rush. Today, I choose clarity.",
      });
    }

    if (userQuery) {
      const prompt = `Context note title: "${noteTitle || ''}"\nContext note content: "${noteContent || ''}"\nUser question: "${userQuery}"\nProvide a peaceful, thoughtful, and insightful response.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });
      return res.json({ answer: response.text?.trim() });
    }

    const prompt = `Analyze the following note title and content:\nTitle: "${noteTitle}"\nContent: "${noteContent}"\n\nProvide 3 distinct sections in JSON format:
1. "summary": A brief 1-2 sentence overview of the note.
2. "improved": A polished, eloquently rewritten version of the note content.
3. "shorter": A brief 1-2 sentence summary/essence of the note.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let data = { summary: '', improved: '', shorter: '' };
    try {
      data = JSON.parse(response.text || '{}');
    } catch (e) {
      data = {
        summary: response.text || 'A reflection on finding calm and purpose.',
        improved: noteContent,
        shorter: noteContent.slice(0, 80) + '...',
      };
    }

    res.json(data);
  } catch (error) {
    console.error('Gemini API Error in /api/ai/companion:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI Companion request' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cloud Notes server running on http://localhost:${PORT}`);
  });
}

startServer();
