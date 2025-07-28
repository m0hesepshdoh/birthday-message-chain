// Toggle FAQ item visibility when clicked
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    faqItem.classList.toggle('active');
}

// Get current language from localStorage or default to English ('en')
let currentLang = localStorage.getItem('selectedLanguage') || 'en';

// Function to translate page content to Arabic
async function translatePage() {
    if (currentLang !== 'ar') return;

    // Wait for DOM to be fully ready
    await new Promise(resolve => setTimeout(resolve, 500));

    if (document.documentElement.classList.contains('translated')) return;
    document.documentElement.classList.add('translated');

    // Elements to translate with corrected selectors
    const elementsToTranslate = [
        // Main heading and subheading
        { selector: 'main header h1', text: 'الأسئلة المتكررة' },
        { selector: 'main header p', text: 'اعثر على إجابات للأسئلة الشائعة حول سلسلة رسائل عيد الميلاد' },
        { selector: 'main header a', text: 'العودة للانضمام' },
        
        // Navigation
        { selector: 'nav a[href="../index.html"]', text: 'انضم الآن' },
        { selector: 'nav a[href="../hub/hub.html"]', text: 'مركز الرسائل' },
        { selector: '#mobileMenu a[href="../index.html"]', text: 'انضم الآن' },
        { selector: '#mobileMenu a[href="../hub/hub.html"]', text: 'مركز الرسائل' },

        // FAQ questions - direct translation
        { selector: '.faq-item:nth-child(1) h2', text: 'ما هي سلسلة رسائل عيد الميلاد؟' },
        { selector: '.faq-item:nth-child(2) h2', text: 'كيف تعمل؟' },
        { selector: '.faq-item:nth-child(3) h2', text: 'هل معلوماتي الشخصية آمنة؟' },
        { selector: '.faq-item:nth-child(4) h2', text: 'هل يمكنني إرسال رسائل متعددة؟' },
        { selector: '.faq-item:nth-child(5) h2', text: 'ماذا يجب أن أكتب في رسالتي؟' },
        { selector: '.faq-item:nth-child(6) h2', text: 'هل يمكنني حذف رسالتي لاحقاً؟' },

        // Contact section
        { selector: 'section.mt-12 h3', text: 'لا تزال لديك أسئلة؟' },
        { selector: 'section.mt-12 p', text: 'نحن سعداء لمساعدتك! اتصل بفريق الدعم لدينا.' },
        { selector: 'section.mt-12 a', text: 'دعم البريد الإلكتروني' },

        // Footer
        { selector: 'footer a[href="../index.html"]', text: 'انضم الآن' },
        { selector: 'footer a[href="../hub/hub.html"]', text: 'مركز الرسائل' },
        { selector: 'footer span.font-bold', text: 'سلسلة رسائل عيد الميلاد' },
        { selector: 'footer p.text-sm', text: 'نجعل أعياد الميلاد مميزة منذ 2024' },
        { selector: '#footer-links-col p', text: '© محمد بافليح' }
    ];

    // FAQ answers that need API translation
    const answersToTranslate = [
        { 
            selector: '.faq-item:nth-child(1) .faq-answer', 
            text: 'The Birthday Message Chain is a community project where people share birthday wishes. When you submit a message, you\'ll receive a random birthday message from someone else on your special day!' 
        },
        { 
            selector: '.faq-item:nth-child(3) .faq-answer', 
            text: 'We take privacy seriously. We only collect your email and birthday (month/day, not year). Your email will only be used to send you a birthday message and will never be shared publicly or with third parties.' 
        },
        { 
            selector: '.faq-item:nth-child(4) .faq-answer', 
            text: 'To keep it fair for everyone, we limit submissions to one message per email address. This helps ensure everyone gets a unique message on their birthday.' 
        },
        { 
            selector: '.faq-item:nth-child(6) .faq-answer', 
            text: 'Yes! If you\'d like to remove your message from the chain, simply email us from the address you used to submit and we\'ll remove your entry.' 
        }
    ];

    // List items for "How does it work?" - need API translation
    const listItemsToTranslate = [
        { selector: '.faq-item:nth-child(2) .faq-answer li:nth-child(1)', text: 'Submit your birthday and a heartfelt message' },
        { selector: '.faq-item:nth-child(2) .faq-answer li:nth-child(2)', text: 'Your message gets added to our database' },
        { selector: '.faq-item:nth-child(2) .faq-answer li:nth-child(3)', text: 'On your birthday, we\'ll email you a random message from another participant' },
        { selector: '.faq-item:nth-child(2) .faq-answer li:nth-child(4)', text: 'Your message will be shared with someone else on their birthday' }
    ];

    // Message examples that need API translation
    const messageExamples = [
        { selector: '.faq-item:nth-child(5) .faq-answer p', text: 'Write something kind, uplifting, and birthday-appropriate! Some ideas:\n- May your birthday be as wonderful as you are!\n- Wishing you a year filled with joy and success!\n- Hope your special day is as amazing as you deserve!\nKeep it positive and under 100 characters.' }
    ];

    // Translate direct elements (no API needed)
    for (const element of elementsToTranslate) {
        try {
            const el = document.querySelector(element.selector);
            if (el && !el.dataset.translated) {
                el.textContent = element.text;
                el.dataset.translated = 'true';
            }
        } catch (error) {
            console.error(`Error translating ${element.selector}:`, error);
        }
    }

    // Translate FAQ answers using API
    for (const answer of answersToTranslate) {
        try {
            const el = document.querySelector(answer.selector);
            if (el && !el.dataset.translated) {
                const translated = await translateText(answer.text);
                el.textContent = translated;
                el.dataset.translated = 'true';
            }
        } catch (error) {
            console.error(`Error translating answer ${answer.selector}:`, error);
        }
    }

    // Translate list items using API
    for (const item of listItemsToTranslate) {
        try {
            const el = document.querySelector(item.selector);
            if (el && !el.dataset.translated) {
                const translated = await translateText(item.text);
                el.textContent = translated;
                el.dataset.translated = 'true';
            }
        } catch (error) {
            console.error(`Error translating list item ${item.selector}:`, error);
        }
    }

    // Translate message examples using API
    for (const example of messageExamples) {
        try {
            const el = document.querySelector(example.selector);
            if (el && !el.dataset.translated) {
                const translated = await translateText(example.text);
                // Handle line breaks properly
                el.innerHTML = translated.replace(/\n/g, '<br>');
                el.dataset.translated = 'true';
            }
        } catch (error) {
            console.error(`Error translating message examples:`, error);
        }
    }

    // Apply RTL direction to the entire document
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    document.body.classList.add('rtl');

    // Update language toggle
    const langText = document.getElementById('langToggleText');
    if (langText) langText.textContent = '🌐';
    const toggleBtn = document.getElementById('toggleLangBtn');
    if (toggleBtn) toggleBtn.setAttribute('title', 'Switch to English');
}

// Improved translation function using only API
async function translateText(text) {
    if (!text.trim()) return text;

    try {
        // Using MyMemory Translation API (free tier available)
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        }
        
        // If MyMemory fails, try LibreTranslate (if available)
        const libreResponse = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: 'ar',
                format: 'text'
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (libreResponse.ok) {
            const libreData = await libreResponse.json();
            return libreData.translatedText || text;
        }
        
        throw new Error('Both translation services failed');
        
    } catch (error) {
        console.error('Translation API error:', error);
        
        // Fallback translations for common phrases
        const fallbackTranslations = {
            'Submit your birthday and a heartfelt message': 'أرسل تاريخ ميلادك ورسالة صادقة',
            'Your message gets added to our database': 'يتم إضافة رسالتك إلى قاعدة البيانات',
            'On your birthday, we\'ll email you a random message from another participant': 'في عيد ميلادك، سنرسل لك رسالة عشوائية من مشارك آخر',
            'Your message will be shared with someone else on their birthday': 'ستتم مشاركة رسالتك مع شخص آخر في عيد ميلاده',
            'Write something kind, uplifting, and birthday-appropriate!': 'اكتب شيئاً لطيفاً ومشجعاً ومناسباً لعيد الميلاد!'
        };
        
        return fallbackTranslations[text] || text;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Open first FAQ by default
    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) {
        firstFaq.classList.add('active');
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Get language preference
    currentLang = localStorage.getItem('selectedLanguage') || 'en';

    // Translate immediately if Arabic is selected
    if (currentLang === 'ar') {
        translatePage();
    }

    // Language toggle button functionality
    const toggleLangBtn = document.getElementById('toggleLangBtn');
    if (toggleLangBtn) {
        const langText = document.getElementById('langToggleText');
        if (langText) {
            langText.textContent = currentLang === 'en' ? '🇵🇸' : '🌐';
        }
        toggleLangBtn.setAttribute('title', currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English');

        toggleLangBtn.addEventListener('click', async function () {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            localStorage.setItem('selectedLanguage', currentLang);

            if (currentLang === 'ar') {
                document.documentElement.dir = 'rtl';
                document.documentElement.lang = 'ar';
                document.body.classList.add('rtl');
                await translatePage();
            } else {
                document.documentElement.dir = 'ltr';
                document.documentElement.lang = 'en';
                document.body.classList.remove('rtl');
                location.reload();
            }

            if (langText) {
                langText.textContent = currentLang === 'en' ? '🇵🇸' : '🌐';
            }
            toggleLangBtn.setAttribute('title', currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English');
        });
    }
});