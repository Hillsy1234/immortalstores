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
    const { world, characterName, origin, backstory, action, storyHistory } = JSON.parse(event.body || '{}');

    if (!world || !characterName || !action) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Build context from story history
    const historyContext = storyHistory && storyHistory.length > 0
      ? storyHistory.slice(-5).map((entry: any) => `${entry.type === 'action' ? 'Player' : 'Story'}: ${entry.content}`).join('\n')
      : '';

    // Create the prompt
    const prompt = `You are a creative dungeon master for an interactive RPG story set in a ${world} world.

Character: ${characterName}
Origin: ${origin}
Backstory: ${backstory}

Recent story:
${historyContext}

The player just did this action: "${action}"

Write a vivid, engaging response (2-3 paragraphs) that:
1. Describes what happens as a result of their action
2. Adds sensory details and atmosphere
3. Presents a new challenge or choice
4. Stays true to the ${world} theme

Keep it exciting and immersive!`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert storyteller and dungeon master. Create immersive, engaging narratives that respond to player actions. Keep responses concise but vivid (2-3 paragraphs). Always end with a new situation or choice for the player.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content || 'The story continues...';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response }),
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate story',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
