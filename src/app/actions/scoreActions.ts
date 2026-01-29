'use server'

import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { gradeEssay } from '@/lib/openai';
import { saveToLeadgen } from './actions';

// Define types for our database tables
type LeadgenData = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  meeting_two_score?: number;
  meeting_three_score?: number;
  essay_answer?: string;
  motivation_answer?: string;
};

// Helper function to get user data from cookies
async function getUserDataFromCookies(): Promise<{ name: string; email: string; phone: string } | null> {
  try {
    const cookieStore = await cookies()
    const name = cookieStore.get('userName')?.value
    const email = cookieStore.get('userEmail')?.value
    const phone = cookieStore.get('userWhatsapp')?.value

    if (!name || !email || !phone) {
      console.error('User name, email, or phone not found in cookies.')
      return null
    }

    return { name, email, phone }
  } catch (error) {
    console.error('Unexpected error in getUserDataFromCookies:', error)
    return null
  }
}



// Define a type for the response data
type ValidationResponse = {
  data: {
    essay_answer?: string;
    meeting_three_score?: number;
    motivation_answer?: string;
  };
  error?: string;
};

// Public API functions
export async function saveM3Q2Feedback(essayAnswer: string): Promise<ValidationResponse> {
  try {
    // Validate the essay answer
    if (!essayAnswer?.trim()) {
      throw new Error('Essay answer cannot be empty');
    }
    
    const gradedScore = await gradeEssay(essayAnswer);
    if (typeof gradedScore !== 'number' || isNaN(gradedScore)) {
      throw new Error('Invalid score returned from essay grading');
    }
    
    // Save to leadgen1 table
    await saveToLeadgen({
      essayAnswer: essayAnswer,
      meetingThreeScore: gradedScore
    });
    
    return { 
      data: {
        essay_answer: essayAnswer,
        meeting_three_score: gradedScore
      }
    };
  } catch (error) {
    console.error('Error saving essay:', error);
    return { 
      data: {},
      error: error instanceof Error ? error.message : 'Failed to save essay'
    };
  }
}

export async function saveM3Q3Feedback(motivationAnswer: string): Promise<ValidationResponse> {
  try {
    // Validate the motivation answer
    if (!motivationAnswer?.trim()) {
      throw new Error('Motivation answer cannot be empty');
    }
    
    // Save to leadgen1 table
    await saveToLeadgen({
      motivationAnswer: motivationAnswer
    });
    
    return { 
      data: { 
        motivation_answer: motivationAnswer 
      }
    };
  } catch (error) {
    console.error('Error saving motivation:', error);
    return { 
      data: {},
      error: error instanceof Error ? error.message : 'Failed to save motivation'
    };
  }
}

type ActionResponse = {
  data?: LeadgenData;
  error?: string;
};

export async function saveMeetingTwoScore(score: number): Promise<ActionResponse> {
  try {
    if (typeof score !== 'number' || isNaN(score)) {
      throw new Error('Invalid score provided');
    }
    
    // Save to leadgen1 table
    const result = await saveToLeadgen({ meetingTwoScore: score });
    return { data: result as LeadgenData };
  } catch (error) {
    console.error('Error in saveMeetingTwoScore:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to save meeting two score' 
    };
  }
}

export async function getScoresForCurrentUser() {
  try {
    const userData = await getUserDataFromCookies()
    if (!userData) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('leadgen1')
      .select('meeting_two_score, meeting_three_score')
      .eq('email', userData.email)
      .single();

    if (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }

    return {
      meetingTwoScore: data?.meeting_two_score || 0,
      meetingThreeScore: data?.meeting_three_score || 0
    };
  } catch (error) {
    console.error('Error in getScoresForCurrentUser:', error);
    return {
      meetingTwoScore: 0,
      meetingThreeScore: 0,
      error: 'An unexpected error occurred'
    };
  }
}
