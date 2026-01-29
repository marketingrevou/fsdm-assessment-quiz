import React, { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import QuizResultPopup from './QuizResultPopup';
import { createPersonalDetails } from '@/app/actions/actions';
import Cookies from 'js-cookie';

interface RegistrationSceneProps {
  onBack: () => void;
  onNext: (data: { name: string; email: string; whatsapp: string }) => void;
}

const RegistrationScene: React.FC<RegistrationSceneProps> = ({ onBack, onNext }) => {
  const [isPending, startTransition] = useTransition();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });

  useEffect(() => {
    const storedName = Cookies.get('userName');
    const storedEmail = Cookies.get('userEmail');
    const storedWhatsapp = Cookies.get('userWhatsapp');
    if (storedName && storedEmail) {
      setFormData({ name: storedName, email: storedEmail, whatsapp: storedWhatsapp || '' });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData(e.target as HTMLFormElement);
      const result = await createPersonalDetails(formData);
      if (!result?.error) {
        setShowSuccessPopup(true);
      }
    });
  };

  const handleProceed = () => {
    setShowSuccessPopup(false);
    onNext(formData);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFDE3D] p-4 relative">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 px-2">
            Kenalan dulu yuk!
          </h2>
          <div className="w-full max-w-[200px] sm:max-w-[240px] mx-auto my-2 aspect-square relative">
            <Image
              src="/GIF/ezgif.com-animated-gif-maker-5.gif"
              alt="Registration"
              fill
              sizes="(max-width: 640px) 200px, 240px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Form Box */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  placeholder="Nama lengkap"
                />
              </div>
              
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  placeholder="0812-3456-7890"
                  pattern="[0-9]{3,4}-[0-9]{4}-[0-9]{3,4}"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  placeholder="contoh@email.com"
                />
              </div>
              
              <div className="flex flex-row items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="p-3 text-gray-600 hover:text-gray-800 focus:outline-none rounded-full hover:bg-gray-100 flex-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
                >
                  Lanjut <span className="ml-1">→</span>
                </button>
              </div>
            </form>
        </div>
      </div>

      <QuizResultPopup isVisible={showSuccessPopup} onClose={handleProceed}>
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-gray-200 shadow-xl">
          {/* Header */}
          <div className="bg-[#FFDE3D] p-4 flex justify-between items-center">
            <h3 className="text-lg font-bold">Yeay, berhasil!</h3>
            <button 
              onClick={handleProceed}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-green-500 w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold mb-2">Data kamu berhasil terkirim!</h3>
            <p className="text-gray-600 mb-6">
              Terima kasih sudah mengisi data diri. Sekarang kamu bisa melanjutkan ke tahap selanjutnya.
            </p>
            
            <button
              onClick={handleProceed}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Lanjut
            </button>
          </div>
        </div>
      </QuizResultPopup>
    </div>
  );
};

export default RegistrationScene;