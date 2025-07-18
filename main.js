document.getElementById('mobileMenuBtn').addEventListener('click', function () {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
});


function createConfetti() {
    const container = document.querySelector('body');
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}


function updateCountdown(month, day) {
    const now = new Date();
    let nextBirthday = new Date(now.getFullYear(), month, day);

    if (nextBirthday < now) {
        nextBirthday = new Date(now.getFullYear() + 1, month, day);
    }

    const diff = nextBirthday - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    document.getElementById('birthday-countdown').textContent = `${days} days`;
    document.getElementById('countdown-container').classList.remove('hidden');
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
        ipBlockedError: "You have exceeded the maximum submission attempts."
    },
    ar: {
        title: "سلسلة رسائل يوم الولادة",
        description: "تعال شاركنا في سلسلة رسائل يوم الولادة! كلمة منك ممكن تفرّح واحد ما تعرفه، وفي يوم ميلادك راح توصلك رسالة حلوة من شخص ما تعرفه.",
        emailLabel: "بريدك الإلكتروني الخاص",
        emailPlaceholder: " your@email.com ",
        birthdayLabel: "تاريخ ميلادك (الشهر واليوم)",
        selectedDatePrefix: "اختيارك : ",
        messageLabel: "الرسالة إللي بتوصل لواحد ما تعرفه",
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
        ipBlockedError: "كم مرة ترسل يا خوي جرب في يوم ثاني"
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
    ipBlockError: document.getElementById('ip-block-error')
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
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'wheel-item' + (index === selectedIndex ? ' selected' : '');
        itemElement.textContent = item;
        itemElement.dataset.index = index;
        itemElement.addEventListener('click', () => {
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
    updateCountdown(selectedMonth, selectedDay);
};

const updateSelectedDate = () => {
    elements.selectedDate.textContent = `${translations[currentLang].selectedDatePrefix}${translations[currentLang].months[selectedMonth]} ${selectedDay}`;
};

const applyTranslations = () => {
    const langData = translations[currentLang];
    const isRTL = currentLang === 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    elements.mainTitle.textContent = langData.title;
    elements.mainDescription.textContent = langData.description;
    elements.emailLabel.textContent = langData.emailLabel;
    elements.email.placeholder = langData.emailPlaceholder;
    elements.birthdayLabel.textContent = langData.birthdayLabel;
    elements.messageLabel.textContent = langData.messageLabel;
    elements.message.placeholder = langData.messagePlaceholder;
    elements.submitButton.textContent = langData.submitButtonText;
    elements.toggleLangBtn.textContent = isRTL ? langData.toggleButtonToEn : langData.toggleButtonToAr;
    populateWheel(elements.monthWheel, langData.months, selectedMonth);
    updateSelectedDate();
    updateCharCount();
    [elements.emailError, elements.messageError, elements.formError, elements.formSuccess, elements.ipBlockError].forEach(el => {
        el.textContent = "";
        el.style.display = 'none';
    });

};

const updateCharCount = () => {
    const langData = translations[currentLang];
    elements.charCount.textContent = `${elements.message.value.length}/100 ${langData.charCountSuffix}`;
};

const toggleLanguage = () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    applyTranslations();
    generateDays(selectedMonth);
};

elements.message.addEventListener('input', updateCharCount);
const validateEmail = email => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((hotmail|gmail|yahoo|icloud|ftu|outlook)\.(com|co\.uk|ac.th|ca|de|fr|net|org|[a-z]{2,}))$/i.test(String(email).toLowerCase());

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
    [elements.emailError, elements.messageError].forEach(el => el.textContent = "");
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
            return;
        }
        await db.collection("submissions").add({
            email: email,
            birthMonth: selectedMonth + 1,
            birthDay: selectedDay,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            ipAddress: ipAddress
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
    currentLang = (navigator.language && navigator.language.startsWith('ar')) ? 'ar' : 'en';
    setTimeout(function () {
        applyTranslations();
        generateDays(selectedMonth);
        var wheelItems = document.querySelectorAll('.wheel-item');
        for (var i = 0; i < wheelItems.length; i++) {
            wheelItems[i].addEventListener('touchstart', function (e) {
                e.preventDefault();
                handleItemClick(this.parentNode, parseInt(this.dataset.index));
            });
        }
    }, 100);
});