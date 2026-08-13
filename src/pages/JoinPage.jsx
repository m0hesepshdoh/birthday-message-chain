import React, { useEffect, useMemo, useRef, useState } from 'react';
import { collection, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { joinTranslations } from '../data/joinTranslations.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LanguageToggleButton from '../components/LanguageToggleButton.jsx';
import WheelPicker from '../components/WheelPicker.jsx';


const BLOCKED_EMAIL = 'ug671431015@ftu.ac.th';
const BLOCKED_ATTEMPTS = 3;

const validateEmail = (email) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((hotmail|gmail|yahoo|icloud|ftu\.ac|outlook)\.(com|co\.uk|th|ca|de|fr|net|org|[a-z]{2,}))$/i.test(
    String(email).toLowerCase()
  );

const getIpAddress = async () => {
  try {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    return data.ip || '127.0.0.1';
  } catch {
    return '127.0.0.1';
  }
};

const daysInMonth = (monthIndex) =>
  monthIndex === 1 ? 29 : new Date(2024, monthIndex + 1, 0).getDate();

export default function JoinPage() {
  const { lang, isRTL } = useLanguage();
  const t = joinTranslations[lang];

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState(1);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [ipBlockError, setIpBlockError] = useState('');

  const days = useMemo(
    () => Array.from({ length: daysInMonth(selectedMonth) }, (_, i) => i + 1),
    [selectedMonth]
  );

  useEffect(() => {
    if (selectedDay > days.length) {
      setSelectedDay(days.length);
    }
  }, [days]);

  const handleMonthSelect = (index) => {
    setSelectedMonth(index);
  };

  const handleEmailChange = (e) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9@_+.\-\s]/g, '');
    setEmail(cleaned);
  };

  const selectedDateText = `${t.selectedDatePrefix}${t.months[selectedMonth]} ${selectedDay}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIpBlockError('');
    setEmailError('');
    setMessageError('');

    let hasErrors = false;
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!validateEmail(trimmedEmail)) {
      setEmailError(t.emailValidationError);
      hasErrors = true;
    } else if (trimmedEmail.toLowerCase() === BLOCKED_EMAIL.toLowerCase()) {
      setEmailError(lang === 'ar' ? 'هذا البريد الإلكتروني حقي' : 'This email address is mine.');
      hasErrors = true;
    }

    if (!trimmedMessage) {
      setMessageError(t.messageRequiredError);
      hasErrors = true;
    } else if (trimmedMessage.length > 100) {
      setMessageError(t.messageLengthError);
      hasErrors = true;
    }

    if (hasErrors) {
      setFormError(t.formGenericError);
      return;
    }

    setSubmitting(true);
    try {
      const ipAddress = await getIpAddress();
      const attemptsRef = doc(db, 'ipAttempts', ipAddress);
      const attemptsSnap = await getDoc(attemptsRef);

      if (attemptsSnap.exists() && attemptsSnap.data().attempts >= BLOCKED_ATTEMPTS) {
        setIpBlockError(t.ipBlockedError);
        setSubmitting(false);
        setTimeout(() => {
          window.location.href = '/hub';
        }, 8000);
        return;
      }

      await addDoc(collection(db, 'submissions'), {
        email: trimmedEmail,
        birthMonth: selectedMonth + 1,
        birthDay: selectedDay,
        message: trimmedMessage,
        likes: 0,
        timestamp: serverTimestamp(),
      });

      if (attemptsSnap.exists()) {
        await updateDoc(attemptsRef, { attempts: increment(1) });
      } else {
        await setDoc(attemptsRef, { attempts: 1, lastAttempt: serverTimestamp() });
      }

      setFormSuccess(t.formSuccessMessage);
      setEmail('');
      setMessage('');
      setSelectedMonth(0);
      setSelectedDay(1);

      setTimeout(() => {
        window.location.href = '/hub';
      }, 8000);
    } catch (error) {
      console.error('Error adding document: ', error);
      setFormError(t.formSubmitError);
    } finally {
      setSubmitting(false);
    }
  };

  const setupShareButtons = () => {
    const websiteUrl = window.location.href;
    return websiteUrl;
  };

  const [copyTooltip, setCopyTooltip] = useState('Copy Link');

  const handleCopyLink = async () => {
    const websiteUrl = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(websiteUrl);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = websiteUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopyTooltip('Copied!');
      setTimeout(() => setCopyTooltip('Copy Link'), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      window.prompt('Copy this URL:', websiteUrl);
    }
  };

  const handleWhatsappShare = () => {
    const websiteUrl = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(websiteUrl)}`, '_blank');
  };

  return (
    <>
      <Header
        activePage="join"
        logoTitle={t.logoTitle}
        navLabels={{ join: t.submitButtonText, hub: t.navHub, faq: t.navFAQ }}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
          <div className="p-4 sm:p-6 w-full">
            <div className="flex flex-col items-center mb-2">
              <h2 id="main-title" className="text-2xl font-semibold">
                {t.title}
              </h2>
            </div>

            <div className="mb-4 sm:mb-6">
              <p id="main-description" className={`text-black-600 main-description text-start grow${isRTL ? '' : ''}`}>
                {t.description}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-group">
                <label id="email-label" htmlFor="email" className="block text-black-700 text-sm font-bold mb-1 sm:mb-2">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t.emailPlaceholder}
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center${emailError ? ' border-red-500' : ''}`}
                />
                {emailError && <div id="email-error" className="error-message">{emailError}</div>}
              </div>

              <div className="form-group">
                <label id="birthday-label" className="block text-black-700 text-sm font-bold mb-1 sm:mb-2">
                  {t.birthdayLabel}
                </label>
                <div className="date-picker">
                  <div className="wheel-container">
                    <WheelPicker items={t.months} selectedIndex={selectedMonth} onSelect={handleMonthSelect} />
                    <WheelPicker items={days} selectedIndex={selectedDay - 1} onSelect={(i) => setSelectedDay(i + 1)} />
                  </div>
                  <div className="selected-date" id="selectedDate">
                    {selectedDateText}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label id="message-label" htmlFor="message" className="block text-black-700 text-sm font-bold mb-1 sm:mb-2">
                  {t.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={t.messagePlaceholder}
                  required
                  maxLength={300}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`border rounded w-full py-2 px-3 text-black-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none text-center${messageError ? ' border-red-500' : ''}`}
                />
                <p id="char-count" className="text-gray-500 text-xs text-right">
                  {message.length}/100 {t.charCountSuffix}
                </p>
                {messageError && <div id="message-error" className="error-message">{messageError}</div>}
              </div>

              <button
                id="submit-button"
                type="submit"
                disabled={submitting}
                className="bg-[#CF0820] hover:bg-[#9d0618] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full submit-button"
              >
                {submitting ? t.submitButtonJoining : t.submitButtonText}
              </button>

              {formSuccess && (
                <div id="form-success" className="text-green-500 text-center mt-4">
                  {formSuccess}
                </div>
              )}
              {formError && (
                <div id="form-error" className="text-red-500 text-center mt-4">
                  {formError}
                </div>
              )}
              {ipBlockError && (
                <div id="ipblockerror" className="text-red-500 text-center mt-4">
                  {ipBlockError}
                </div>
              )}
            </form>

            <p id="share-label" className="text-sm text-center mt-6 mb-2">
              {t.shareLabel}
            </p>
            <div className="share-buttons-container flex justify-center space-x-4 rtl:space-x-reverse mb-6" id="share-buttons">
              <button
                className="share-button bg-gray-600 hover:bg-gray-800 text-white p-2 rounded-full"
                id="copy-link-share"
                title="Copy Link"
                aria-label="Copy link to share"
                onClick={handleCopyLink}
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="3" width="13" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="7" y="7" width="13" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <span className="tooltip">{copyTooltip}</span>
              </button>

              <button
                className="share-button whatsapp-share bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                id="whatsapp-share"
                title={t.whatsappLabel}
                aria-label="Share on WhatsApp"
                onClick={handleWhatsappShare}
                type="button"
              >
                <svg height="20px" width="20px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 58">
                  <path style={{ fill: '#ffffff' }} d="M0,58l4.988-14.963C2.457,38.78,1,33.812,1,28.5C1,12.76,13.76,0,29.5,0S58,12.76,58,28.5 S45.24,57,29.5,57c-4.789,0-9.299-1.187-13.26-3.273L0,58z" />
                  <path style={{ fill: '#2CB742' }} d="M47.683,37.985c-1.316-2.487-6.169-5.331-6.169-5.331c-1.098-0.626-2.423-0.696-3.049,0.42 c0,0-1.577,1.891-1.978,2.163c-1.832,1.241-3.529,1.193-5.242-0.52l-3.981-3.981l-3.981-3.981c-1.713-1.713-1.761-3.41-0.52-5.242 c0.272-0.401,2.163-1.978,2.163-1.978c1.116-0.627,1.046-1.951,0.42-3.049c0,0-2.844-4.853-5.331-6.169 c-1.058-0.56-2.357-0.364-3.203,0.482l-1.758,1.758c-5.577,5.577-2.831,11.873,2.746,17.45l5.097,5.097l5.097,5.097 c5.577,5.577,11.873,8.323,17.45,2.746l1.758-1.758C48.048,40.341,48.243,39.042,47.683,37.985z" />
                </svg>
                <span className="tooltip">{t.whatsappLabel}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer
        title={t.footerTitle}
        description={t.footerDesc}
        joinLabel={t.submitButtonText}
        hubLabel={t.footerHub}
        faqLabel={t.footerFAQ}
        copyright={t.copyright}
      />

      <LanguageToggleButton />
    </>
  );
}
