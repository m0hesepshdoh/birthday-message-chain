
import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { faqTranslations } from "../data/faqTranslations.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import LanguageToggleButton from "../components/LanguageToggleButton.jsx";

export default function FaqPage() {
  const { lang, isRTL } = useLanguage();
  const t = faqTranslations[lang];

  const [activeIndex, setActiveIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const faqItems = [
    { question: t.faq1Question, answer: t.faq1Answer },
    { question: t.faq2Question, answer: t.faq2Answer },
    { question: t.faq3Question, answer: t.faq3Answer },
    { question: t.faq4Question, answer: t.faq4Answer },
    { question: t.faq5Question, answer: t.faq5Answer },
    { question: t.faq6Question, answer: t.faq6Answer },
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateEmail = (email) => {
    const emailValue = email.trim().toLowerCase();
    if (!emailValue.endsWith("@ftu.ac.th")) return false;
    const localPart = emailValue.split("@")[0];
    const digitCount = (localPart.match(/\d/g) || []).length;
    if (digitCount > 0 && digitCount !== 9) return false;
    return true;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormSuccess("");
    setFormError("");
    setFormErrors({});

    const errors = {};
    const { name, surname, email, message } = formData;

    if (!/^[a-zA-Z\s]*$/.test(name.trim())) {
      errors.name = t.nameError;
    }

    if (!/^[a-zA-Z\s]*$/.test(surname.trim())) {
      errors.surname = t.surnameError;
    }

    if (!validateEmail(email)) {
      errors.email = t.emailError;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, "contacts"), {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date(),
      });

      setFormSuccess(t.contactSuccessMessage);
      setFormData({ name: "", surname: "", email: "", message: "" });

      setTimeout(() => {
        setShowContactForm(false);
        setFormSuccess("");
      }, 1300);
    } catch (error) {
      console.error("Error adding document: ", error);
      setFormError(t.contactErrorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header
        activePage="faq"
        logoTitle={t.logoTitle}
        navLabels={{ join: t.navJoin, hub: t.navHub, faq: t.navFAQ }}
      />

      <main className="container mx-auto px-4 py-12 max-w-3xl flex-grow">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {t.pageTitle}
          </h1>
          <p className="text-gray-600">{t.pageSubtitle}</p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-[#CF0820] text-white rounded-md hover:bg-[#9d0618] transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {t.backButton}
            </a>
          </div>
        </header>

        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {faqItems.map((item, index) => (
            <section
              key={index}
              className={`faq-item p-6 border-b border-gray-200 last:border-b-0 ${activeIndex === index ? "active" : ""}`}
            >
              <header
                className="flex justify-between items-center cursor-pointer faq-question"
                onClick={() => toggleFaq(index)}
              >
                <h2 className="text-lg font-semibold">{item.question}</h2>
                <figure
                  className={`faq-toggle ${isRTL ? "mr-4 ml-0" : "ml-4"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 transition-transform ${activeIndex === index ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </figure>
              </header>
              <div
                className={`faq-answer text-gray-600 pt-0 overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? "max-h-[300px] pt-3" : "max-h-0"
                }`}
              >
                {typeof item.answer === "string" ? (
                  <p>{item.answer}</p>
                ) : (
                  <ol className="list-decimal pl-5">
                    {item.answer.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            </section>
          ))}
        </article>

        <section className="mt-12 text-center bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-3">{t.contactTitle}</h3>
          <p className="text-gray-600 mb-4">{t.contactSubtitle}</p>
          <button
            onClick={() => setShowContactForm(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {t.contactButton}
          </button>
        </section>
      </main>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowContactForm(false);
          }}
        >
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">
              {t.contactFormTitle}
            </h2>

            <form onSubmit={handleContactSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t.namePlaceholder}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.surnameLabel}
                </label>
                <input
                  type="text"
                  id="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  placeholder={t.surnamePlaceholder}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    formErrors.surname ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.surname && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.surname}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.emailPlaceholder}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.messageLabel}
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t.messagePlaceholder}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#CF0820] text-white py-2 px-4 rounded-md hover:bg-[#9d0618] transition disabled:opacity-50"
              >
                {submitting ? t.sendingButton : t.sendButton}
              </button>

              {formSuccess && (
                <p className="text-green-600 text-sm mt-2 text-center">
                  {formSuccess}
                </p>
              )}
              {formError && (
                <p className="text-red-600 text-sm mt-2 text-center">
                  {formError}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      <Footer
        title={t.footerTitle}
        description={t.footerDescription}
        joinLabel={t.footerJoin}
        hubLabel={t.footerHub}
        faqLabel={t.footerFAQ}
        copyright={t.copyright}
      />

      <LanguageToggleButton />
    </>
  );
}
