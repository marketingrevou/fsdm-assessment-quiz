import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { gradeEssayOnly } from '@/app/actions/essayActions';
import { createPersonalDetails } from '@/app/actions/actions';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface ClosingSceneProps {
  userName: string;
  utmParams?: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
  };
}

const ClosingScene: React.FC<ClosingSceneProps> = ({ userName, utmParams }) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', birthdate: '', background: '' });

  useEffect(() => {
    // Check if user already has data in cookies
    const storedName = Cookies.get('userName');
    const storedEmail = Cookies.get('userEmail');
    const storedWhatsapp = Cookies.get('userWhatsapp');

    if (storedName && storedEmail && storedWhatsapp) {
      setFormData({ name: storedName, email: storedEmail, whatsapp: storedWhatsapp, birthdate: '', background: '' });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      console.log('🔍 Debug - Form data being submitted:', {
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp
      });

      // Get quiz responses from localStorage
      const quizResponses = localStorage.getItem('quizResponses');
      let quizData: {
        meetingTwoScore?: number;
        meetingThreeScore?: number;
        essayAnswer?: string;
        motivationAnswer?: string;
      } = {};
      
      if (quizResponses) {
        const responses = JSON.parse(quizResponses);
        console.log('🔍 Debug - Parsed quiz responses:', responses);

        // Prepare quiz data
        const updateData: {
          meetingTwoScore?: number;
          meetingThreeScore?: number;
          essayAnswer?: string;
          motivationAnswer?: string;
        } = {};

        // Add meeting two score if present
        if (responses.meetingTwoScore !== undefined && responses.meetingTwoScore !== 0) {
          console.log('🔍 Debug - Adding meetingTwoScore:', responses.meetingTwoScore);
          updateData.meetingTwoScore = responses.meetingTwoScore;
        }

        // Add essay answer and score if present
        if (responses.m3q2Essay?.trim()) {
          console.log('🔍 Debug - Adding essay answer:', responses.m3q2Essay);
          updateData.essayAnswer = responses.m3q2Essay;

          // Grade the essay using server action
          try {
            const gradedScore = await gradeEssayOnly(responses.m3q2Essay);
            console.log('🔍 Debug - Essay graded score:', gradedScore);
            if (typeof gradedScore === 'number' && !isNaN(gradedScore)) {
              updateData.meetingThreeScore = gradedScore;
            }
          } catch (error) {
            console.warn('⚠️ Essay grading failed, but saving essay answer anyway:', error);
          }
        }

        // Add motivation answer if present
        if (responses.m3q3Motivation?.trim()) {
          console.log('🔍 Debug - Adding motivation answer:', responses.m3q3Motivation);
          updateData.motivationAnswer = responses.m3q3Motivation;
        }

        quizData = updateData;
        console.log('🔍 Debug - Final quiz data:', quizData);
      }

      // Create single record with all data including UTM parameters
      console.log('🔍 Debug - Creating record with UTM params...', {
        name: formData.name,
        email: formData.email,
        phone: formData.whatsapp,
        ...quizData,
        ...utmParams
      });

      // Use createPersonalDetails action to save data with UTM parameters
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('whatsapp', formData.whatsapp);
      
      // Add UTM parameters if they exist
      if (utmParams?.utm_source) formDataToSend.append('utm_source', utmParams.utm_source);
      if (utmParams?.utm_medium) formDataToSend.append('utm_medium', utmParams.utm_medium);
      if (utmParams?.utm_campaign) formDataToSend.append('utm_campaign', utmParams.utm_campaign);
      if (utmParams?.utm_content) formDataToSend.append('utm_content', utmParams.utm_content);
      
      // Add birthdate and background
      formDataToSend.append('birthdate', formData.birthdate);
      formDataToSend.append('background', formData.background);

      if (quizData.meetingTwoScore !== undefined) {
        formDataToSend.append('meetingTwoScore', String(quizData.meetingTwoScore));
      }
      if (quizData.meetingThreeScore !== undefined) {
        formDataToSend.append('meetingThreeScore', String(quizData.meetingThreeScore));
      }
      if (quizData.essayAnswer !== undefined) {
        formDataToSend.append('essayAnswer', quizData.essayAnswer);
      }
      if (quizData.motivationAnswer !== undefined) {
        formDataToSend.append('motivationAnswer', quizData.motivationAnswer);
      }

      const { data, error } = await createPersonalDetails(formDataToSend);

      if (error) {
        console.error('❌ Error creating record:', error);
        throw error;
      }

      // Store user data in cookies early so subsequent server actions can read them
      Cookies.set('userName', formData.name);
      Cookies.set('userEmail', formData.email);
      Cookies.set('userWhatsapp', formData.whatsapp);

      console.log('🔍 Debug - Insert result:', { data, error });

      if (data) {
        console.log('✅ Record created successfully with all data');
        
        // Clear quiz responses from localStorage
        if (quizResponses) {
          localStorage.removeItem('quizResponses');
        }

        // Show success popup
        setShowSuccessPopup(true);
        
        // Track Lead event with Meta Pixel
        if (typeof window !== 'undefined' && 'fbq' in window) {
          (window as { fbq?: (event: string, action: string, data?: object) => void }).fbq?.('track', 'Lead', {
            content_name: 'Assessment Form Submission',
            content_category: 'Lead Generation'
          });
        }
      } else {
        console.error('❌ No record was created');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsPending(false);
    }
  };

  const handleProceed = () => {
    setShowSuccessPopup(false);
    // Open WhatsApp link directly
    window.open('https://wa.me/6281399100086?text=Halo!%20Saya%20mau%20jadwalkan%20waktu%20konsultasi%20hasil%20assessment%20Digital%20Marketing.', '_blank');
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between p-2 sm:p-4 bg-white relative overflow-hidden">
      {/* Yellow background shape */}
      <div className="absolute inset-0 bg-[#FFDE3D] -z-10" style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
      }} />

      {/* Registration Form */}
      <div className="w-full max-w-md lg:max-w-lg mx-auto flex flex-col items-center justify-center flex-grow relative z-10 py-2">
        {/* Logo */}
        <div className="w-14 h-14 relative mb-4">
          <Image
            src="/logorevou.png"
            alt="RevoU Logo"
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Selamat! 🎉
          </h2>
          <p className="text-black text-sm sm:text-base">
            Kamu sudah menyelesaikan quiz! Isi data diri kamu untuk melihat hasilnya.
          </p>
        </div>

        {/* Form Box */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
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
                placeholder="081234567890"
                pattern="[0-9]{10,13}"
              />
            </div>

            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir (MM/DD/YYYY)
              </label>
              <input
                type="text"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
                placeholder="MM/DD/YYYY"
                pattern="(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\d{4}"
              />
            </div>

            <div>
              <label htmlFor="background" className="block text-sm font-medium text-gray-700 mb-1">
                Dari pilihan berikut, mana yang paling menggambarkan situasi atau latar belakang kamu saat ini?
              </label>
              <select
                id="background"
                name="background"
                value={formData.background}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="" disabled>Pilih salah satu</option>
                <option value="Student">Student</option>
                <option value="Fresh Graduate">Fresh Graduate</option>
                <option value="Career Switcher">Career Switcher</option>
                <option value="Career Break">Career Break</option>
                <option value="Experienced Non-Job Seeker">Experienced Non-Job Seeker</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Other">Other</option>
              </select>
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Mengirim...' : 'Cek Hasil Assessment'}
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md lg:max-w-lg overflow-hidden border border-gray-200 shadow-xl">
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
                📞 Yuk konsultasi lebih lanjut tentang hasil assessmentmu dengan Counselor kami.
              </p>

              <button
                onClick={handleProceed}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Cek Hasil Assessment Saya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClosingScene;
