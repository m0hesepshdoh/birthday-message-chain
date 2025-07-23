// Toggle FAQ item visibility when clicked
function toggleFAQ(element) {
    // Find the closest parent element with class 'faq-item'
    const faqItem = element.closest('.faq-item');
    // Toggle the 'active' class on the FAQ item
    faqItem.classList.toggle('active');
}

// Open first FAQ by default when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Add 'active' class to the first FAQ item
    document.querySelector('.faq-item').classList.add('active');

    // Mobile menu toggle functionality
    document.getElementById('mobileMenuBtn').addEventListener('click', function () {
        // Get mobile menu element
        const menu = document.getElementById('mobileMenu');
        // Toggle 'hidden' class on the menu
        menu.classList.toggle('hidden');
    });
});

// FAQ.js
// Get current language from localStorage or default to English ('en')
let currentLang = localStorage.getItem('selectedLanguage') || 'en';

// Function to translate page content to Arabic
async function translatePage() {
    // Only translate if language is Arabic
    if (currentLang !== 'ar') return;
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if we've already translated (prevent duplicate calls)
    if (document.documentElement.classList.contains('translated')) return;
    // Mark document as translated
    document.documentElement.classList.add('translated');

    // Array of elements to translate with their selectors and English text
    const elementsToTranslate = [
        // Main heading and subheading
        { selector: 'header.text-center h1', text: 'Frequently Asked Questions' },
        { selector: 'header.text-center p', text: 'Find answers to common questions about the Birthday Message Chain' },
        { selector: 'header.text-center a', text: 'Back To Join' },
        { selector: '.logo', text: 'Chain' },
        { selector: 'nav.flex.justify-between.items-center a[href="../index.html"]', text: 'Join Now' },
        { selector: 'nav.flex.justify-between.items-center a[href="../hub/hub.html"]', text: 'Message Hub' },
        { selector: '#mobileMenu a[href="../index.html"]', text: 'Join Now' },
        { selector: '#mobileMenu a[href="../hub/hub.html"]', text: 'Message Hub' },

        // FAQ items
        { selector: '.faq-item:nth-child(1) h2', text: 'What is the Birthday Message Chain?' },
        { selector: '.faq-item:nth-child(1) .faq-answer p', text: 'The Birthday Message Chain is a community project where people share birthday wishes. When you submit a message, you\'ll receive a random birthday message from someone else on your special day!' },

        { selector: '.faq-item:nth-child(2) h2', text: 'How does it work?' },
        { selector: '.faq-item:nth-child(2) .faq-answer', text: '1. Submit your birthday and a heartfelt message\n2. Your message gets added to our database\n3. On your birthday, we\'ll email you a random message from another participant\n4. Your message will be shared with someone else on their birthday' },

        { selector: '.faq-item:nth-child(3) h2', text: 'Is my personal information safe?' },
        { selector: '.faq-item:nth-child(3) .faq-answer p', text: 'We take privacy seriously. We only collect your email and birthday (month/day, not year). Your email will only be used to send you a birthday message and will never be shared publicly or with third parties.' },

        { selector: '.faq-item:nth-child(4) h2', text: 'Can I submit multiple messages?' },
        { selector: '.faq-item:nth-child(4) .faq-answer p', text: 'To keep it fair for everyone, we limit submissions to one message per email address. This helps ensure everyone gets a unique message on their birthday.' },

        { selector: '.faq-item:nth-child(5) h2', text: 'What should I write in my message?' },
        { selector: '.faq-item:nth-child(5) .faq-answer p', text: 'Write something kind, uplifting, and birthday-appropriate! Some ideas:\n- "May your birthday be as wonderful as you are!"\n- "Wishing you a year filled with joy and success!"\n- "Hope your special day is as amazing as you deserve!"\nKeep it positive and under 100 characters.' },

        { selector: '.faq-item:nth-child(6) h2', text: 'Can I delete my message later?' },
        { selector: '.faq-item:nth-child(6) .faq-answer p', text: 'Yes! If you\'d like to remove your message from the chain, simply email us at ug671431015@ftu.ac.th from the address you used to submit and we\'ll remove your entry.' },
        // Contact section
        { selector: '.mt-12.text-center h3', text: 'Still have questions?' },
        { selector: '.mt-12.text-center p', text: 'We\'re happy to help! Contact our support team.' },
        { selector: '.mt-12.text-center a', text: 'Email Support' },

        // Footer
        { selector: '#footer-links a[href="../index.html"]', text: 'Join Now' },
        { selector: '#footer-links a[href="../hub/hub.html"]', text: 'Message Hub' },
        { selector: '#footer-logo-desc span', text: 'Birthday Message Chain' },
        { selector: '#footer-logo-desc p', text: 'Making birthdays special since 2024' }
    ];

    // Translate each element in the array
    for (const element of elementsToTranslate) {
        const el = document.querySelector(element.selector);
        if (el) {
            try {
                // Fetch translation from MyMemory API
                const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(element.text)}&langpair=en|ar`);
                const data = await response.json();
                if (data.responseData && data.responseData.translatedText) {
                    // Update element with translated text
                    el.innerHTML = data.responseData.translatedText;
                }
            } catch (error) {
                console.error('Translation error:', error);
            }
        }
    }

    // Set RTL (Right-to-Left) direction for Arabic
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    document.documentElement.classList.add('rtl');

    // Update language toggle button text
    const langText = document.getElementById('langToggleText');
    langText.textContent = '🌍';
    document.getElementById('toggleLangBtn').setAttribute('title', 'Switch to English');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get language preference from localStorage
    currentLang = localStorage.getItem('selectedLanguage') || 'en';

    // Translate immediately if Arabic is selected
    if (currentLang === 'ar') {
        translatePage();
    }

    // Add language toggle button functionality
    const toggleLangBtn = document.getElementById('toggleLangBtn');
    if (toggleLangBtn) {
        // Set initial button text based on current language
        const langText = document.getElementById('langToggleText');
        langText.textContent = currentLang === 'en' ? '🇵🇸' : '🌍';
        toggleLangBtn.setAttribute('title', currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English');

        // Toggle language when button is clicked
        toggleLangBtn.addEventListener('click', function () {
            // Switch between English and Arabic
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            // Save preference to localStorage
            localStorage.setItem('selectedLanguage', currentLang);

            if (currentLang === 'ar') {
                // Set Arabic layout (RTL)
                document.documentElement.dir = 'rtl';
                document.documentElement.lang = 'ar';
                document.body.classList.add('rtl');
                translatePage();
            } else {
                // Revert to English layout (LTR)
                document.documentElement.dir = 'ltr';
                document.documentElement.lang = 'en';
                document.body.classList.remove('rtl');
                location.reload();
            }

            // Update button immediately
            langText.textContent = currentLang === 'en' ? '🇵🇸' : '🌍';
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