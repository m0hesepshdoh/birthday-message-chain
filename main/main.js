document.getElementById('mobileMenuBtn').addEventListener('click', function () {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
});

function setupShareButtons() {
    // Only two buttons: copy-link-share and whatsapp-share
    const websiteUrl = window.location.href;

    // Copy Link Button
    const copyBtn = document.getElementById('copy-link-share');
    if (copyBtn) {
        copyBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const tempInput = document.createElement('input');
            tempInput.value = websiteUrl;
            document.body.appendChild(tempInput);
            tempInput.select();

            try {
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(websiteUrl);
                } else if (document.execCommand('copy')) {
                    document.execCommand('copy');
                } else {
                    throw new Error('Clipboard API not available');
                }
                showCopyFeedback(copyBtn);
            } catch (err) {
                console.error('Failed to copy URL: ', err);
                prompt('Copy this URL:', websiteUrl);
            } finally {
                document.body.removeChild(tempInput);
            }
        });
    }

    // WhatsApp Button
    const whatsappBtn = document.getElementById('whatsapp-share');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`https://wa.me/?text=${encodeURIComponent(websiteUrl)}`, '_blank');
        });
    }
}

// Helper function to show copy feedback
function showCopyFeedback(button) {
    const originalText = button.querySelector('.tooltip')?.textContent || '';
    const tooltip = button.querySelector('.tooltip');

    if (tooltip) {
        tooltip.textContent = 'Copied!';
        setTimeout(() => {
            tooltip.textContent = originalText;
        }, 2000);
    }
}

const firebaseConfig = {
    apiKey: 'AIzaSyA0wcgv_6dH14g37F6fdqXv1A97amw23_w',
    authDomain: 'birthdaymessagesapp.firebaseapp.com',
    projectId: 'birthdaymessagesapp',
    storageBucket: 'birthdaymessagesapp.firebasestorage.app',
    messagingSenderId: '220266164498',
    appId: '1:220266164498:web:2adcb2520b75f580cd83cb'
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


const translations = {
    en: {
        title: "Birthday Message Chain",
        description: "Join the birthday message chain! Your words will brighten someone's day, and you'll receive a surprise message on your birthday in return.",
        emailLabel: "Your Email to Recive Other's Message",
        emailPlaceholder: " your@email.com ",
        birthdayLabel: "Your Birthday",
        selectedDatePrefix: "You've selected : ",
        messageLabel: "Birthday Message Other's Will Recive",
        messagePlaceholder: "Write Something Uniqe Be Creative And Kind (max 100 characters)",
        charCountSuffix: "characters",
        submitButtonText: "Join The Birthday Chain",
        submitButtonJoining: "Joining...",
        formSuccessMessage: "You have joined the Chain Woohoo!",
        formGenericError: "Please correct the errors above.",
        formSubmitError: "Failed to join the chain. Please try again.",
        toggleButtonToAr: "العربية",
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        emailValidationError: "Please enter a valid hotmail, Gmail or Yahoo etc... address.",
        messageRequiredError: "Message is required.",
        messageLengthError: "Message must be 100 characters or less.",
        ipBlockedError: "You have exceeded the maximum submission attempts.",
        shareLabel: "Share with friends:",
        whatsappLabel: "Share on WhatsApp",
        navFAQ: "FAQ",
        navHub: "Message Hub",
        footerFAQ: "FAQ",
        footerHub: "Message Hub",
        footerTitle: "Birthday Message Chain",
        footerDesc: "Making birthdays special since 2024",
        logoTitle: "Chain",
        days: "days",
        day: "day",
        copyright: "&copy; Mohammed Bafuleh"
    },
    ar: {
        title: "سلسلة رسائل يوم الولادة",
        description: "شاركنا في سلسلة رسائل يوم الولادة! كلمة منك ممكن تفرّح واحد ما تعرفه، وفي يوم ميلادك راح توصلك رسالة حلوة من شخص ما تعرفه.",
        emailLabel: "بريدك الإلكتروني لإستلام الرسالة العشوائية",
        emailPlaceholder: " your@email.com ",
        birthdayLabel: "تاريخ ولادتك",
        selectedDatePrefix: "اختيارك : ",
        messageLabel: "الرسالة إللي بتوصل لشخص عشوائي",
        messagePlaceholder: "اكتب شي جديد وغريب وبنفس الوقت خاص ليوم الميلاد (100 حرف)",
        charCountSuffix: "حرف",
        submitButtonText: "ادخل السلسلة",
        submitButtonJoining: "قاعد تدخل...",
        formSuccessMessage: "أشكرك على انضمامك في السلسلة",
        formGenericError: "في عندك أخطاء فوق صلحها",
        formSubmitError: "في مشكلة , ممكن تعيد مرة ثانية",
        toggleButtonToEn: "English",
        months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        emailValidationError: "استخدم بريد إلكتروني زي هوتميل، جيميل أو ياهو إلخ...",
        messageRequiredError: "لازم تكتب رسالة",
        messageLengthError: "أكثر شي 100 حرف",
        ipBlockedError: "كم مرة ترسل يا خوي جرب في يوم ثاني",
        shareLabel: "شارك مع أصدقائك:",
        whatsappLabel: "واتساب",
        navFAQ: "الاسئلة الشائعة",
        navHub: "الرسائل",
        footerFAQ: "الاسئلة الشائعة",
        footerHub: "الرسائل",
        footerTitle: "سلسلة رسائل يوم الولادة",
        footerDesc: "نجعل أيام الولادة مميزة منذ 2024",
        logoTitle: "سلسلة",
        days: "يوم",
        day: "أيام",
        copyright: "&copy; محمد بافليح"
    }
};


const elements = {
    email: document.getElementById('email'),
    monthWheel: document.getElementById('monthWheel'),
    dayWheel: document.getElementById('dayWheel'),
    selectedDate: document.getElementById('selectedDate'),
    message: document.getElementById('message'),
    charCount: document.getElementById('char-count'),
    birthdayForm: document.getElementById('birthdayForm'),
    formSuccess: document.getElementById('form-success'),
    formError: document.getElementById('form-error'),
    toggleLangBtn: document.getElementById('toggleLangBtn'),
    submitButton: document.getElementById('submit-button'),
    mainTitle: document.getElementById('main-title'),
    mainDescription: document.getElementById('main-description'),
    emailLabel: document.getElementById('email-label'),
    birthdayLabel: document.getElementById('birthday-label'),
    messageLabel: document.getElementById('message-label'),
    emailError: document.getElementById('email-error'),
    messageError: document.getElementById('message-error'),
    ipBlockError: document.getElementById('ipblockerror'),
    shareLabel: document.getElementById('share-label'),
    facebookBtn: document.querySelector('.flex.justify-center button:nth-child(1)'),
    twitterBtn: document.querySelector('.flex.justify-center button:nth-child(2)'),
    redditBtn: document.querySelector('.flex.justify-center button:nth-child(3)'),
    whatsappBtn: document.getElementById('whatsapp-share'),
    navFAQ: document.getElementById('nav-FAQ'),
    navHub: document.getElementById('nav-hub'),
    mobileNavFAQ: document.getElementById('mobile-nav-FAQ'),
    mobileNavHub: document.getElementById('mobile-nav-hub'),
    footerFAQ: document.getElementById('footer-FAQ'),
    footerHub: document.getElementById('footer-hub'),
    footerTitle: document.querySelector('#footer-logo-desc span'),
    footerDesc: document.querySelector('#footer-logo-desc p'),
    logoTitle: document.getElementById('logo-title')
};

const blockedEmail = "ug671431015@ftu.ac.th";
const BLOCKED_ATTEMPTS = 3;
let selectedMonth = 0,
    selectedDay = 1,
    currentLang;

elements.email.addEventListener('input', () => {
    elements.email.value = elements.email.value.replace(/[^a-zA-Z0-9@_+.-\s]/g, '');
});

const populateWheel = (wheel, items, selectedIndex = 0) => {
    wheel.innerHTML = '';
   // wheel.dataset.initialized = "true"; // Mark as initialized
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'wheel-item' + (index === selectedIndex ? ' selected' : '');
        itemElement.textContent = item;
        itemElement.dataset.index = index;
        itemElement.addEventListener('click', () => {
            wheel.dataset.initialized = "false"; // Mark as user-interacted
            handleItemClick(wheel, index);
            itemElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
        fragment.appendChild(itemElement);
    });
    wheel.appendChild(fragment);
};

const generateDays = monthIndex => {
    const daysInMonth = (monthIndex === 1) ? 29 : new Date(2024, monthIndex + 1, 0).getDate();
    const days = Array.from({
        length: daysInMonth
    }, (_, i) => i + 1);
    selectedDay = Math.min(selectedDay, daysInMonth);
    populateWheel(elements.dayWheel, days, selectedDay - 1);
};

const handleItemClick = function (wheel, index) {
    var items = wheel.querySelectorAll('.wheel-item');
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('selected');
    }
    wheel.children[index].classList.add('selected');
    var scrollPos = index * 40 - wheel.clientHeight / 2 + 20;
    wheel.scrollTop = scrollPos;
    if (wheel === elements.monthWheel && selectedMonth !== index) {
        selectedMonth = index;
        generateDays(selectedMonth);
    } else {
        selectedDay = index + 1;
    }
    updateSelectedDate();
};

const updateSelectedDate = () => {
    elements.selectedDate.textContent = `${translations[currentLang].selectedDatePrefix}${translations[currentLang].months[selectedMonth]} ${selectedDay}`;
};

const applyTranslations = () => {
    const langText = document.getElementById('langToggleText');
    const langData = translations[currentLang];
    const isRTL = currentLang === 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    if (isRTL) {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }

    // Main content
    elements.mainTitle.textContent = langData.title;
    elements.mainDescription.textContent = langData.description;
    elements.emailLabel.textContent = langData.emailLabel;
    elements.birthdayLabel.textContent = langData.birthdayLabel;
    elements.messageLabel.textContent = langData.messageLabel;
    elements.message.placeholder = langData.messagePlaceholder;
    elements.submitButton.textContent = langData.submitButtonText;
    elements.toggleLangBtn.textContent = isRTL ? "🌍" : "🇵🇸";
    populateWheel(elements.monthWheel, langData.months, selectedMonth);
    updateSelectedDate();
    updateCharCount();

    // Header, nav, footer
    if (elements.navFAQ) elements.navFAQ.textContent = langData.navFAQ;
    if (elements.navHub) elements.navHub.textContent = langData.navHub;
    if (elements.mobileNavFAQ) elements.mobileNavFAQ.textContent = langData.navFAQ;
    if (elements.mobileNavHub) elements.mobileNavHub.textContent = langData.navHub;

    // Footer translations
    if (elements.footerFAQ) elements.footerFAQ.textContent = langData.footerFAQ;
    if (elements.footerHub) elements.footerHub.textContent = langData.footerHub;
    if (elements.footerTitle) elements.footerTitle.textContent = langData.footerTitle;
    if (elements.footerDesc) elements.footerDesc.textContent = langData.footerDesc;

    // Logo translation
    if (elements.logoTitle) elements.logoTitle.textContent = langData.logoTitle;
    if (document.getElementById('footer-copyright')) {
        document.getElementById('footer-copyright').innerHTML = langData.copyright;
    }

    // Other UI
    [elements.emailError, elements.messageError, elements.formError, elements.formSuccess, elements.ipBlockError].forEach(el => {
        el.textContent = "";
        el.style.display = 'none';
    });
    if (elements.shareLabel) elements.shareLabel.textContent = langData.shareLabel;
    if (document.getElementById('whatsapp-share')) {
        document.getElementById('whatsapp-share').title = langData.whatsappLabel;
        document.getElementById('whatsapp-share').querySelector('.tooltip').textContent = langData.whatsappLabel;
    }
    if (document.getElementById('share-label')) {
        document.getElementById('share-label').textContent = langData.shareLabel;
    }
    // Force reflow to ensure RTL layout updates
    document.body.style.display = 'none';
    document.body.offsetHeight;
    document.body.style.display = '';
};

const updateCharCount = () => {
    const langData = translations[currentLang];
    elements.charCount.textContent = `${elements.message.value.length}/100 ${langData.charCountSuffix}`;
};

const toggleLanguage = () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('selectedLanguage', currentLang);
    applyTranslations();
    generateDays(selectedMonth);
    langText.textContent = currentLang === 'en' ? '🇵🇸' : '🌍';
};

elements.message.addEventListener('input', function () {
    updateCharCount();
    // Ensure the count updates even if the event doesn't fire properly
    requestAnimationFrame(updateCharCount);
});
const validateEmail = email => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((hotmail|gmail|yahoo|icloud|ftu.ac|outlook)\.(com|co\.uk|th|ca|de|fr|net|org|[a-z]{2,}))$/i.test(String(email).toLowerCase());

const getIpAddress = function () {
    return new Promise(function (resolve) {
        if (window.fetch) {
            fetch('https://api64.ipify.org?format=json')
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    resolve(data.ip);
                })
                .catch(function () {
                    resolve('127.0.0.1');
                });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api64.ipify.org?format=json', true);
            xhr.onload = function () {
                try {
                    var data = JSON.parse(xhr.responseText);
                    resolve(data.ip || '127.0.0.1');
                } catch (e) {
                    resolve('127.0.0.1');
                }
            };
            xhr.onerror = function () {
                resolve('127.0.0.1');
            };
            xhr.send();
        }
    });
};

const checkIpAndSubmit = async event => {
    event.preventDefault();
    [elements.formError, elements.formSuccess, elements.ipBlockError].forEach(el => el.style.display = 'none');
    [elements.emailError, elements.messageError].forEach(el => {
        el.textContent = "";
        el.style.display = 'none';
    });
    elements.submitButton.disabled = true;
    elements.submitButton.textContent = translations[currentLang].submitButtonJoining;
    const email = elements.email.value.trim();
    const message = elements.message.value.trim();
    const langData = translations[currentLang];
    let hasErrors = false;
    if (!validateEmail(email)) {
        elements.emailError.textContent = langData.emailValidationError;
        hasErrors = true;
    } else if (email.toLowerCase() === blockedEmail.toLowerCase()) {
        elements.emailError.textContent = currentLang === 'ar' ? 'هذا البريد الإلكتروني حقي' : 'This email address is mine.';
        hasErrors = true;
    }
    if (!message) {
        elements.messageError.textContent = langData.messageRequiredError;
        hasErrors = true;
    } else if (message.length > 100) {
        elements.messageError.textContent = langData.messageLengthError;
        hasErrors = true;
    }
    if (hasErrors) {
        elements.formError.textContent = langData.formGenericError;
        elements.formError.style.display = 'block';
        elements.submitButton.disabled = false;
        elements.submitButton.textContent = langData.submitButtonText;
        return;
    }
    try {
        const ipAddress = await getIpAddress();
        const attemptsRef = db.collection('ipAttempts').doc(ipAddress);
        const doc = await attemptsRef.get();
        if (doc.exists && doc.data().attempts >= BLOCKED_ATTEMPTS) {
            elements.ipBlockError.textContent = langData.ipBlockedError;
            elements.ipBlockError.style.display = 'block';
            elements.submitButton.disabled = false;
            elements.submitButton.textContent = langData.submitButtonText;
            setTimeout(() => {
                window.location.href = "hub/hub.html";
            }, 10000);

            return;
        }
        await db.collection("submissions").add({
            email: email,
            birthMonth: selectedMonth + 1,
            birthDay: selectedDay,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        await (doc.exists ?
            attemptsRef.update({
                attempts: firebase.firestore.FieldValue.increment(1)
            }) :
            attemptsRef.set({
                attempts: 1
            }));
        elements.formSuccess.textContent = langData.formSuccessMessage;
        elements.formSuccess.style.display = 'block';
        setTimeout(() => {
            window.location.href = "hub/hub.html";
        }, 10000);
        elements.birthdayForm.reset();
        selectedMonth = 0;
        selectedDay = 1;
        populateWheel(elements.monthWheel, langData.months, selectedMonth);
        generateDays(selectedMonth);
        updateSelectedDate();
        updateCharCount();
    } catch (error) {
        console.error("Error adding document: ", error);
        elements.formError.textContent = `${langData.formSubmitError} (${error.message})`;
        elements.formError.style.display = 'block';
    } finally {
        elements.submitButton.disabled = false;
        elements.submitButton.textContent = langData.submitButtonText;
    }
};
elements.toggleLangBtn.addEventListener('click', toggleLanguage);
elements.birthdayForm.addEventListener('submit', checkIpAndSubmit);

document.addEventListener('DOMContentLoaded', function () {
    currentLang = localStorage.getItem('selectedLanguage') ||
        ((navigator.language && navigator.language.startsWith('ar')) ? 'ar' : 'en');


    setTimeout(function () {
        applyTranslations();
        generateDays(selectedMonth);
        updateCharCount();

        // Improved touch handling for wheel scrolling
        const wheels = document.querySelectorAll('.wheel');
        wheels.forEach(wheel => {
            wheel.dataset.initialized = "true";

            let startY, scrollTop;
            let isScrolling = false;
            let scrollTimeout;

            wheel.addEventListener('touchstart', (e) => {
                startY = e.touches[0].pageY;
                scrollTop = wheel.scrollTop;
                isScrolling = true;
                clearTimeout(scrollTimeout);
                wheel.style.scrollSnapType = 'none';
            }, { passive: false });

            wheel.addEventListener('touchmove', (e) => {
                if (!isScrolling) return;
                e.preventDefault();
                const y = e.touches[0].pageY;
                const walk = (y - startY) * 2;
                wheel.scrollTop = scrollTop - walk;
            }, { passive: false });

            wheel.addEventListener('touchend', () => {
                isScrolling = false;
                wheel.style.scrollSnapType = 'y mandatory';
                scrollTimeout = setTimeout(() => {
                    const items = wheel.querySelectorAll('.wheel-item');
                    const itemHeight = items[0]?.offsetHeight || 40;
                    const scrollPosition = wheel.scrollTop;
                    const centerIndex = Math.round(scrollPosition / itemHeight);

                    if (items[centerIndex]) {
                        handleItemClick(wheel, parseInt(items[centerIndex].dataset.index));
                        items[centerIndex].scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }, 100);
            });
        });

        // Click/tap selection for wheel items
        document.querySelectorAll('.wheel-item').forEach(item => {
            item.addEventListener('click', function () {
                handleItemClick(this.parentNode, parseInt(this.dataset.index));
            });
        });

    }, 100);
    setupShareButtons();
});
