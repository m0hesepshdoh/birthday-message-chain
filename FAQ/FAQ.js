function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    faqItem.classList.toggle('active');
}

// Open first FAQ by default
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.faq-item').classList.add('active');

    // Mobile menu toggle
    document.getElementById('mobileMenuBtn').addEventListener('click', function () {
        const menu = document.getElementById('mobileMenu');
        menu.classList.toggle('hidden');
    });
});

// FAQ.js
let currentLang = localStorage.getItem('selectedLanguage') || 'en';

function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    faqItem.classList.toggle('active');
}

async function translatePage() {
    // Only translate if language is Arabic
    if (currentLang !== 'ar') return;

    // Check if we've already translated (prevent duplicate calls)
    if (document.documentElement.classList.contains('translated')) return;
    document.documentElement.classList.add('translated');

    const elementsToTranslate = [
        // Main heading and subheading
        { selector: 'header.text-center h1', text: 'Frequently Asked Questions' },
        { selector: 'header.text-center p', text: 'Find answers to common questions about the Birthday Message Chain' },
        { selector: 'header.text-center a', text: 'Back to Home' },

        // FAQ items
        { selector: '.faq-item:nth-child(1) h3', text: 'What is the Birthday Message Chain?' },
        { selector: '.faq-item:nth-child(1) p', text: 'The Birthday Message Chain is a community project where people share birthday wishes. When you submit a message, you\'ll receive a random birthday message from someone else on your special day!' },

        { selector: '.faq-item:nth-child(2) h3', text: 'How does it work?' },
        { selector: '.faq-item:nth-child(2) p', text: '1. Submit your birthday and a heartfelt message<br>2. Your message gets added to our database<br>3. On your birthday, we\'ll email you a random message from another participant<br>4. Your message will be shared with someone else on their birthday' },

        { selector: '.faq-item:nth-child(3) h3', text: 'Is my personal information safe?' },
        { selector: '.faq-item:nth-child(3) p', text: 'We take privacy seriously. We only collect your email and birthday (month/day, not year). Your email will only be used to send you a birthday message and will never be shared publicly or with third parties.' },

        { selector: '.faq-item:nth-child(4) h3', text: 'Can I submit multiple messages?' },
        { selector: '.faq-item:nth-child(4) p', text: 'To keep it fair for everyone, we limit submissions to one message per email address. This helps ensure everyone gets a unique message on their birthday.' },

        { selector: '.faq-item:nth-child(5) h3', text: 'What should I write in my message?' },
        { selector: '.faq-item:nth-child(5) p', text: 'Write something kind, uplifting, and birthday-appropriate! Some ideas:<br>- "May your birthday be as wonderful as you are!"<br>- "Wishing you a year filled with joy and success!"<br>- "Hope your special day is as amazing as you deserve!"<br>Keep it positive and under 100 characters.' },

        { selector: '.faq-item:nth-child(6) h3', text: 'Can I delete my message later?' },
        { selector: '.faq-item:nth-child(6) p', text: 'Yes! If you\'d like to remove your message from the chain, simply email us at <a href="mailto:support@birthdaychain.com" class="text-[#CF0820] hover:underline">support@birthdaychain.com</a> from the address you used to submit and we\'ll remove your entry.' },

        // Contact section
        { selector: '.mt-12.text-center h3', text: 'Still have questions?' },
        { selector: '.mt-12.text-center p', text: 'We\'re happy to help! Contact our support team.' },
        { selector: '.mt-12.text-center a', text: 'Email Support' },

        // Footer
        { selector: '#footer-logo-desc span', text: 'Birthday Message Chain' },
        { selector: '#footer-logo-desc p', text: 'Making birthdays special since 2024' },
        { selector: '#footer-links a:nth-child(1)', text: 'Join Now' },
        { selector: '#footer-links a:nth-child(2)', text: 'Message Hub' },
        { selector: '#footer-links a:nth-child(3)', text: 'Privacy' },
        { selector: '#footer-links a:nth-child(4)', text: 'FAQ' }
    ];

    for (const element of elementsToTranslate) {
        const el = document.querySelector(element.selector);
        if (el) {
            try {
                const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(element.text)}&langpair=en|ar`);
                const data = await response.json();
                if (data.responseData && data.responseData.translatedText) {
                    el.innerHTML = data.responseData.translatedText;
                }
            } catch (error) {
                console.error('Translation error:', error);
            }
        }
    }

    // Set RTL direction
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
}

document.addEventListener('DOMContentLoaded', function () {
    // Get language preference from localStorage
    currentLang = localStorage.getItem('selectedLanguage') || 'en';

    // Add language toggle button functionality
    const toggleLangBtn = document.getElementById('toggleLangBtn');
    if (toggleLangBtn) {
        // Set initial button text (use shorter text for floating button)
        const langText = document.getElementById('langToggleText');
        langText.textContent = currentLang === 'en' ? 'ع' : 'EN';

        // Add tooltip
        toggleLangBtn.setAttribute('title', currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English');

        toggleLangBtn.addEventListener('click', function () {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            localStorage.setItem('selectedLanguage', currentLang);

            // Update button immediately
            langText.textContent = currentLang === 'en' ? 'ع' : 'EN';
            toggleLangBtn.setAttribute('title', currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English');

            // Translate or revert translation
            if (currentLang === 'ar') {
                translatePage();
            } else {
                location.reload(); // Refresh to return to English
            }
        });
    }
});