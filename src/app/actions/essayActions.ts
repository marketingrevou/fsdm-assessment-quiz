'use server'

import { gradeEssay } from '@/lib/openai';

export async function gradeEssayOnly(essayContent: string): Promise<number> {
  try {
    const score = await gradeEssay(essayContent);
    return score;
  } catch (error) {
    console.error('Error grading essay:', error);
    return 1; // Default to lowest score on error
  }
}
