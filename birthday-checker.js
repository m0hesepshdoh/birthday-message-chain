const admin = require("firebase-admin");
const SibApiV3Sdk = require('sib-api-v3-sdk');

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

async function checkBirthdaysAndSendEmails() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    console.log(`Checking Firestore 'submissions' collection for Month: ${currentMonth}, Day: ${currentDay}`);

    try {
        const snapshot = await db.collection("submissions")
            .where("birthMonth", "==", currentMonth)
            .where("birthDay", "==", currentDay)
            .get();

        if (snapshot.empty) {
            console.log("No birthdays found in 'submissions' for today.");
            return; 
        }

        console.log(`Found ${snapshot.size} birthday(s) today.`);

        const randomMessages = await getRandomMessages(snapshot.size);
        if (randomMessages.length === 0) {
            console.warn("Could not fetch any random messages. Using default.");
            randomMessages.push("Hope you have a wonderful day");
        }

        const emailPromises = [];
        let messageIndex = 0;

        snapshot.forEach((doc) => {
            const birthdayPerson = doc.data();
            if (!birthdayPerson.email || typeof birthdayPerson.email !== 'string' || !birthdayPerson.email.includes('@')) {
                console.warn(`Skipping submission ${doc.id} due to invalid email: ${birthdayPerson.email}`);
                return;
            }

            console.log(`Processing birthday for: ${birthdayPerson.email}`);

            const messageToSend = randomMessages[messageIndex % randomMessages.length];
            messageIndex++;

            emailPromises.push(
                sendSingleBirthdayEmail(birthdayPerson.email, messageToSend, SENDER_EMAIL)
            );
        });

        await Promise.all(emailPromises);
        console.log("Finished processing today's birthday emails.");

    } catch (error) {
        console.error("Error during birthday check/email process:", error);
    }
}

async function getRandomMessages(limit = 10) {
    const messages = [];
    try {
        const snapshot = await db.collection('submissions')
                                 .orderBy('timestamp', 'desc')
                                 .limit(Math.max(limit * 2, 50)) 
                                 .get();

        if (!snapshot.empty) {
             snapshot.forEach(doc => {
                const data = doc.data();
                if (data.message && data.message.trim() !== '') {
                    messages.push(data.message.trim());
                }
             });
        }
        console.log(`Workspaceed ${messages.length} potential random messages.`);

    } catch (error) {
        console.error("Error fetching random messages:", error);
    }
    return messages; 
}

async function sendSingleBirthdayEmail(recipientEmail, message, senderEmail) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email: recipientEmail }];
    sendSmtpEmail.sender = { name: SENDER_NAME, email: senderEmail };
    sendSmtpEmail.subject = "🎉 Happy Birthday from the Message Chain!";
    sendSmtpEmail.htmlContent = `
      <html><body>
        <h2>Happy Birthday! &#127881;</h2>
        <p>Someone in the Birthday Message Chain sent this to you :</p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin-left: 1em;">
          <p>${message}</p>
        </blockquote>
        <p>We hope you have a fantastic day!</p>
        <hr>
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
