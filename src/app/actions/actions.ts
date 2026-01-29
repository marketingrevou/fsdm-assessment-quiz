'use server'

import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

// Define type for the new leadgen1 table
type LeadgenData = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  m1q1_answer?: string;
  m1q2_answer?: string;
  m1q3_completed?: boolean;
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

// Unified function to save all data to leadgen1 table
export async function saveToLeadgen(data: {
  m1q1Answer?: string;
  m1q2Answer?: string;
  m1q3Completed?: boolean;
  meetingTwoScore?: number;
  meetingThreeScore?: number;
  essayAnswer?: string;
  motivationAnswer?: string;
}) {
  const userData = await getUserDataFromCookies()
  if (!userData) {
    throw new Error('User data not found in cookies')
  }

  // Prepare update data
  const updateData: Partial<LeadgenData> = {
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  }


  if (data.m1q1Answer !== undefined) updateData.m1q1_answer = data.m1q1Answer
  if (data.m1q2Answer !== undefined) updateData.m1q2_answer = data.m1q2Answer
  if (data.m1q3Completed !== undefined) updateData.m1q3_completed = data.m1q3Completed
  if (data.meetingTwoScore !== undefined) updateData.meeting_two_score = data.meetingTwoScore
  if (data.meetingThreeScore !== undefined) updateData.meeting_three_score = data.meetingThreeScore
  if (data.essayAnswer !== undefined) updateData.essay_answer = data.essayAnswer
  if (data.motivationAnswer !== undefined) updateData.motivation_answer = data.motivationAnswer

  // Check if record exists
  const { data: existingRecord } = await supabase
    .from('leadgen1')
    .select('id')
    .eq('email', userData.email)
    .maybeSingle()

  let result

  if (existingRecord) {
    // Update existing record
    const { data: updatedData, error } = await supabase
      .from('leadgen1')
      .update(updateData)
      .eq('id', existingRecord.id)
      .select()
      .single()

    if (error) throw error
    result = updatedData
  } else {
    // Insert new record
    const { data: insertedData, error } = await supabase
      .from('leadgen1')
      .insert([updateData])
      .select()
      .single()

    if (error) throw error
    result = insertedData
  }

  return result
}

export async function createPersonalDetails(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const whatsapp = formData.get('whatsapp') as string

  console.log('🔍 Debug - createPersonalDetails called with:', { name, email, whatsapp });

  // Only save if all required fields are present
  if (!name || !email || !whatsapp) {
    throw new Error('Name, email, and phone are required')
  }

  // Save to leadgen1 table
  const { data, error } = await supabase
    .from('leadgen1')
    .insert([{ name, email, phone: whatsapp }])
    .select()
    .single()

  console.log('🔍 Debug - createPersonalDetails result:', { data, error });

  if (error) {
    console.error('Error inserting personal details:', error)
    return { error }
  }

  // Set cookies for the user session
  const cookieStore = await cookies()
  cookieStore.set('userName', name, { path: '/', maxAge: 60 * 60 * 24 * 7 }) // 1 week
  cookieStore.set('userEmail', email, { path: '/', maxAge: 60 * 60 * 24 * 7 }) // 1 week
  cookieStore.set('userWhatsapp', whatsapp, { path: '/', maxAge: 60 * 60 * 24 * 7 }) // 1 week

  return { data }
}