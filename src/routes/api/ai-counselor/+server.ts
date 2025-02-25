import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import { env } from '$env/dynamic/private';

// Define interfaces for the user data
interface Activity {
  id: string;
  name: string;
  title: string;
  startGrade: string;
  endGrade: string;
  hoursPerWeek: number;
  weeksPerYear: number;
  description: string;
}

interface TestScore {
  id: string;
  name: string;
  score: string;
  date: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { 
      prompt, 
      school, 
      wordCount, 
      existingEssay, 
      includeUserInfo, 
      userActivities, 
      userTestScores 
    } = await request.json();

    // Validate required fields
    if (!prompt || !school || !wordCount) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Format user activities for the prompt if they exist and are to be included
    let userInfoText = '';
    if (includeUserInfo) {
      if (userActivities && userActivities.length > 0) {
        userInfoText += '\n\nStudent Activities:\n';
        userActivities.forEach((activity: Activity, index: number) => {
          userInfoText += `${index + 1}. ${activity.name}${activity.title ? ` - ${activity.title}` : ''} (Grades ${activity.startGrade}-${activity.endGrade})\n`;
          userInfoText += `   Hours per week: ${activity.hoursPerWeek}, Weeks per year: ${activity.weeksPerYear}\n`;
          if (activity.description) {
            userInfoText += `   Description: ${activity.description}\n`;
          }
        });
      }

      if (userTestScores && userTestScores.length > 0) {
        userInfoText += '\n\nStudent Test Scores:\n';
        userTestScores.forEach((test: TestScore, index: number) => {
          userInfoText += `${index + 1}. ${test.name}: ${test.score} (${test.date})\n`;
        });
      }
    }

    // Construct the system message based on whether we're editing or creating
    let systemMessage = '';
    if (existingEssay) {
      systemMessage = `You are an expert college admissions essay editor with years of experience helping students get into top universities. 
      
      Your task is to edit the provided essay for a ${school} application based on the prompt: "${prompt}". 
      The final essay should be approximately ${wordCount} words.
      
      EDITING GUIDELINES:
      - Maintain the student's authentic voice and core ideas while improving structure, clarity, and impact
      - Ensure the essay has a compelling narrative arc with a strong beginning, middle, and end
      - Make the essay more personal, reflective, and memorable
      - Remove clichés and generic statements; replace with specific, vivid details
      - Ensure the essay answers the prompt thoroughly while showcasing the student's unique qualities`;
      
      if (userInfoText) {
        systemMessage += `\n\nIMPORTANT - STUDENT BACKGROUND INFORMATION:${userInfoText}

        INSTRUCTIONS FOR USING STUDENT INFORMATION:
        - Strategically incorporate relevant activities and achievements that support the essay's theme
        - Don't simply list accomplishments; use them to illustrate character traits, growth, and qualifications
        - Connect the student's experiences to their interest in ${school} and their future goals
        - Use specific details from their activities to create vivid examples and anecdotes
        - Ensure the essay remains in the student's voice and perspective throughout`;
      }
    } else {
      systemMessage = `You are an expert college admissions essay writer with years of experience helping students get into top universities.
      
      Your task is to write a compelling essay for a ${school} application based on the prompt: "${prompt}". 
      The essay should be approximately ${wordCount} words.
      
      ESSAY WRITING GUIDELINES:
      - Create a personal, authentic-sounding essay with a distinctive voice that sounds like a thoughtful student
      - Develop a clear narrative structure with a compelling beginning, meaningful middle, and memorable conclusion
      - Focus on depth rather than breadth - explore one or two ideas thoroughly rather than many superficially
      - Show, don't tell - use specific examples, anecdotes, and details to illustrate points
      - Demonstrate self-reflection and personal growth
      - Avoid clichés and generic statements about the college or the student's future`;
      
      if (userInfoText) {
        systemMessage += `\n\nIMPORTANT - STUDENT BACKGROUND INFORMATION:${userInfoText}

        INSTRUCTIONS FOR USING STUDENT INFORMATION:
        - Craft a narrative that authentically incorporates the student's most relevant experiences
        - Select 1-2 activities or achievements that best align with the essay prompt and develop them in depth
        - Use specific details from their background to create vivid examples and anecdotes
        - Connect their experiences to their interest in ${school} and their future aspirations
        - Write in first person from the student's perspective, maintaining a natural, authentic voice
        - The essay should feel personal and specific to this student, not generic`;
      }
    }

    // Add additional guidance for both cases
    systemMessage += `\n\nFINAL QUALITY CHECK:
    - Ensure the essay directly addresses the prompt
    - Verify the essay showcases the student's unique qualities and perspective
    - Check that the essay feels authentic and personal, not generic
    - Confirm the essay has a clear structure and flows naturally
    - Make sure the essay is approximately ${wordCount} words`;

    // Construct the user message
    const userMessage = existingEssay 
      ? `Here is my current essay that needs editing for my ${school} application based on this prompt: "${prompt}"\n\n${existingEssay}`
      : `Please write a college admissions essay for my ${school} application based on this prompt: "${prompt}". The essay should be approximately ${wordCount} words.`;

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