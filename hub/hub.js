// Dark mode widget configuration
const options = {
    bottom: '80px', // Position from bottom
    left: '20px',   // Position from left
    right: 'unset', // No right positioning
    label: '🌓',    // Moon/sun icon for toggle
};

// Initialize dark mode widget
const darkmode = new Darkmode(options);
darkmode.showWidget(); // Display the widget on page

// Firebase configuration for connecting to the database
const firebaseConfig = {
    apiKey: 'AIzaSyA0wcgv_6dH14g37F6fdqXv1A97amw23_w', // API key for authentication
    authDomain: 'birthdaymessagesapp.firebaseapp.com', // Domain for authentication
    projectId: 'birthdaymessagesapp',                  // Project ID
    storageBucket: 'birthdaymessagesapp.firebasestorage.app', // Storage bucket
    messagingSenderId: '220266164498',                // Sender ID for messaging
    appId: '1:220266164498:web:2adcb2520b75f580cd83cb' // App ID
};

// Initialize Firebase with the configuration
firebase.initializeApp(firebaseConfig);
// Get Firestore database instance
const db = firebase.firestore();

// Add this function near the top of your file with other utility functions
function isMessageDisplayed(messageId) {
    return document.getElementById(`message-${messageId}`) !== null;
}

// Language translations for English and Arabic
const translations = {
    en: { // English translations
        title: "Birthday Messages",
        description: "Heartfelt messages from people around the world",
        messagesTitle: "All Messages",
        sortMonth: "Sort by Birthday",
        sortLatest: "Sort by Latest",
        noMessagesTitle: "No messages yet",
        noMessagesDesc: "Be the first to share your birthday wishes!",
        errorTitle: "Failed to load messages",
        errorDesc: "Please try refreshing the page",
        logoTitle: "Chain",
        navJoin: "Join Now",
        navFaq: "FAQ",
        footerTitle: "Birthday Message Chain",
        footerDesc: "Making birthdays special since 2024",
        footerJoin: "Join Now",
        searchPlaceholder: "Search messages...",
        footerFaq: "FAQ",
        copyright: "© Mohammed Bafuleh",
        joinNowButton: "Join Now"

    },
    ar: { // Arabic translations
        title: "رسائل يوم الولادة",
        description: "رسائل صادقة من أشخاص حول العالم",
        messagesTitle: "جميع الرسائل",
        sortMonth: "ترتيب حسب يوم الولادة",
        sortLatest: "ترتيب حسب الأحدث",
        noMessagesTitle: "لا توجد رسائل بعد",
        noMessagesDesc: "كن أول من يشارك تمنيات يوم الولادة!",
        errorTitle: "فشل تحميل الرسائل",
        errorDesc: "يرجى محاولة تحديث الصفحة",
        logoTitle: "سلسلة",
        navJoin: "انضم الآن",
        navFaq: "الأسئلة الشائعة",
        footerTitle: "سلسلة رسائل يوم الولادة",
        footerDesc: "نجعل أيام الولادة مميزة منذ 2024",
        footerJoin: "انضم الآن",
        searchPlaceholder: "البحث في الرسائل...",
        footerFaq: "الأسئلة الشائعة",
        copyright: "© محمد بافليح",
        joinNowButton: "انضم الآن"
    }
};

// Get current language from storage or browser
let currentLang = localStorage.getItem('selectedLanguage') || (navigator.language && navigator.language.startsWith('ar') ? 'ar' : 'en');

// Get current sort field from storage or default to timestamp
let currentSortField = localStorage.getItem('sortField') || 'timestamp';

// Check if sorting by birthday from storage
let isSortingByBirthday = localStorage.getItem('isSortingByBirthday') === 'true' || false;
let currentLanguageFilter = null; // No language filter by default
let isFetching = false; // Flag to prevent multiple fetches
let lastVisible = null; // Last document seen for pagination
let hasMoreMessages = true; // Flag to check if more messages exist

// Function to apply translations to the page
function applyTranslations() {
    const langData = translations[currentLang];
    const isRTL = currentLang === 'ar'; // Check if Arabic

    // Set HTML language and direction
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    // Add/remove RTL class to body
    if (isRTL) {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }

    // Header and nav
    document.getElementById('logo-title').textContent = langData.logoTitle;
    document.getElementById('nav-Join').textContent = langData.navJoin;
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

    // Update Search Bar Placeholder
    document.getElementById('searchBar').placeholder = langData.searchPlaceholder;
    
    // Footer
    document.getElementById('footer-title').textContent = langData.footerTitle;
    document.getElementById('footer-desc').textContent = langData.footerDesc;
    document.getElementById('footer-main').textContent = langData.footerJoin;
    document.getElementById('footer-faq').textContent = langData.footerFaq;
    document.getElementById('footer-copyright').innerHTML = langData.copyright;

    document.getElementById('toggleLangBtn').textContent = currentLang === 'en' ? '🇵🇸' : '🌐';
    //updating various elements on the page
}

// Function to toggle between English and Arabic
function toggleLanguage() {
    applyTranslations();
    currentLang = currentLang === 'en' ? 'ar' : 'en'; // Switch language
    localStorage.setItem('selectedLanguage', currentLang); // Save to storage
    window.location.reload(); // Refresh page to apply changes
}

// Add click event to language toggle button
document.getElementById('toggleLangBtn').addEventListener('click', toggleLanguage);

// Mobile menu toggle functionality
document.getElementById('mobileMenuBtn').addEventListener('click', function () {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden'); // Show/hide menu
});

// When page loads
document.addEventListener('DOMContentLoaded', function () {
    applyTranslations(); // Apply translations
    fetchMessages(7); // Load first 7 messages

    // --- DEBOUNCING SETUP FOR SEARCH ---
    let searchTimeout;
    const searchBar = document.getElementById('searchBar');

    searchBar.addEventListener('input', () => {
        clearTimeout(searchTimeout); // Clear previous timeout
        // Wait 300ms after user stops typing before searching
        searchTimeout = setTimeout(() => {
            fetchMessages(7, true, searchBar.value.trim());
        }, 300);
    });

    // --- SORT BUTTON ---
    document.getElementById('sortMonthBtn').addEventListener('click', () => {
        isSortingByBirthday = !isSortingByBirthday;
        currentSortField = isSortingByBirthday ? 'birthDay' : 'timestamp';
        localStorage.setItem('isSortingByBirthday', isSortingByBirthday);
        localStorage.setItem('sortField', currentSortField);

        const langData = translations[currentLang];
        document.getElementById('sortMonthBtn').textContent = isSortingByBirthday ? langData.sortLatest : langData.sortMonth;

        // Reset and fetch with current search term
        fetchMessages(7, true, searchBar.value.trim());
    });

    // --- INFINITE SCROLL ---
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 400) {
                if (!isFetching && lastVisible && hasMoreMessages) {
                    // Fetch more with current search term
                    fetchMessages(7, false, searchBar.value.trim());
                }
            }
        }, 200);
    });
});


// Function to fetch messages from database
function fetchMessages(limit = 7, reset = false, searchTerm = '') {
    if (isFetching || (!hasMoreMessages && !reset)) return;
    isFetching = true;

    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorDisplay = document.getElementById('errorDisplay');
    const noMessages = document.getElementById('noMessages');

    if (reset) {
        lastVisible = null;
        hasMoreMessages = true;
        document.getElementById('messagesContainer').innerHTML = '';
    }

    loadingIndicator.classList.remove('hidden');
    errorDisplay.classList.add('hidden');
    if (reset) {
        noMessages.classList.add('hidden');
    }

    // Start with the base collection
    let query = db.collection('submissions');

    // --- QUERY LOGIC ---
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        query = query.where('message', '>=', lowerCaseSearchTerm)
            .where('message', '<=', lowerCaseSearchTerm + '\uf8ff')
            .orderBy('message'); // First orderBy must match the where clause

        // Add secondary sorting
        if (isSortingByBirthday) {
            query = query.orderBy('birthMonth').orderBy('birthDay');
        } else {
            query = query.orderBy('timestamp', 'desc');
        }

    } else {
        // Original sorting when not searching
        if (isSortingByBirthday) {
            query = query.orderBy('birthMonth').orderBy('birthDay');
        } else {
            query = query.orderBy('timestamp', 'desc');
        }
    }

    if (currentLanguageFilter) {
        query = query.where('language', '==', currentLanguageFilter);
    }

    if (lastVisible && !reset) {
        query = query.startAfter(lastVisible);
    }

    query = query.limit(limit);
    // Add slight delay for better UX
    setTimeout(() => {
        query.get()
            .then((querySnapshot) => {
                // Hide loading indicators
                loadingIndicator.classList.add('hidden');
                isFetching = false;

                const container = document.getElementById('messagesContainer');

                // Show "no messages" if empty
                if (querySnapshot.empty && reset) {
                    noMessages.classList.remove('hidden');
                    hasMoreMessages = false;
                    return;
                }

                // Add each message to page
                querySnapshot.forEach((doc) => {
                    const msg = doc.data();
                    // Check if this message is already displayed to avoid duplicates
                    if (!document.getElementById(`message-${doc.id}`)) {
                        addMessageToDOM(msg, doc);
                    }
                });

                // Update last visible for pagination
                lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

                // Check if we have fewer results than requested (no more messages)
                if (querySnapshot.size < limit) {
                    hasMoreMessages = false;
                }
            })
            .catch((error) => {
                console.error("Error fetching messages:", error);
                loadingIndicator.classList.add('hidden');
                errorDisplay.classList.remove('hidden');
                isFetching = false;
            });
    }, 50); // small delay
}

function addMessageToDOM(msg, doc) {
    // Month names in English and Arabic
    const monthNames = currentLang === 'en'
        ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        : ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    const container = document.getElementById('messagesContainer');

    // Create message card
    const card = document.createElement('div');
    card.className = 'message-card bg-white rounded-lg shadow-md p-6';

    // Add Arabic RTL direction if language is Arabic
    const messageClass = msg.language === 'Arabic' ? 'arabic-message' : '';

    // Create a unique ID for this message
    const messageId = doc.id;
    const vueAppId = `message-${messageId}`;

    // Store the initial like count from the message data
    const initialLikeCount = msg.likes || 0;

    // Check if user has already liked this message
    const isAlreadyLiked = localStorage.getItem(`liked-${messageId}`) === 'true';

    card.innerHTML = `
    <div id="${vueAppId}">
      <div class="flex justify-between items-start mb-4">
        <div class="flex space-x-2">
          <span class="birthday-badge px-3 py-1 rounded-full text-xs font-semibold">
            ${monthNames[msg.birthMonth - 1]} ${msg.birthDay}
          </span>
          ${msg.language ? `<span class="language-badge px-3 py-1 rounded-full text-xs font-semibold">${msg.language}</span>` : ''}
        </div>
        <span class="text-gray-500 text-sm">${formatTimeAgo(msg.timestamp?.toDate())}</span>
      </div>
      <p class="text-gray-700 mb-4 ${msg.language === 'Arabic' ? 'arabic-message' : ''}">
        ${msg.message}
      </p>
      <div class="flex items-center space-x-2">
        <button 
          @click="toggleLike" 
          :class="{ 'text-red-500': isLiked }" 
          class="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{{ likeCount }}</span>
        </button>
      </div>
    </div>
  `;

    container.appendChild(card);

    // Initialize Vue for this message with proper initial values
    const app = Vue.createApp({
        data() {
            return {
                isLiked: isAlreadyLiked,
                likeCount: initialLikeCount,
                messageId: messageId
            };
        },
        methods: {
            async toggleLike() {
                const likesRef = db.collection('submissions').doc(this.messageId);

                if (this.isLiked) {
                    // Decrement like
                    await likesRef.update({
                        likes: firebase.firestore.FieldValue.increment(-1)
                    });
                    this.likeCount--;
                } else {
                    // Increment like
                    await likesRef.update({
                        likes: firebase.firestore.FieldValue.increment(1)
                    });
                    this.likeCount++;
                }
                this.isLiked = !this.isLiked;
                localStorage.setItem(`liked-${this.messageId}`, this.isLiked);
            }
        },
        async mounted() {
            // Only fetch from Firebase if we don't have the latest data
            // This prevents the glitch when scrolling
            if (!this.isLiked) {
                const docSnapshot = await db.collection('submissions').doc(this.messageId).get();
                if (docSnapshot.exists) {
                    this.likeCount = docSnapshot.data().likes || 0;
                }
            }
        }
    }).mount(`#${vueAppId}`);
}

// Function to format time as "X time ago"
function formatTimeAgo(date) {
    if (!date) return currentLang === 'en' ? "just now" : "الآن";

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    // Return appropriate time string based on elapsed time
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

// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}