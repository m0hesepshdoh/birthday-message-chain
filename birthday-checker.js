const admin = require("firebase-admin");
const SibApiV3Sdk = require('sib-api-v3-sdk');

// --- Firebase Setup ---
// The serviceAccountKey.json is created by the GitHub Action step
const serviceAccount = require("./serviceAccountKey.json");
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin SDK Initialized.");
} catch (error) {
    if (!/already exists/i.test(error.message)) {
        console.error("Firebase Admin SDK initialization error:", error);
        process.exit(1);
    } else {
         console.log("Firebase Admin SDK already initialized.");
    }
}
const db = admin.firestore();

// --- Brevo API Setup ---
if (!process.env.BREVO_API_KEY) {
    console.error("❌ BREVO_API_KEY environment variable not set!");
    process.exit(1);
}
if (!process.env.SENDER_EMAIL) {
    console.error("❌ SENDER_EMAIL environment variable not set!");
    process.exit(1);
}

const brevoClient = SibApiV3Sdk.ApiClient.instance;
const brevoApiKey = brevoClient.authentications['api-key'];
brevoApiKey.apiKey = process.env.BREVO_API_KEY;
const brevoApiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_NAME = "Birthday Message Chain";

// --- Main Function ---
async function checkBirthdaysAndSendEmails() {
    const today = new Date();
    // Get current month (1-12) and day (1-31) as numbers
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    console.log(`Checking Firestore 'submissions' collection for Month: ${currentMonth}, Day: ${currentDay}`);

    try {
        // Query the 'submissions' collection using the numeric month and day fields
        const snapshot = await db.collection("submissions")
            .where("birthMonth", "==", currentMonth)
            .where("birthDay", "==", currentDay)
            .get();

        if (snapshot.empty) {
            console.log("No birthdays found in 'submissions' for today.");
            return; // Nothing more to do
        }

        console.log(`Found ${snapshot.size} birthday(s) today.`);

        // Get a pool of random messages to send
        const randomMessages = await getRandomMessages(snapshot.size);
        if (randomMessages.length === 0) {
            console.warn("Could not fetch any random messages. Using default.");
            // Ensure there's at least a default message
            randomMessages.push("Hope you have a wonderful day filled with joy!");
        }

        const emailPromises = [];
        let messageIndex = 0;

        snapshot.forEach((doc) => {
            const birthdayPerson = doc.data();
            // Basic check for email format, skip if invalid
            if (!birthdayPerson.email || typeof birthdayPerson.email !== 'string' || !birthdayPerson.email.includes('@')) {
                console.warn(`Skipping submission ${doc.id} due to invalid email: ${birthdayPerson.email}`);
                return; // continue to next iteration
            }

            console.log(`Processing birthday for: ${birthdayPerson.email}`);

            // Select a message to send, cycling through the fetched random messages
            const messageToSend = randomMessages[messageIndex % randomMessages.length];
            messageIndex++;

            // Add the email sending task to a list of promises
            emailPromises.push(
                sendSingleBirthdayEmail(birthdayPerson.email, messageToSend, SENDER_EMAIL)
            );
        });

        // Wait for all emails to be processed (sent or failed)
        await Promise.all(emailPromises);
        console.log("Finished processing today's birthday emails.");

    } catch (error) {
        console.error("Error during birthday check/email process:", error);
    }
}

/**
 * Fetches a batch of messages from Firestore to be used as random birthday wishes.
 * Tries not to fetch the messages from people having birthdays today if possible.
 * @param {number} limit Approx number of messages needed.
 * @returns {Promise<string[]>} A promise that resolves to an array of message strings.
 */
async function getRandomMessages(limit = 10) {
    const messages = [];
    try {
        // Fetch recent messages, maybe limit to 50-100 to get a good pool
        const snapshot = await db.collection('submissions')
                                 .orderBy('timestamp', 'desc')
                                 .limit(Math.max(limit * 2, 50)) // Fetch a decent pool
                                 .get();

        if (!snapshot.empty) {
             snapshot.forEach(doc => {
                const data = doc.data();
                // Ensure message exists and is not empty
                if (data.message && data.message.trim() !== '') {
                    messages.push(data.message.trim());
                }
             });
        }
        console.log(`Workspaceed ${messages.length} potential random messages.`);

    } catch (error) {
        console.error("Error fetching random messages:", error);
    }
    return messages; // Return even if empty, handled in main function
}


/**
 * Sends a single birthday email using Brevo.
 * @param {string} recipientEmail The email address of the birthday person.
 * @param {string} message The birthday message content (HTML).
 * @param {string} senderEmail The verified sender email address.
 * @returns {Promise<void>}
 */
async function sendSingleBirthdayEmail(recipientEmail, message, senderEmail) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email: recipientEmail }];
    sendSmtpEmail.sender = { name: SENDER_NAME, email: senderEmail };
    sendSmtpEmail.subject = "🎉 Happy Birthday from the Message Chain!";
    sendSmtpEmail.htmlContent = `
      <html><body>
        <h2>Happy Birthday! &#127881;</h2>
        <p>Someone in the Birthday Message Chain sent this wish your way:</p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin-left: 1em; font-style: italic;">
          <p>${message}</p>
        </blockquote>
        <p>We hope you have a fantastic day!</p>
        <hr>
        <p><small><em>The Birthday Message Chain Bot</em></small></p>
      </body></html>`;

    try {
        await brevoApiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Birthday email successfully sent to ${recipientEmail}`);
    } catch (error) {
        const errorBody = error.response ? error.response.body : error;
        console.error(`❌ Error sending birthday email to ${recipientEmail}:`, JSON.stringify(errorBody, null, 2));
    }
}

// --- Run the main function ---
// This makes the script execute the check when run by `node birthday-checker.js`
checkBirthdaysAndSendEmails();
