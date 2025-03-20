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
document.getElementById("birthdayForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const birthday = document.getElementById("selectedDate").textContent.split(": ")[1].split(" - ")[0].trim(); // Extract selected date
  const message = document.getElementById("message").value.trim();
  const formSuccess = document.getElementById("form-success");
  const formError = document.getElementById("form-error");

  formError.style.display = "none";
  formSuccess.style.display = "none";

  // Validate input fields
  let hasErrors = false;
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  if (!email) {
    emailError.textContent = "Email is required.";
    hasErrors = true;
  } else if (!validateEmail(email)) {
    emailError.textContent = "Please enter a valid email.";
    hasErrors = true;
  } else {
    emailError.textContent = "";
  }

  if (!message) {
    messageError.textContent = "Message is required.";
    hasErrors = true;
  } else if (message.length > 100) {
    messageError.textContent = "Message should not exceed 100 characters.";
    hasErrors = true;
  } else {
    messageError.textContent = "";
  }

  if (hasErrors) {
    formError.textContent = "Please correct the errors above.";
    formError.style.display = "block";
    return;
  }

  try {
    // Get the user's IP address
    const userIP = await getUserIP();
    if (!userIP) {
      formError.textContent = "Could not verify IP. Please try again later.";
      formError.style.display = "block";
      return;
    }

    // Check daily submission limit (3 per IP)
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const snapshot = await db.collection("birthdayMessages")
      .where("ip", "==", userIP)
      .where("date", "==", today)
      .get();

    if (snapshot.size >= 3) {
      formError.textContent = "You've reached the limit of 3 messages per day. Try again tomorrow!";
      formError.style.display = "block";
      return;
    }

    // Save the message in Firestore
    await db.collection("birthdayMessages").add({
      email: email,
      birthday: birthday,
      message: message,
      ip: userIP,
      date: today,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    formSuccess.textContent = "Thank you for joining the Birthday Message Chain!";
    formSuccess.style.display = "block";
    document.getElementById("birthdayForm").reset(); // Clear the form after submission

    // Reset date wheels and char count
    selectedMonth = 0;
    selectedDay = 1;
    populateWheel(monthWheel, months);
    generateDays(selectedMonth);
    updateSelectedDate();
    charCountDisplay.textContent = "0/100 characters";

  } catch (error) {
    console.error("Error adding document:", error);
    formError.textContent = "Error saving your message. Please try again.";
    formError.style.display = "block";
  }
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
}

// Function to validate email format
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
