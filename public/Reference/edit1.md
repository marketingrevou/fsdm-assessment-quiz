uiz Answer Storage Fix - Walkthrough
Problem Summary
Quiz answers from Meeting 1 (M1Q1, M1Q2, M1Q3) were not being saved to Supabase, while registration data and Meeting 2/3 answers were being saved correctly.

Root Cause
The issue was in 
HomeClient.tsx
. Meeting 1 question handlers were receiving user answers but only logging them to the console instead of storing them in the responses state object:

// BEFORE (incorrect)
const handleM1Q1Next = (selectedOption: string | null) => {
  console.log('Selected option:', selectedOption);  // Only logs!
  setCurrentScene('m1q2');
};
Changes Made
1. Updated State Management in HomeClient.tsx
File: 
HomeClient.tsx

Expanded the responses state object:
const [responses, setResponses] = useState({
  m1q1Answer: '',           // NEW
  m1q2Answer: '',           // NEW
  m1q3Completed: false,     // NEW
  meetingTwoScore: 0,
  m3q2Essay: '',
  m3q3Motivation: ''
});
Updated Meeting 1 handlers to store answers:
const handleM1Q1Next = (selectedOption: string | null) => {
  console.log('M1Q1 - Selected option:', selectedOption);
  setResponses(prev => ({
    ...prev,
    m1q1Answer: selectedOption || ''  // NOW STORES THE ANSWER
  }));
  setCurrentScene('m1q2');
};
Similar updates were made for 
handleM1Q2Next
 and 
handleM1Q3Next
.

2. Updated Server Actions
File: 
actions.ts

Updated TypeScript type definition:
type LeadgenData = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  m1q1_answer?: string;      // NEW
  m1q2_answer?: string;      // NEW
  m1q3_completed?: boolean;  // NEW
  meeting_two_score?: number;
  meeting_three_score?: number;
  essay_answer?: string;
  motivation_answer?: string;
};
Updated saveToLeadgen function signature:
export async function saveToLeadgen(data: {
  m1q1Answer?: string;        // NEW
  m1q2Answer?: string;        // NEW
  m1q3Completed?: boolean;    // NEW
  meetingTwoScore?: number;
  meetingThreeScore?: number;
  essayAnswer?: string;
  motivationAnswer?: string;
})
Added data mapping:
if (data.m1q1Answer !== undefined) updateData.m1q1_answer = data.m1q1Answer
if (data.m1q2Answer !== undefined) updateData.m1q2_answer = data.m1q2Answer
if (data.m1q3Completed !== undefined) updateData.m1q3_completed = data.m1q3Completed
3. Updated ClosingScene Component
File: 
ClosingScene.tsx

Updated submitQuizResponses function:
Added Meeting 1 answer handling:

// Add Meeting 1 answers if present
if (responses.m1q1Answer) {
  console.log('🔍 Debug - Adding m1q1Answer:', responses.m1q1Answer);
  updateData.m1q1_answer = responses.m1q1Answer;
}
if (responses.m1q2Answer) {
  console.log('🔍 Debug - Adding m1q2Answer:', responses.m1q2Answer);
  updateData.m1q2_answer = responses.m1q2Answer;
}
if (responses.m1q3Completed !== undefined) {
  console.log('🔍 Debug - Adding m1q3Completed:', responses.m1q3Completed);
  updateData.m1q3_completed = responses.m1q3Completed;
}
4. Database Migration
File: 
add_meeting1_columns.sql

Created SQL migration script to add new columns to the leadgen1 table:

ALTER TABLE leadgen1
ADD COLUMN IF NOT EXISTS m1q1_answer TEXT,
ADD COLUMN IF NOT EXISTS m1q2_answer TEXT,
ADD COLUMN IF NOT EXISTS m1q3_completed BOOLEAN DEFAULT FALSE;
Required Actions
IMPORTANT

You must run the SQL migration in Supabase before testing!

Step 1: Run Database Migration
Open your Supabase project dashboard
Navigate to SQL Editor
Copy and paste the contents of 
add_meeting1_columns.sql
Click Run to execute the migration
Verify the columns were added by checking the leadgen1 table structure
Step 2: Test the Application
Start the dev server (already running at http://localhost:3000)
Open browser DevTools (F12) and go to the Console tab
Complete the quiz flow:
Answer Meeting 1 questions (M1Q1, M1Q2, M1Q3)
Answer Meeting 2 questions (M2Q1-M2Q7)
Answer Meeting 3 questions (M3Q1, M3Q2, M3Q3)
Check localStorage:
Open DevTools → Application → Local Storage
Look for the quizResponses key
Verify it contains all quiz answers including m1q1Answer, m1q2Answer, and m1q3Completed
Submit the registration form
Verify in Supabase:
Go to Supabase → Table Editor → leadgen1
Find your record by email
Confirm all quiz answer columns are populated
Expected Console Output
When testing, you should see these console logs:

M1Q1 - Selected option: [your answer]
M1Q2 - Selected option: [your answer]
M1Q3 - Drag and drop completed
🔍 Debug - Raw quizResponses from localStorage: {...}
🔍 Debug - Parsed quiz responses: {...}
🔍 Debug - Adding m1q1Answer: [your answer]
🔍 Debug - Adding m1q2Answer: [your answer]
🔍 Debug - Adding m1q3Completed: true
🔍 Debug - Adding meetingTwoScore: [score]
🔍 Debug - Adding essay answer: [essay]
🔍 Debug - Adding motivation answer: [motivation]
✅ Quiz responses saved successfully
Data Flow Diagram
selectedOption
setResponses
selectedOption
setResponses
completed
setResponses
scores
setResponses
essay/motivation
setResponses
JSON.stringify
reads
submitQuizResponses
User answers M1Q1
handleM1Q1Next
responses state
User answers M1Q2
handleM1Q2Next
User completes M1Q3
handleM1Q3Next
User answers M2Q1-M2Q7
handleM2QxNext
User answers M3Q2-M3Q3
handleM3QxNext
localStorage
User submits registration
Supabase leadgen1 table
Verification Checklist
 SQL migration executed successfully in Supabase
 Dev server is running without errors
 Browser console shows Meeting 1 answers being logged
 localStorage contains quizResponses with all quiz data
 Registration form submits successfully
 Supabase leadgen1 table shows all quiz answer columns populated
 No errors in browser console or server logs
Summary
The fix ensures that all quiz answers (Meeting 1, 2, and 3) are now:

✅ Captured in the responses state
✅ Saved to localStorage before registration
✅ Submitted to Supabase after registration
✅ Stored in the database with proper column mapping
The issue is now resolved, and all quiz data will be saved to Supabase along with the registration information.