// Dark mode widget configuration
const options = {
    bottom: '80px', // Position from bottom
    left: '20px',   // Position from left
    right: 'unset', // No right position
    label: '🌓',    // Moon/sun icon for toggle
};

// Create dark mode widget with above options
const darkmode = new Darkmode(options);
// Show the dark mode toggle widget on page
darkmode.showWidget();

// Mobile menu toggle functionality
document.getElementById('mobileMenuBtn').addEventListener('click', function () {
    const menu = document.getElementById('mobileMenu');
    // Toggle hidden class to show/hide mobile menu
    menu.classList.toggle('hidden');
});

// Function to set up share buttons
function setupShareButtons() {
    // Get current webpage URL
    const websiteUrl = window.location.href;

    // Copy Link Button setup
    const copyBtn = document.getElementById('copy-link-share');
    if (copyBtn) {
        copyBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // Stop default button behavior
            // Create temporary input element to copy text
            const tempInput = document.createElement('input');
            tempInput.value = websiteUrl;
            document.body.appendChild(tempInput);
            tempInput.select(); // Select the text

            try {
                // Try modern clipboard API first
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(websiteUrl);
                }
                // Fallback for older browsers
                else if (document.execCommand('copy')) {
                    document.execCommand('copy');
                } else {
                    throw new Error('Clipboard API not available');
                }
                // Show feedback that copy worked
                showCopyFeedback(copyBtn);
            } catch (err) {
                console.error('Failed to copy URL: ', err);
                // Fallback if copy fails - show prompt
                prompt('Copy this URL:', websiteUrl);
            } finally {
                // Clean up by removing temp input
                document.body.removeChild(tempInput);
            }
        });
    }

    // WhatsApp Button setup
    const whatsappBtn = document.getElementById('whatsapp-share');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default button behavior
            // Open WhatsApp share URL in new tab
            window.open(`https://wa.me/?text=${encodeURIComponent(websiteUrl)}`, '_blank');
        });
    }
}

// Helper function to show copy feedback
function showCopyFeedback(button) {
    // Get original tooltip text
    const originalText = button.querySelector('.tooltip')?.textContent || '';
    const tooltip = button.querySelector('.tooltip');

    if (tooltip) {
        // Temporarily change to "Copied!" message
        tooltip.textContent = 'Copied!';
        // Revert back after 2 seconds
        setTimeout(() => {
            tooltip.textContent = originalText;
        }, 2000);
    }
}

// Firebase configuration for connecting to the database
const firebaseConfig = {
    apiKey: 'AIzaSyA0wcgv_6dH14g37F6fdqXv1A97amw23_w', // API key for authentication
    authDomain: 'birthdaymessagesapp.firebaseapp.com', // Domain for authentication
    projectId: 'birthdaymessagesapp',                  // Project ID
    storageBucket: 'birthdaymessagesapp.firebasestorage.app', // Storage bucket
    messagingSenderId: '220266164498',                // Sender ID for messaging
    appId: '1:220266164498:web:2adcb2520b75f580cd83cb' // App ID
};

// Initialize Firebase with above config
firebase.initializeApp(firebaseConfig);
// Get Firestore database reference
const db = firebase.firestore();

// Translation texts for English and Arabic
const translations = {
    en: {
        title: "Birthday Message Chain",
        description: "Join the birthday message chain! Your words will brighten someone's day, and you'll receive a surprise message on your birthday in return.",
        emailLabel: "Your Email to Recive Other's Message",
        emailPlaceholder: " your@email.com ",
        birthdayLabel: "Your Birthday",
        selectedDatePrefix: "You've selected : ",
        messageLabel: "Birthday Message Other's Will Recive",
        messagePlaceholder: "Write Something Uniqe, Be Creative And Kind. (max 100 characters)",
        charCountSuffix: "characters",
        submitButtonText: "Join The Birthday Chain",
        submitButtonJoining: "Joining...",
        formSuccessMessage: "You have joined the Chain Woohoo!",
        formGenericError: "Please correct the errors above.",
        formSubmitError: "Failed to join the chain. Please try again.",
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
        copyright: "&copy; Mohammed Bafuleh"
    },
    ar: {
        title: "سلسلة رسائل يوم الولادة",
        description: "شاركنا في سلسلة رسائل يوم الولادة! كلمة منك ممكن تفرّح واحد ما تعرفه، وفي يوم ميلادك راح توصلك رسالة حلوة من شخص ما تعرفه.",
        emailLabel: "اكتب بريدك الإلكتروني لإستلام الرسالة العشوائية",
        emailPlaceholder: " your@email.com ",
        birthdayLabel: "اختر تاريخ ولادتك",
        selectedDatePrefix: "اختيارك : ",
        messageLabel: "اكتب الرسالة إللي بتوصل لشخص عشوائي",
        messagePlaceholder: "اكتب شي جديد وغريب وبنفس الوقت خاص ليوم الميلاد (100 حرف)",
        charCountSuffix: "حرف",
        submitButtonText: "ادخل السلسلة",
        submitButtonJoining: "قاعد تدخل...",
        formSuccessMessage: "أشكرك على انضمامك في السلسلة",
        formGenericError: "في عندك أخطاء فوق صلحها",
        formSubmitError: "في مشكلة , ممكن تعيد مرة ثانية",
        months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        emailValidationError: "استخدم بريد إلكتروني زي هوتميل، جيميل، ياهو إلخ...",
        messageRequiredError: "لازم تكتب رسالة",
        messageLengthError: "أكثر شي 100 حرف",
        ipBlockedError: "كم مرة ترسل يا خوي جرب في يوم ثاني",
        shareLabel: "شارك مع أصدقائك:",
        whatsappLabel: "واتساب",
        navFAQ: "الأسئلة الشائعة",
        navHub: "مركز الرسائل",
        footerFAQ: "الأسئلة الشائعة",
        footerHub: "مركز الرسائل",
        footerTitle: "سلسلة رسائل يوم الولادة",
        footerDesc: "نجعل أيام الولادة مميزة منذ 2024",
        logoTitle: "سلسلة",
        copyright: "&copy; محمد بافليح"
    }
};

// Cache all important DOM elements
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

// Block specific email address from submitting
const blockedEmail = "ug671431015@ftu.ac.th";
// Maximum allowed submission attempts
const BLOCKED_ATTEMPTS = 3;
// Track selected month and day
let selectedMonth = 0,
    selectedDay = 1,
    currentLang;

// Clean email input to prevent special characters
elements.email.addEventListener('input', () => {
    elements.email.value = elements.email.value.replace(/[^a-zA-Z0-9@_+.-\s]/g, '');
});

const populateWheel = (wheel, items, selectedIndex = 0) => {
    wheel.innerHTML = '';
    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'wheel-item' + (index === selectedIndex ? ' selected' : '');
        itemElement.textContent = item;
        itemElement.dataset.index = index;

        itemElement.addEventListener('click', () => {
            handleItemClick(wheel, index);
            itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        fragment.appendChild(itemElement);
    });

    wheel.appendChild(fragment);

    // Scroll to selected item
    if (wheel.children[selectedIndex]) {
        wheel.children[selectedIndex].scrollIntoView({ block: 'center' });
    }
};

// Generate days based on selected month
const generateDays = monthIndex => {
    // Handle February (leap year)
    const daysInMonth = (monthIndex === 1) ? 29 : new Date(2024, monthIndex + 1, 0).getDate();
    // Create array of days (1 to daysInMonth)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    // Ensure selected day is valid for this month
    selectedDay = Math.min(selectedDay, daysInMonth);
    // Populate day wheel with days
    populateWheel(elements.dayWheel, days, selectedDay - 1);
};

// Handle wheel item clicks
const handleItemClick = function (wheel, index) {
    // Remove selected class from all items
    var items = wheel.querySelectorAll('.wheel-item');
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('selected');
    }
    // Add selected class to clicked item
    wheel.children[index].classList.add('selected');
    // Calculate scroll position to center selected item
    var scrollPos = index * 40 - wheel.clientHeight / 2 + 20;
    wheel.scrollTop = scrollPos;

    // If month wheel was clicked, update days
    if (wheel === elements.monthWheel && selectedMonth !== index) {
        selectedMonth = index;
        generateDays(selectedMonth);
    } else {
        selectedDay = index + 1;
    }
    updateSelectedDate();
};

// Update the displayed selected date text
const updateSelectedDate = () => {
    elements.selectedDate.textContent =
        `${translations[currentLang].selectedDatePrefix}${translations[currentLang].months[selectedMonth]} ${selectedDay}`;
};

// Apply translations to all elements on page
const applyTranslations = () => {
    const langData = translations[currentLang];
    const isRTL = currentLang === 'ar';

    // Set HTML lang and direction attributes
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    // Add/remove RTL class from body
    if (isRTL) {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }

    // Update main content translations
    elements.mainTitle.textContent = langData.title;
    elements.mainDescription.textContent = langData.description;
    elements.emailLabel.textContent = langData.emailLabel;
    elements.birthdayLabel.textContent = langData.birthdayLabel;
    elements.messageLabel.textContent = langData.messageLabel;
    elements.message.placeholder = langData.messagePlaceholder;
    elements.submitButton.textContent = langData.submitButtonText;
    elements.toggleLangBtn.textContent = isRTL ? "🌐" : "🇵🇸";

    // Update wheels with translated months
    populateWheel(elements.monthWheel, langData.months, selectedMonth);
    generateDays(selectedMonth);
    updateSelectedDate();
    updateCharCount();

    // Update navigation translations
    if (elements.navFAQ) elements.navFAQ.textContent = langData.navFAQ;
    if (elements.navHub) elements.navHub.textContent = langData.navHub;
    if (elements.mobileNavFAQ) elements.mobileNavFAQ.textContent = langData.navFAQ;
    if (elements.mobileNavHub) elements.mobileNavHub.textContent = langData.navHub;

    // Update footer translations
    if (elements.footerFAQ) elements.footerFAQ.textContent = langData.footerFAQ;
    if (elements.footerHub) elements.footerHub.textContent = langData.footerHub;
    if (elements.footerTitle) elements.footerTitle.textContent = langData.footerTitle;
    if (elements.footerDesc) elements.footerDesc.textContent = langData.footerDesc;

    // Update logo and copyright
    if (elements.logoTitle) elements.logoTitle.textContent = langData.logoTitle;
    if (document.getElementById('footer-copyright')) {
        document.getElementById('footer-copyright').innerHTML = langData.copyright;
    }

    // Clear and hide error messages
    [elements.emailError, elements.messageError, elements.formError, elements.formSuccess, elements.ipBlockError].forEach(el => {
        el.textContent = "";
        el.style.display = 'none';
    });

    // Update share button labels
    if (elements.shareLabel) elements.shareLabel.textContent = langData.shareLabel;
    if (document.getElementById('whatsapp-share')) {
        document.getElementById('whatsapp-share').title = langData.whatsappLabel;
        document.getElementById('whatsapp-share').querySelector('.tooltip').textContent = langData.whatsappLabel;
    }
    if (document.getElementById('share-label')) {
        document.getElementById('share-label').textContent = langData.shareLabel;
    }

    // Force reflow to ensure RTL layout updates properly
    document.body.style.display = 'none';
    document.body.offsetHeight;
    document.body.style.display = '';
};

// Update character count display for message input
const updateCharCount = () => {
    const langData = translations[currentLang];
    elements.charCount.textContent = `${elements.message.value.length}/100 ${langData.charCountSuffix}`;
};

// Toggle between English and Arabic
const toggleLanguage = () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('selectedLanguage', currentLang); // Save preference
    applyTranslations(); // Update all text
    generateDays(selectedMonth); // Regenerate days wheel
    document.getElementById('langToggleText').textContent = currentLang === 'en' ? '🇵🇸' : '🌐';
};

// Update character count when message changes
elements.message.addEventListener('input', function () {
    updateCharCount();
    // Double-check count updates
    requestAnimationFrame(updateCharCount);
});

// Validate email format
const validateEmail = email => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((hotmail|gmail|yahoo|icloud|ftu.ac|outlook)\.(com|co\.uk|th|ca|de|fr|net|org|[a-z]{2,}))$/i.test(String(email).toLowerCase());

// Get user's IP address
const getIpAddress = function () {
    return new Promise(function (resolve) {
        // Use fetch API if available
        if (window.fetch) {
            fetch('https://api64.ipify.org?format=json')
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    resolve(data.ip);
                })
                .catch(function () {
                    resolve('127.0.0.1'); // Fallback if API fails
                });
        } else {
            // Fallback for older browsers
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

// Main form submission handler
const checkIpAndSubmit = async event => {
    event.preventDefault(); // Prevent form default submission

    // Hide all messages initially
    [elements.formError, elements.formSuccess, elements.ipBlockError].forEach(el => {
        if (el) el.style.display = 'none';
    });
    [elements.emailError, elements.messageError].forEach(el => {
        if (el) {
            el.textContent = "";
            el.style.display = 'none';
        }
    });

    // Disable submit button during processing
    elements.submitButton.disabled = true;
    elements.submitButton.textContent = translations[currentLang].submitButtonJoining;

    // Get form values
    const email = elements.email.value.trim();
    const message = elements.message.value.trim();
    const langData = translations[currentLang];
    let hasErrors = false;

    // Validate email
    if (!validateEmail(email)) {
        if (elements.emailError) {
            elements.emailError.textContent = langData.emailValidationError;
            elements.emailError.style.display = 'block';
        }
        hasErrors = true;
    } else if (email.toLowerCase() === blockedEmail.toLowerCase()) {
        if (elements.emailError) {
            elements.emailError.textContent = currentLang === 'ar' ? 'هذا البريد الإلكتروني حقي' : 'This email address is mine.';
            elements.emailError.style.display = 'block';
        }
        hasErrors = true;
    }

    // Validate message
    if (!message) {
        if (elements.messageError) {
            elements.messageError.textContent = langData.messageRequiredError;
            elements.messageError.style.display = 'block';
        }
        hasErrors = true;
    } else if (message.length > 100) {
        if (elements.messageError) {
            elements.messageError.textContent = langData.messageLengthError;
            elements.messageError.style.display = 'block';
        }
        hasErrors = true;
    }

    // If errors found, show them and stop
    if (hasErrors) {
        if (elements.formError) {
            elements.formError.textContent = langData.formGenericError;
            elements.formError.style.display = 'block';
        }
        elements.submitButton.disabled = false;
        elements.submitButton.textContent = langData.submitButtonText;
        return;
    }

    try {
        // Get user's IP address
        const ipAddress = await getIpAddress();
        const attemptsRef = db.collection('ipAttempts').doc(ipAddress);
        const doc = await attemptsRef.get();

        // Check if user has exceeded submission attempts
        if (doc.exists && doc.data().attempts >= BLOCKED_ATTEMPTS) {
            if (elements.ipBlockError) {
                elements.ipBlockError.textContent = langData.ipBlockedError;
                elements.ipBlockError.style.display = 'block';
            }
            elements.submitButton.disabled = false;
            elements.submitButton.textContent = langData.submitButtonText;
            // Redirect after delay
            setTimeout(() => {
                window.location.href = "hub/hub.html";
            }, 8000);
            return;
        }

        // Import FieldValue properly
        const FieldValue = firebase.firestore.FieldValue;

        // Save submission to database
        await db.collection("submissions").add({
            email: email,
            birthMonth: selectedMonth + 1, // Months are 1-based in database
            birthDay: selectedDay,
            message: message,
            likes: 0,
            timestamp: FieldValue.serverTimestamp(),
        });

        // Update attempt count
        await (doc.exists ?
            attemptsRef.update({
                attempts: FieldValue.increment(1)
            }) :
            attemptsRef.set({
                attempts: 1,
                lastAttempt: FieldValue.serverTimestamp()
            }));

        // Show success message
        if (elements.formSuccess) {
            elements.formSuccess.textContent = langData.formSuccessMessage;
            elements.formSuccess.style.display = 'block';
        }

        // Reset form immediately for better UX
        elements.birthdayForm.reset();
        selectedMonth = 0;
        selectedDay = 1;
        populateWheel(elements.monthWheel, langData.months, selectedMonth);
        generateDays(selectedMonth);
        updateSelectedDate();
        updateCharCount();

        // Redirect after delay
        setTimeout(() => {
            window.location.href = "hub/hub.html";
        }, 8000);

    } catch (error) {
        console.error("Error adding document: ", error);
        if (elements.formError) {
            elements.formError.textContent = `${langData.formSubmitError}`;
            elements.formError.style.display = 'block';
        }
    } finally {
        // Re-enable submit button
        elements.submitButton.disabled = false;
        elements.submitButton.textContent = langData.submitButtonText;
    }
};

// Set up event listeners
elements.toggleLangBtn.addEventListener('click', toggleLanguage);
elements.birthdayForm.addEventListener('submit', checkIpAndSubmit);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Determine initial language (from localStorage or browser)
    currentLang = localStorage.getItem('selectedLanguage') || ((navigator.language && navigator.language.startsWith('ar')) ? 'ar' : 'en');

    // Small delay to ensure DOM is fully ready
    setTimeout(function () {
        applyTranslations(); // Apply translations
        populateWheel(
            elements.monthWheel,
            translations[currentLang].months,
            selectedMonth
        );
        generateDays(selectedMonth); // Generate days wheel
        updateSelectedDate();
        updateCharCount(); // Update character counter
        // Set up event listeners
        elements.birthdayForm.addEventListener("submit", checkIpAndSubmit);
        elements.message.addEventListener("input", updateCharCount);

        // Set up click handlers for wheel items
        document.querySelectorAll('.wheel-item').forEach(item => {
            item.addEventListener('click', function () {
                handleItemClick(this.parentNode, parseInt(this.dataset.index));
            });
        });

    }, 100);

    // Set up share buttons
    setupShareButtons();
});
