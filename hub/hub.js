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

// Language support
const translations = {
    en: {
        title: "Birthday Messages",
        description: "Heartfelt messages from people around the world",
        messagesTitle: "All Messages",
        sortMonth: "Sort by Birthday",
        sortLatest: "Sort by Latest",
        noMessagesTitle: "No messages yet",
        noMessagesDesc: "Be the first to share your birthday wishes!",
        errorTitle: "Failed to load messages",
        errorDesc: "Please try refreshing the page",
        loadMoreText: "Load More Messages",
        logoTitle: "Chain",
        navJoin: "Join Now",
        navFaq: "FAQ",
        footerTitle: "Birthday Message Chain",
        footerDesc: "Making birthdays special since 2024",
        footerJoin: "Join Now",
        footerFaq: "FAQ",
        copyright: "© Mohammed Bafuleh",
        joinNowButton: "Join Now"

    },
    ar: {
        title: "رسائل يوم الولادة",
        description: "رسائل صادقة من أشخاص حول العالم",
        messagesTitle: "جميع الرسائل",
        sortMonth: "ترتيب حسب يوم الولادة",
        sortLatest: "ترتيب حسب الأحدث",
        noMessagesTitle: "لا توجد رسائل بعد",
        noMessagesDesc: "كن أول من يشارك تمنيات يوم الولادة!",
        errorTitle: "فشل تحميل الرسائل",
        errorDesc: "يرجى محاولة تحديث الصفحة",
        loadMoreText: "تحميل المزيد من الرسائل",
        logoTitle: "سلسلة",
        navJoin: "انضم الآن",
        navFaq: "الأسئلة الشائعة",
        footerTitle: "سلسلة رسائل يوم الولادة",
        footerDesc: "نجعل أيام الولادة مميزة منذ 2024",
        footerJoin: "انضم الآن",
        footerFaq: "الأسئلة الشائعة",
        copyright: "© محمد بافليح",
        joinNowButton: "انضم الآن"
    }
};

let currentLang = localStorage.getItem('selectedLanguage') || (navigator.language && navigator.language.startsWith('ar') ? 'ar' : 'en');
let currentSortField = localStorage.getItem('sortField') || 'timestamp';
let isSortingByBirthday = localStorage.getItem('isSortingByBirthday') === 'true' || false;
let currentLanguageFilter = null;
let isFetching = false;
let lastVisible = null;

// Apply translations
function applyTranslations() {
    const langData = translations[currentLang];
    const isRTL = currentLang === 'ar';

    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    if (isRTL) {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }

    // Header and nav
    document.getElementById('logo-title').textContent = langData.logoTitle;
    document.getElementById('nav-main').textContent = langData.navJoin;
    document.getElementById('nav-faq').textContent = langData.navFaq;
    // Mobile menu
    document.getElementById('mobile-nav-main').textContent = langData.navJoin;
    document.getElementById('mobile-nav-faq').textContent = langData.navFaq;

    //floating button
    document.getElementById('joinNowBtn').textContent = langData.joinNowButton;

    // Sort button
    document.getElementById('sortMonthBtn').textContent = isSortingByBirthday ? langData.sortLatest : langData.sortMonth;
    // Main content
    document.getElementById('main-title').textContent = langData.title;
    document.getElementById('main-description').textContent = langData.description;
    document.getElementById('messages-title').textContent = langData.messagesTitle;
    document.getElementById('no-messages-title').textContent = langData.noMessagesTitle;
    document.getElementById('no-messages-desc').textContent = langData.noMessagesDesc;
    document.getElementById('error-title').textContent = langData.errorTitle;
    document.getElementById('error-desc').textContent = langData.errorDesc;
    document.getElementById('loadMoreText').textContent = langData.loadMoreText;

    // Footer
    document.getElementById('footer-title').textContent = langData.footerTitle;
    document.getElementById('footer-desc').textContent = langData.footerDesc;
    document.getElementById('footer-main').textContent = langData.footerJoin;
    document.getElementById('footer-faq').textContent = langData.footerFaq;
    document.getElementById('footer-copyright').innerHTML = langData.copyright;

    document.getElementById('toggleLangBtn').textContent = currentLang === 'en' ? '🇵🇸' : '🌐';
}

// Toggle language
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('selectedLanguage', currentLang);
    window.location.reload(); // This will refresh the page
    applyTranslations();
}

document.getElementById('toggleLangBtn').addEventListener('click', toggleLanguage);

// Mobile menu toggle
document.getElementById('mobileMenuBtn').addEventListener('click', function () {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
});

// Rest of your existing hub functionality...
document.addEventListener('DOMContentLoaded', function () {
    applyTranslations();
    fetchMessages(7);

    document.getElementById('sortMonthBtn').addEventListener('click', () => {
        isSortingByBirthday = !isSortingByBirthday;
        currentSortField = isSortingByBirthday ? 'birthDay' : 'timestamp';
        // Save to localStorage
        localStorage.setItem('isSortingByBirthday', isSortingByBirthday);
        localStorage.setItem('sortField', currentSortField);
        // Update button text based on current sort
        const langData = translations[currentLang];
        document.getElementById('sortMonthBtn').textContent = isSortingByBirthday ?
            langData.sortLatest :
            langData.sortMonth;

        currentLanguageFilter = null;
        fetchMessages(7, true);
    });

    document.getElementById('loadMoreBtn').addEventListener('click', () => {
        fetchMessages(7);
    });

    // Infinite scroll detection
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
            if (!isFetching && lastVisible) {
                fetchMessages(7);
            }
        }
    });
});

function fetchMessages(limit = 7, reset = false) {
    if (isFetching) return;

    isFetching = true;
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorDisplay = document.getElementById('errorDisplay');
    const noMessages = document.getElementById('noMessages');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreText = document.getElementById('loadMoreText');
    const loadMoreSpinner = document.getElementById('loadMoreSpinner');

    if (reset) {
        lastVisible = null;
        document.getElementById('messagesContainer').innerHTML = '';
    } else {
        loadMoreText.textContent = translations[currentLang].loadMoreText;
        loadMoreSpinner.classList.remove('hidden');
        loadMoreBtn.disabled = true;
    }

    loadingIndicator.classList.remove('hidden');
    errorDisplay.classList.add('hidden');
    noMessages.classList.add('hidden');

    let query = db.collection('submissions')
        .orderBy(currentSortField);

    // Apply language filter if set
    if (currentLanguageFilter) {
        query = query.where('language', '==', currentLanguageFilter);
    }

    query = query.limit(limit);

    if (lastVisible && !reset) {
        query = query.startAfter(lastVisible);
    }

    if (isSortingByBirthday) {
        // For birthday sorting, we need to sort by birthMonth first, then birthDay
        query = db.collection('submissions')
            .orderBy('birthDay');
    } else {
        // Default sorting by timestamp (newest first)
        query = db.collection('submissions')
            .orderBy('timestamp', 'desc');
    };
    // Simulate longer loading time (2 seconds)
    setTimeout(() => {
        query.get()
            .then((querySnapshot) => {
                loadingIndicator.classList.add('hidden');
                isFetching = false;

                loadMoreText.textContent = translations[currentLang].loadMoreText;
                loadMoreSpinner.classList.add('hidden');
                loadMoreBtn.disabled = false;

                const container = document.getElementById('messagesContainer');

                if (querySnapshot.empty && reset) {
                    noMessages.classList.remove('hidden');
                    loadMoreContainer.classList.add('hidden');
                    return;
                }

                querySnapshot.forEach((doc) => {
                    const msg = doc.data();
                    addMessageToDOM(msg);
                });

                // Update last visible document
                lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

                // Show/hide load more button
                if (querySnapshot.size < limit) {
                    loadMoreContainer.classList.add('hidden');
                } else {
                    loadMoreContainer.classList.remove('hidden');
                }
            });
    }, 500); // half second delay
}

function addMessageToDOM(msg) {
    const monthNames = currentLang === 'en'
        ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        : ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    const container = document.getElementById('messagesContainer');

    const card = document.createElement('div');
    card.className = 'message-card bg-white rounded-lg shadow-md p-6';

    // Add Arabic RTL direction if language is Arabic
    const messageClass = msg.language === 'Arabic' ? 'arabic-message' : '';

    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
          <div class="flex space-x-2">
            <span class="birthday-badge px-3 py-1 rounded-full text-xs font-semibold">${monthNames[msg.birthMonth - 1]} ${msg.birthDay}</span>
            ${msg.language ? `<span class="language-badge px-3 py-1 rounded-full text-xs font-semibold">${msg.language}</span>` : ''}
          </div>
          <span class="text-gray-500 text-sm">${formatTimeAgo(msg.timestamp?.toDate())}</span>
        </div>
        <p class="text-gray-700 mb-4 ${messageClass}">${msg.message}</p>
      `;
    container.appendChild(card);
}

function formatTimeAgo(date) {
    if (!date) return currentLang === 'en' ? "just now" : "الآن";

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return currentLang === 'en' ? "just now" : "الآن";
    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return currentLang === 'en' ? `${minutes} minutes ago` : `منذ ${minutes} دقيقة`;
    }
    if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return currentLang === 'en' ? `${hours} hours ago` : `منذ ${hours} ساعة`;
    }
    const days = Math.floor(seconds / 86400);
    return currentLang === 'en' ? `${days} days ago` : `منذ ${days} يوم`;
}