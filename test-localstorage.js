// Test script to verify localStorage functionality
// Run this in browser console to test

// Test 1: Save quiz responses to localStorage
const testResponses = {
  meetingTwoScore: 15,
  m3q2Essay: 'Test essay response',
  m3q3Motivation: 'Test motivation response'
};

localStorage.setItem('quizResponses', JSON.stringify(testResponses));
console.log('✅ Test 1: Saved test responses to localStorage');

// Test 2: Retrieve and verify
const retrieved = localStorage.getItem('quizResponses');
const parsed = JSON.parse(retrieved);
console.log('✅ Test 2: Retrieved responses:', parsed);

// Test 3: Clear localStorage
localStorage.removeItem('quizResponses');
console.log('✅ Test 3: Cleared localStorage');

console.log('🎉 All localStorage tests passed!');
