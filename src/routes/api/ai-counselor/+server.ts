import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import { env } from '$env/dynamic/private';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt, school, wordCount, existingEssay } = await request.json();

    // Validate required fields
    if (!prompt || !school || !wordCount) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct the system message based on whether we're editing or creating
    let systemMessage = '';
    if (existingEssay) {
      systemMessage = `You are an expert college admissions essay editor. Edit the provided essay for a ${school} application based on the prompt: "${prompt}". 
      The final essay should be approximately ${wordCount} words. 
      Maintain the student's voice and core ideas while improving structure, clarity, and impact.
      Focus on making the essay more compelling and authentic.`;
    } else {
      systemMessage = `You are an expert college admissions essay writer. Write a compelling essay for a ${school} application based on the prompt: "${prompt}". 
      The essay should be approximately ${wordCount} words.
      Create a personal, authentic-sounding essay that showcases the applicant's unique voice.
      Include specific details and personal reflections that would make the essay stand out.
      The essay should be well-structured with a clear introduction, body, and conclusion.`;
    }

    // Construct the user message
    const userMessage = existingEssay 
      ? `Here is my current essay that needs editing:\n\n${existingEssay}`
      : `Please write a college admissions essay for ${school} based on the prompt: "${prompt}". The essay should be approximately ${wordCount} words.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: Math.min(4000, wordCount * 6), // Estimate tokens based on word count
    });

    // Extract the generated essay from the response
    const essay = response.choices[0]?.message?.content || '';

    return json({ essay });
  } catch (error) {
    console.error('Error generating essay:', error);
    return json({ error: 'Failed to generate essay' }, { status: 500 });
  }
}; 