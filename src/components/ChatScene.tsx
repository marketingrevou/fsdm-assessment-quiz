import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckDouble, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FaPaperPlane } from 'react-icons/fa';

import IntroPopup from './IntroPopup';
import Image from 'next/image';
import styles from './ChatScene.module.css';
import QuizResultPopup from './QuizResultPopup';

export interface ResponseOption {
  text: string;
  className?: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  responses?: (string | ResponseOption)[];
  showInvitation?: boolean;
}

interface ChatSceneProps {
  userName: string;
  onBack: () => void;
  onNext?: () => void;
}

const ChatScene: React.FC<ChatSceneProps> = ({ userName, onBack, onNext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [showIntroPopup, setShowIntroPopup] = useState(true);
  const [hasClickedPaperplane, setHasClickedPaperplane] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(100); // Start with a high number to avoid collisions

  // Conversation script with predefined responses
  const conversation: Message[] = useMemo(() => [
    { 
      id: 1,
      text: `Halo aku Ayu, owner dari kafe Kopi & Bunga Melati. Saya sedang butuh bantuan di Digital Marketing`,
      sender: 'bot' as const,
      timestamp: new Date(),
      responses: ['Halo salam kenal bu Ayu! Ada yang bisa saya bantu?']
    },
    { 
      id: 2,
      text: `Oke halo, jadi kami baru buka dan butuh bantuan di bidang Digital Marketing`,
      sender: 'bot' as const,
      timestamp: new Date()
    },
    { 
      id: 3,
      text: 'Tujuan bisnis kami 6 bulan ke depan:\n1. Meningkatkan interaksi online dengan pelanggan.\n2. Membangun kesadaran merek yang lebih luas di daerah lokal.\n3. Meningkatkan penjualan di toko fisik kami hingga 20%!',
      sender: 'bot' as const,
      timestamp: new Date(),
      responses: [{ text: 'Menarik sekali, apakah kafe ibu sudah punya Social Media?' }]
    },
    { 
      id: 4,
      text: 'Kami memiliki website sederhana, akun Instagram dan daftar email dengan interaksi yang lumayan',
      sender: 'bot' as const,
      timestamp: new Date(),
      responses: [{ text: 'Apakah sudah punya anggaran untuk marketing?' }]
    },
    { 
      id: 5,
      text: `Sudah, anggaran kami ada di Rp.5.000.000 per bulan, apakah bisa?`,
      sender: 'bot' as const,
      timestamp: new Date(),
      responses: [{
        text: 'Tentu saja!',
        className: 'tentuSajaButton'
      }]
    },
    { 
      id: 6,
      text: 'Baik! Saya sudah kirimkan undangan untuk Meeting 1 kita ya, sampai jumpa!',
      sender: 'bot' as const,
      timestamp: new Date(),
      showInvitation: true
    }
  ], [userName]); // Only recreate if userName changes

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle user response
  const handleResponse = (response: string) => {
    if (isBotResponding) return; // Prevent multiple responses while bot is responding
    
    const newMessage: Message = {
      id: nextId.current++,
      text: response,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsBotResponding(true);
    
    // Find the current bot message that has responses
    const currentBotMessage = [...messages, newMessage].reverse().find(
      (msg) => msg.sender === 'bot' && msg.responses
    );
    
    if (currentBotMessage) {
      // Find the next message in the conversation
      const nextMessage = conversation.find(
        (msg) => msg.id === currentBotMessage.id + 1
      );
      
      // If there's a next message, show typing indicator and then send it after a delay
      if (nextMessage) {
        // Show typing indicator
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, nextMessage]);
          
          // If the next message doesn't require a response and isn't the last message,
          // automatically send the next bot message with typing indicator
          if (!nextMessage.responses && nextMessage.id < conversation.length) {
            const followingMessage = conversation.find(msg => msg.id === nextMessage.id + 1);
            if (followingMessage) {
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  setMessages(prev => [...prev, followingMessage]);
                  setIsBotResponding(false);
                }, 1500);
              }, 1000);
              return;
            }
          }
          
          // Show invitation if this is the last message
          if (nextMessage.showInvitation) {
            setTimeout(() => setShowInvitation(true), 1000);
          }
          
          // Re-enable responses if the next message expects a response
          if (nextMessage.responses) {
            setIsBotResponding(false);
          }
        }, 1500);
      } else {
        // If no next message, re-enable responses
        setIsBotResponding(false);
      }
    } else {
      // If no current bot message found, re-enable responses
      setIsBotResponding(false);
    }

    // Reset the paperplane animation for the next bot message
    setHasClickedPaperplane(false);
  };

  // Handle proceeding to meeting cover
  const handleCloseIntroPopup = () => {
    setShowIntroPopup(false);
  };

  const handleProceedToMeeting = () => {
    setShowInvitation(false);
    // Call onNext if provided, otherwise use default navigation
    if (onNext) {
      onNext();
    } else {
      // Fallback to URL-based navigation if onNext is not provided
      if (userName) {
        window.location.href = `/?scene=meeting-cover&name=${encodeURIComponent(userName)}`;
      } else {
        window.location.href = '/?scene=meeting-cover';
      }
    }
  };

  // Simulate bot typing and send message
  const sendBotMessage = useCallback((message: Message) => {
    // Show typing indicator first
    setIsTyping(true);
    
    // After a delay, show the message
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, message]);
      
      // Reset the paperplane animation for new bot messages
      if (message.sender === 'bot') {
        setHasClickedPaperplane(false);
      }
      
      // If this bot message doesn't require a response and isn't the last message,
      // automatically send the next bot message with typing indicator
      if (!message.responses && !message.showInvitation && message.id < conversation.length) {
        const nextMessage = conversation.find(msg => msg.id === message.id + 1);
        if (nextMessage) {
          // Add a delay before showing typing for the next message
          setTimeout(() => {
            setIsTyping(true);
            // Then show the next message after typing delay
            setTimeout(() => {
              sendBotMessage(nextMessage);
            }, 1500);
          }, 1000);
        }
      }
      
      // Show invitation if this is the last message
      if (message.showInvitation) {
        setTimeout(() => setShowInvitation(true), 1000);
      }
    }, 1500); // Typing duration before showing the message
  }, [conversation]);

  // Start with first message when component mounts
  useEffect(() => {
    if (messages.length === 0 && conversation.length > 0) {
      // Show typing indicator before first message
      setIsTyping(true);
      
      // Then show the first message after a delay
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages([conversation[0]]);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, conversation]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className={styles.chatContainer}>
      {showIntroPopup && <IntroPopup onClose={handleCloseIntroPopup} />}
      {/* Chat header */}
      <div className={styles.chatHeader}>
        <button onClick={onBack} className={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className={styles.chatTitle}>
          <div className={styles.chatIcon}>
            <Image 
              src="/Ayu.png" 
              alt="Profile" 
              width={40} 
              height={40} 
              className={styles.profileImage}
            />
          </div>
          <div className={styles.chatTitleText}>
            <h2>Kopi & Bunga Melati</h2>
            <p>Online</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className={styles.chatBody} style={{ backgroundColor: '#FFDE3D' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageWrapper} ${
              message.sender === 'user' ? styles.userWrapper : styles.clientWrapper
            }`}
          >
            <div
              className={`${styles.messageBubble} ${
                message.sender === 'user' ? styles.userBubble : styles.clientBubble
              } ${message.text.length > 20 ? styles['force-wrap'] : ''}`}
            >
              {message.text.split('\n').map((line, i) => (
                <p key={i} className={styles.messageText}>
                  {line}
                </p>
              ))}
              <div className={styles.messageTime}>
                {formatTime(message.timestamp)}
                {message.sender === 'user' && (
                  <span className={styles.messageStatus}>
                    <FontAwesomeIcon 
                      icon={faCheckDouble} 
                      className={styles.messageStatusIcon}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className={styles.typingIndicator}>
            <div className={styles.typingDot}></div>
            <div className={styles.typingDot}></div>
            <div className={styles.typingDot}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Response options */}
      {(() => {
        const lastBotMessageWithResponses = [...messages].reverse().find(msg => msg.sender === 'bot' && msg.responses);
        const lastBotMessage = [...messages].reverse().find(msg => msg.sender === 'bot');

        if (lastBotMessageWithResponses && (lastBotMessage?.id === lastBotMessageWithResponses.id || isBotResponding)) {
          return (
          <div className={styles.chatInputArea} style={{ position: 'sticky', bottom: 0 }}>
            <div className={styles.responseContainer}>
              <button className={styles.inputIcon}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <div className={styles.responseButtons}>
                {lastBotMessageWithResponses.responses?.map((response, index) => {
                  const responseText = typeof response === 'string' ? response : response.text;
                  const responseClass = typeof response === 'string' ? '' : response.className || '';
                  
                  return (
                    <div 
                      key={index} 
                      className={`${styles.responseButton} ${responseClass ? styles[responseClass] : ''} ${isBotResponding ? styles.disabledButton : ''}`}
                      onClick={() => {
                        if (!isBotResponding) {
                          setHasClickedPaperplane(true);
                          handleResponse(responseText);
                        }
                      }}
                      style={{ cursor: isBotResponding ? 'not-allowed' : 'pointer' }}
                    >
                      <span className={styles.responseText}>{responseText}</span>
                      <div className={`${styles.sendButton} ${!hasClickedPaperplane ? styles.pulseButton : ''}`}>
                        <FaPaperPlane style={{ color: 'white' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          );
        }
        return null;
      })()}

      <QuizResultPopup isVisible={showInvitation} onClose={handleProceedToMeeting}>
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-[#FFDE3D] p-4 flex justify-between items-center">
            <h3 className="text-lg font-bold">Meeting 1</h3>
            <button 
              onClick={handleProceedToMeeting}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/GIF/ezgif.com-animated-gif-maker-9.gif"
                alt="Meeting Invitation"
                width={200}
                height={200}
                className="w-full max-w-xs h-auto"
              />
            </div>
            
            <button
              onClick={handleProceedToMeeting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Berangkat!
            </button>
          </div>
        </div>
      </QuizResultPopup>
    </div>
  );
};

export default ChatScene;
