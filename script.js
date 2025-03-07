const firebaseConfig = {
    apiKey: "AIzaSyA0wcgv_6dH14g37F6fdqXv1A97amw23_w",
    authDomain: "birthdaymessagesapp.firebaseapp.com",
    projectId: "birthdaymessagesapp",
    storageBucket: "birthdaymessagesapp.firebasestorage.app",
    messagingSenderId: "220266164498",
    appId: "1:220266164498:web:2adcb2520b75f580cd83cb"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Form Submission
document.getElementById("birthdayForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const birthday = document.getElementById("birthday").value;
    const message = document.getElementById("message").value;
// Get the user's IP address
    const userIP = await getUserIP();
    if (!userIP) {
        document.getElementById("response").innerText = "Could not verify IP. Please try again later.";
        return;
    }

    // Check how many times this IP has submitted today
    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format
    const messagesRef = db.collection("birthdayMessages");

    const snapshot = await messagesRef.where("ip", "==", userIP).where("date", "==", today).get();

    if (snapshot.size >= 3) {
        document.getElementById("response").innerText = "You've reached the limit of 3 messages per day. Try again tomorrow!";
        return;
    }

    // Save the message with IP and date
    db.collection("birthdayMessages").add({
        email: email,
        birthday: birthday,
        message: message,
        ip: userIP,
        date: today,
        timestamp: new Date()
    })
    .then(() => {
        document.getElementById("response").innerText = "Your message has been saved!";
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
});
// Function to get user IP address
async function getUserIP() {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Error getting IP address:", error);
        return null;
    }
};