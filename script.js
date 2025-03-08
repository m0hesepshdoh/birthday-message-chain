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

// Form Submission
document.getElementById("birthdayForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const birthday = document.getElementById("birthday").value.trim();
    const message = document.getElementById("message").value.trim();
    const responseText = document.getElementById("response");

    // Validate input fields
    if (!email || !birthday || !message) {
        responseText.innerText = "❌ Please fill in all fields.";
        return;
    }
    if (!validateEmail(email)) {
        responseText.innerText = "❌ Please enter a valid email.";
        return;
    }
    if (message.length > 100) {
        responseText.innerText = "❌ Message should not exceed 100 characters.";
        return;
    }

    try {
        // Get the user's IP address
        const userIP = await getUserIP();
        if (!userIP) {
            responseText.innerText = "❌ Could not verify IP. Please try again later.";
            return;
        }

        // Check daily submission limit (3 per IP)
        const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const snapshot = await db.collection("birthdayMessages")
            .where("ip", "==", userIP)
            .where("date", "==", today)
            .get();

        if (snapshot.size >= 3) {
            responseText.innerText = "⚠️ You've reached the limit of 3 messages per day. Try again tomorrow!";
            return;
        }

        // Save the message in Firestore
        await db.collection("birthdayMessages").add({
            email: email,
            birthday: birthday,
            message: message,
            ip: userIP,
            date: today,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        responseText.innerText = "✅ Your message has been saved!";
        document.getElementById("birthdayForm").reset(); // Clear the form after submission

    } catch (error) {
        console.error("❌ Error adding document:", error);
        responseText.innerText = "❌ Error saving your message. Please try again.";
    }
});

// Function to get user IP address
async function getUserIP() {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("❌ Error getting IP address:", error);
        return null;
    }
}

// Function to validate email format
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
