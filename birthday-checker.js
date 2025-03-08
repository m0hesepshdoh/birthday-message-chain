const admin = require("firebase-admin");
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

// Firebase setup
const serviceAccount = require("./serviceAccountKey.json");  // 🔴 Get this from Firebase settings
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Brevo API setup
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Get today's date in MM/DD format
const today = new Date();
const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

// Check Firestore for birthdays
async function checkBirthdays() {
    try {
        const snapshot = await db.collection("users").where("birthday", "==", todayStr).get();

        if (snapshot.empty) {
            console.log("No birthdays today.");
            return;
        }

        snapshot.forEach(async (doc) => {
            const user = doc.data();
            await sendEmail(user.email, user.message);
        });
    } catch (error) {
        console.error("Error checking birthdays:", error);
    }
}

// Function to send email
async function sendEmail(recipientEmail, message) {
    const sendSmtpEmail = {
        to: [{ email: recipientEmail }],
        sender: { name: "Birthday Bot", email: "your-email@yourdomain.com" },
        subject: "🎉 Happy Birthday!",
        htmlContent: `<p>${message}</p>`
    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

// Run the birthday check
checkBirthdays();