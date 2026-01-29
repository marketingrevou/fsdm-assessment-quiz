'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WelcomeScene from '@/components/WelcomeScene';
import ChatScene from '@/components/ChatScene';
import MeetingCoverScene from '@/components/MeetingCoverScene';
import M1Q1Scene from '@/components/M1Q1Scene';
import M1Q2Scene from '@/components/M1Q2Scene';
import M1Q3Scene from '@/components/M1Q3Scene';
import MeetingTransitionPopup from '@/components/MeetingTransitionPopup';
import Meeting2CoverScene from '@/components/Meeting2CoverScene';
import M2Q1Scene from '@/components/M2Q1Scene';
import M2Q2Scene from '@/components/M2Q2Scene';
import M2Q3Scene from '@/components/M2Q3Scene';
import M2Q4Scene from '@/components/M2Q4Scene';
import M2Q5Scene from '@/components/M2Q5Scene';
import M2Q6Scene from '@/components/M2Q6Scene';
import M2Q7Scene from '@/components/M2Q7Scene';
import M2ToM3TransitionPopup from '@/components/M2ToM3TransitionPopup';
import Meeting3CoverScene from '@/components/Meeting3CoverScene';
import M3Q1Scene from '@/components/M3Q1Scene';
import M3Q2Scene from '@/components/M3Q2Scene';
import M3Q3Scene from '@/components/M3Q3Scene';
import ClosingScene from '@/components/ClosingScene';
import Cookies from 'js-cookie';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const [currentScene, setCurrentScene] = useState('welcome');
  const [userData, setUserData] = useState({ name: '', email: '' });
  
  // Store all responses in a single state object
  const [responses, setResponses] = useState({
    m1q1Answer: '',
    m1q2Answer: '',
    m1q3Completed: false,
    meetingTwoScore: 0,
    m3q2Essay: '',
    m3q3Motivation: ''
  });

  // Log scene changes for debugging
  useEffect(() => {
    console.log(`Scene changed to: ${currentScene}`);
  }, [currentScene]);

  // Handle URL parameters and cookies on initial load
  useEffect(() => {
    const scene = searchParams.get('scene');
    const name = searchParams.get('name');
    const storedName = Cookies.get('userName');
    const storedEmail = Cookies.get('userEmail');

    if (storedName && storedEmail) {
      setUserData({ name: storedName, email: storedEmail });
      setCurrentScene('chat');
    } else if (scene === 'meeting-cover') {
      setCurrentScene('meeting-cover');
      if (name) {
        setUserData(prev => ({ ...prev, name: decodeURIComponent(name) }));
      }
    }
  }, [searchParams]);

  // Scene navigation handlers
  const handleWelcomeNext = () => setCurrentScene('chat');

  const handleChatBack = () => setCurrentScene('welcome');
  
  const handleMeetingCoverBack = () => setCurrentScene('chat');
  
  const handleMeetingCoverNext = () => setCurrentScene('m1q1');

  const handleM1Q1Back = () => setCurrentScene('meeting-cover');
  
  const handleM1Q1Next = (selectedOption: string | null) => {
    console.log('M1Q1 - Selected option:', selectedOption);
    setResponses(prev => ({
      ...prev,
      m1q1Answer: selectedOption || ''
    }));
    setCurrentScene('m1q2');
  };

  const handleM1Q2Back = () => setCurrentScene('m1q1');
  
  const handleM1Q2Next = (selectedOption: string | null) => {
    console.log('M1Q2 - Selected option:', selectedOption);
    setResponses(prev => ({
      ...prev,
      m1q2Answer: selectedOption || ''
    }));
    setCurrentScene('m1q3');
  };

  const handleM1Q3Back = () => setCurrentScene('m1q2');
  
  const handleM1Q3Next = () => {
    console.log('M1Q3 - Drag and drop completed');
    setResponses(prev => ({
      ...prev,
      m1q3Completed: true
    }));
    setCurrentScene('meeting-transition');
  };

  const handleMeetingTransitionNext = () => setCurrentScene('meeting2-cover');

  const handleMeeting2CoverBack = () => setCurrentScene('m1q3');
  
  const handleMeeting2CoverNext = () => setCurrentScene('m2q1');

  // Meeting 2 question handlers
  const handleM2Q1Back = () => setCurrentScene('meeting2-cover');
  
  const handleM2Q1Next = (score: number) => {
    setResponses(prev => ({
      ...prev,
      meetingTwoScore: prev.meetingTwoScore + score
    }));
    setCurrentScene('m2q2');
  };

  const handleM2Q2Back = () => setCurrentScene('m2q1');
  
  const handleM2Q2Next = (score: number) => {
    setResponses(prev => ({
      ...prev,
      meetingTwoScore: prev.meetingTwoScore + score
    }));
    setCurrentScene('m2q3');
  };

  const handleM2Q3Back = () => setCurrentScene('m2q2');
  
  const handleM2Q3Next = (score: number) => {
    setResponses(prev => ({
      ...prev,
      meetingTwoScore: prev.meetingTwoScore + score
    }));
    setCurrentScene('m2q4');
  };

  const handleM2Q4Back = () => setCurrentScene('m2q3');
  
  const handleM2Q4Next = (score: number) => {
    setResponses(prev => ({
      ...prev,
      meetingTwoScore: prev.meetingTwoScore + score
    }));
    setCurrentScene('m2q5');
  };

  const handleM2Q5Back = () => setCurrentScene('m2q4');
  
  const handleM2Q5Next = (score: number) => {
    setResponses(prev => ({
      ...prev,
      meetingTwoScore: prev.meetingTwoScore + score
    }));
    setCurrentScene('m2q6');
  };

  const handleM2Q6Back = () => setCurrentScene('m2q5');
  
  const handleM2Q6Next = (score: number) => {
    setResponses(prev => ({
      ...prev,
      meetingTwoScore: prev.meetingTwoScore + score
    }));
    setCurrentScene('m2q7');
  };

  const handleM2Q7Back = () => setCurrentScene('m2q6');
  
  const handleM2Q7Next = (score: number) => {
    setResponses(prev => ({
      ...prev,
      meetingTwoScore: prev.meetingTwoScore + score
    }));
    setCurrentScene('m2tom3-transition');
  };

  const handleM2ToM3TransitionNext = () => setCurrentScene('meeting3-cover');

  const handleMeeting3CoverBack = () => setCurrentScene('m2q7');
  
  const handleMeeting3CoverNext = () => {
    console.log('Meeting 3 Cover - Next button clicked');
    setCurrentScene('m3q1');
  };

  const handleM3Q1Back = () => setCurrentScene('meeting3-cover');
  
  const handleM3Q1Next = () => {
    console.log('M3Q1 - Next button clicked');
    setCurrentScene('m3q2');
  };

  const handleM3Q2Back = () => setCurrentScene('m3q1');
  
  const handleM3Q2Next = (essay: string) => {
    setResponses(prev => ({
      ...prev,
      m3q2Essay: essay
    }));
    setCurrentScene('m3q3');
  };

  const handleM3Q3Back = () => setCurrentScene('m3q2');

  const handleM3Q3Next = async (motivation: string) => {
    // Store motivation response
    const updatedResponses = {
      ...responses,
      m3q3Motivation: motivation
    };
    setResponses(updatedResponses);
    
    // Store responses in localStorage for later submission after registration
    try {
      localStorage.setItem('quizResponses', JSON.stringify(updatedResponses));
      console.log('Quiz responses saved to localStorage:', updatedResponses);
      setCurrentScene('closing');
    } catch (error) {
      console.error('Error saving responses to localStorage:', error);
      alert('There was an error saving your responses. Please try again.');
    }
  };

  // Render the current scene
  return (
    <main>
      {currentScene === 'welcome' && (
        <WelcomeScene onNext={handleWelcomeNext} />
      )}
      
      {currentScene === 'chat' && (
        <ChatScene 
          userName={userData.name}
          onBack={handleChatBack}
          onNext={() => setCurrentScene('meeting-cover')}
        />
      )}
      
      {currentScene === 'meeting-cover' && (
        <MeetingCoverScene
          userName={userData.name}
          onBack={handleMeetingCoverBack}
          onNext={handleMeetingCoverNext}
        />
      )}
      
      {currentScene === 'm1q1' && (
        <M1Q1Scene
          onBack={handleM1Q1Back}
          onNext={handleM1Q1Next}
        />
      )}
      
      {currentScene === 'm1q2' && (
        <M1Q2Scene
          onBack={handleM1Q2Back}
          onNext={handleM1Q2Next}
        />
      )}
      
      {currentScene === 'm1q3' && (
        <M1Q3Scene 
          onBack={handleM1Q3Back}
          onNext={handleM1Q3Next}
        />
      )}
      
      {currentScene === 'meeting-transition' && (
        <MeetingTransitionPopup
          userName={userData.name}
          onNext={handleMeetingTransitionNext}
        />
      )}
      
      {currentScene === 'meeting2-cover' && (
        <Meeting2CoverScene
          userName={userData.name}
          onBack={handleMeeting2CoverBack}
          onNext={handleMeeting2CoverNext}
        />
      )}
      
      {currentScene === 'm2q1' && (
        <M2Q1Scene
          userName={userData.name}
          onBack={handleM2Q1Back}
          onNext={handleM2Q1Next}
        />
      )}
      
      {currentScene === 'm2q2' && (
        <M2Q2Scene
          userName={userData.name}
          onBack={handleM2Q2Back}
          onNext={handleM2Q2Next}
        />
      )}
      
      {currentScene === 'm2q3' && (
        <M2Q3Scene
          userName={userData.name}
          onBack={handleM2Q3Back}
          onNext={handleM2Q3Next}
        />
      )}
      
      {currentScene === 'm2q4' && (
        <M2Q4Scene
          userName={userData.name}
          onBack={handleM2Q4Back}
          onNext={handleM2Q4Next}
        />
      )}
      
      {currentScene === 'm2q5' && (
        <M2Q5Scene
          userName={userData.name}
          onBack={handleM2Q5Back}
          onNext={handleM2Q5Next}
        />
      )}
      
      {currentScene === 'm2q6' && (
        <M2Q6Scene
          userName={userData.name}
          onBack={handleM2Q6Back}
          onNext={handleM2Q6Next}
        />
      )}
      
      {currentScene === 'm2q7' && (
        <M2Q7Scene
          userName={userData.name}
          onBack={handleM2Q7Back}
          onNext={handleM2Q7Next}
        />
      )}
      
      {currentScene === 'm2tom3-transition' && (
        <M2ToM3TransitionPopup
          userName={userData.name}
          onNext={handleM2ToM3TransitionNext}
        />
      )}
      
      {currentScene === 'meeting3-cover' && (
        <Meeting3CoverScene
          userName={userData.name}
          onBack={handleMeeting3CoverBack}
          onNext={handleMeeting3CoverNext}
        />
      )}
      
      {currentScene === 'm3q1' && (
        <M3Q1Scene
          onBack={handleM3Q1Back}
          onNext={handleM3Q1Next}
          userName={userData.name}
        />
      )}
      
      {currentScene === 'm3q2' && (
        <M3Q2Scene
          onBack={handleM3Q2Back}
          onNext={handleM3Q2Next}
          userName={userData.name}
          meetingTwoScore={responses.meetingTwoScore}
        />
      )}
      
      {currentScene === 'm3q3' && (
        <M3Q3Scene
          onBack={handleM3Q3Back}
          onNext={handleM3Q3Next}
          userName={userData.name}
        />
      )}
      
      {currentScene === 'closing' && (
        <ClosingScene userName={userData.name} />
      )}
    </main>
  );
}
