const firebaseConfig = {
    apiKey: "AIzaSyA0wcgv_6dH14g37F6fdqXv1A97amw23_w",
    authDomain: "birthdaymessagesapp.firebaseapp.com",
    projectId: "birthdaymessagesapp",
    storageBucket: "birthdaymessagesapp.firebasestorage.app",
    messagingSenderId: "220266164498",
    appId: "1:220266164498:web:2adcb2520b75f580cd83cb"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const monthWheel = document.getElementById('monthWheel');
const dayWheel = document.getElementById('dayWheel');
const selectedDateDisplay = document.getElementById('selectedDate');
const messageInput = document.getElementById('message');
const charCountDisplay = document.getElementById('char-count');
const birthdayForm = document.getElementById('birthdayForm');
const emailInput = document.getElementById('email');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

// Data
const months = [{
        en: 'January',
        ar: 'يناير'
    },
    {
        en: 'February',
        ar: 'فبراير'
    },
    {
        en: 'March',
        ar: 'مارس'
    },
    {
        en: 'April',
        ar: 'أبريل'
    },
    {
        en: 'May',
        ar: 'مايو'
    },
    {
        en: 'June',
        ar: 'يونيو'
    },
    {
        en: 'July',
        ar: 'يوليو'
    },
    {
        en: 'August',
        ar: 'أغسطس'
    },
    {
        en: 'September',
        ar: 'سبتمبر'
    },
    {
        en: 'October',
        ar: 'أكتوبر'
    },
    {
        en: 'November',
        ar: 'نوفمبر'
    },
    {
        en: 'December',
        ar: 'ديسمبر'
    },
];

let selectedMonth = 0;
let selectedDay = 1;

// Functions for Date Wheels
function populateWheel(wheel, items, selectedIndex = 0) {
    wheel.innerHTML = '';
    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('wheel-item');
        itemElement.textContent = `${item.en} ${item.ar}`;
        itemElement.dataset.index = index;
        if (index === selectedIndex) itemElement.classList.add('selected');
        itemElement.addEventListener('click', () => handleItemClick(wheel, index));
        wheel.appendChild(itemElement);
    });
    setTimeout(() => {
        scrollToSelectedIndex(wheel, selectedIndex);
    }, 0);
}

function generateDays(month) {
    const daysInMonth = month === 1 ? 29 : new Date(2024, month + 1, 0).getDate();
    const days = Array.from({
        length: daysInMonth
    }, (_, i) => i + 1);
    const dayWheelContent = days.map((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('wheel-item');
        dayElement.textContent = day;
        dayElement.dataset.index = index;
        if (index === selectedDay - 1) {
            dayElement.classList.add('selected');
        }
        dayElement.addEventListener('click', () => handleDayClick(index));
        return dayElement;
    });
    dayWheel.innerHTML = '';
    dayWheelContent.forEach(element => dayWheel.appendChild(element));
    setTimeout(() => {
        scrollToSelectedIndex(dayWheel, selectedDay - 1);
    }, 0);
}

function handleDayClick(index) {
    const items = dayWheel.querySelectorAll('.wheel-item');
    items.forEach(item => item.classList.remove('selected'));
    items[index].classList.add('selected');
    selectedDay = index + 1;
    updateSelectedDate();
}

function handleItemClick(wheel, index) {
    const items = wheel.querySelectorAll('.wheel-item');
    items.forEach(item => item.classList.remove('selected'));
    items[index].classList.add('selected');
    if (wheel === monthWheel) {
        selectedMonth = index;
        generateDays(selectedMonth);
    }
    updateSelectedDate();
}

function updateSelectedDate() {
    selectedDateDisplay.textContent = `Selected Date: ${months[selectedMonth].en} ${selectedDay} - التاريخ المحدد: ${months[selectedMonth].ar} ${selectedDay}`;
}

// Character Count
messageInput.addEventListener('input', () => {
    charCountDisplay.textContent = `${messageInput.value.length}/100 characters`;
});

// Initial Wheel Setup
populateWheel(monthWheel, months);
generateDays(selectedMonth);
updateSelectedDate();

// Email Validation
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+(hotmail|gmail|yahoo)))$/;
    return re.test(String(email).toLowerCase());
}

// Form Submission with Firebase
birthdayForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formError.style.display = 'none';
    formSuccess.style.display = 'none';

    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let hasErrors = false;
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    if (!validateEmail(email)) {
        emailError.textContent = "Please enter a valid Hotmail, Gmail or Yahoo address.";
        hasErrors = true;
    } else {
        emailError.textContent = "";
    }

    if (!message || message.length > 100) {
        messageError.textContent = "Message is required and must be 100 characters or less.";
        hasErrors = true;
    } else {
        messageError.textContent = "";
    }

    if (hasErrors) {
        formError.textContent = "Please correct the errors above.";
        formError.style.display = 'block';
        return;
    }

    try {
        const userIP = await getUserIP();
        if (!userIP) {
            formError.textContent = "Could not verify IP. Please try again later.";
            formError.style.display = "block";
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        const snapshot = await db.collection("birthdayMessages")
            .where("ip", "==", userIP)
            .where("date", "==", today)
            .get();

        if (snapshot.size >= 3) {
            formError.textContent = "You've reached the limit of 3 messages per day. Try again tomorrow!";
            formError.style.display = "block";
            return;
        }

        const formData = {
            email: email,
            birthday: `<span class="math-inline">\{selectedMonth \+ 1\}/</span>{selectedDay}`,
            message: message,
            ip: userIP,
            date: today,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection("birthdayMessages").add(formData);

        formSuccess.textContent = "Thank you for joining the Birthday Message Chain!";
        formSuccess.style.display = 'block';
        birthdayForm.reset();

        selectedMonth = 0;
        selectedDay = 1;
        populateWheel(monthWheel, months);
        generateDays(selectedMonth);
        updateSelectedDate();
        charCountDisplay.textContent = "0/100 characters";

    } catch (error) {
        console.error("Error adding document:", error);
        formError.textContent = "Error saving your message. Please try again.";
        formError.style.display = 'block';
    }
});

// Get User IP Address
async function getUserIP() {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
