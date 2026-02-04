import React, { useEffect, useState } from 'react';
import Image from 'next/image';


interface MeetingTransitionPopupProps {
  userName: string;
  onNext: () => void;
}

const MeetingTransitionPopup: React.FC<MeetingTransitionPopupProps> = ({ userName, onNext }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay for the animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 bg-[#FFDE3D] bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto text-center p-6 sm:p-8 transform transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}>
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4">
          <Image
            src="/GIF/ezgif.com-animated-gif-maker-10.gif"
            alt="Thank You"
            layout="fill"
            objectFit="contain"
            unoptimized
          />
        </div>
        
        <p className="text-gray-800 text-base sm:text-lg mb-6 font-medium">
          Terimakasih! Hasil diskusi ini akan aku sampaikan ke tim. 
          Aku sudah invite kamu ke Meeting selanjutnya untuk menganalisa hasil iklan ini ya.
        </p>
        
        <button 
          onClick={onNext}
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Berangkat ke Meeting 2!
        </button>
      </div>
    </div>
  );
};

export default MeetingTransitionPopup;
