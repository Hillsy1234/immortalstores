import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { world, characterName, origin } = JSON.parse(event.body || '{}');

    if (!world || !characterName || !origin) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Generate backstory only
    const prompt = `Create a compelling character backstory for an interactive RPG.

Character Name: ${characterName}
World: ${world}
Origin: ${origin}

Write a rich, 2-3 paragraph backstory that:
1. Explains their past and how they became who they are
2. Includes a defining moment or challenge they overcame
3. Hints at their motivations and goals
4. Fits the ${world} theme perfectly

Make it personal, emotional, and inspiring for storytelling.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a creative writer specializing in character development. Create rich, compelling backstories that inspire players to tell their own stories. Keep it 2-3 paragraphs.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 250,
    });

    const backstory = completion.choices[0]?.message?.content || 'A mysterious past shrouds this character...';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ backstory }),
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate backstory',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
