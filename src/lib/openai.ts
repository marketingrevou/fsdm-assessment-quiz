import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function gradeEssay(essayContent: string): Promise<number> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set.');
    return 1; // Default to lowest score if API key is missing
  }

  const { GRADING_RUBRIC } = await import('./grading_rubrics');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // You can choose a different model if needed
      messages: [
        { role: 'system', content: GRADING_RUBRIC },
        { role: 'user', content: essayContent },
      ],
      temperature: 0.0, // Keep it deterministic for grading
      max_tokens: 1, // Expecting a single digit response
    });

    const scoreString = response.choices[0]?.message?.content?.trim();
    const score = parseInt(scoreString || '1', 10);

    // Ensure score is within 1-3 range
    if (score >= 1 && score <= 3) {
      return score;
    } else {
      console.warn(`AI returned an out-of-range score: ${scoreString}. Defaulting to 1.`);
      return 1;
    }
  } catch (error) {
    console.error('Error grading essay with OpenAI:', error);
    return 1; // Default to lowest score on error
  }
}
