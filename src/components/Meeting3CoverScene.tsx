import React from 'react';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';

interface Meeting3CoverSceneProps {
  userName: string;
  onBack: () => void;
  onNext: () => void;
}

const Meeting3CoverScene: React.FC<Meeting3CoverSceneProps> = ({ userName, onBack, onNext }) => {
  return (
    <div className="h-screen w-full flex flex-col bg-white relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-center sm:justify-start">
        <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
          <Image 
            src="/logorevou.png" 
            alt="RevoU Logo" 
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Yellow background shape */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#FFDE3D] -z-10" />

      {/* Main Content Area */}
      <div className="flex-grow w-full max-w-md mx-auto flex flex-col items-center justify-center text-center p-4">


        {/* Meeting Badge */}
        <div className="px-4 py-2 bg-[#FFDE3D] rounded-full inline-block mb-2 shadow-md">
          <span className="text-black text-base sm:text-lg font-bold">
            Meeting 3
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Creativity
        </h1>
        
        {/* Animated GIF */}
        <div className="w-full max-w-[240px] sm:max-w-[280px] aspect-square relative mb-2">
          <Image
            src="/GIF/ezgif.com-animated-gif-maker-4.gif"
            alt="Creativity"
            layout="fill"
            objectFit="contain"
            priority
            unoptimized
          />
        </div>
        
        {/* Greeting */}
        <p className="text-gray-700 text-sm sm:text-base px-4">
          Apa kabar?<br />
          Berkat bantuanmu pelanggan di kafe kami terus bertambah! Keren banget! 
        </p>
      </div>
      
      {/* Bottom Navigation */}
      <div className="w-full max-w-md mx-auto p-4 z-10 bg-white flex-shrink-0">
        <div className="flex flex-row gap-4 w-full">
          <button 
            onClick={onBack}
            className="h-12 w-12 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition duration-200 flex items-center justify-center flex-none shadow-md"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={onNext}
            className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center shadow-md"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default Meeting3CoverScene;
