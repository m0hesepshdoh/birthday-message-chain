const admin = require("firebase-admin");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const serviceAccount = require("./serviceAccountKey.json");
try {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin SDK Initialized.");
  } else {
    console.log("Firebase Admin SDK already initialized.");
  }
} catch (error) {
  console.error("Firebase Admin SDK initialization error:", error);
  process.exit(1);
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
const brevoApiKey = brevoClient.authentications["api-key"];
brevoApiKey.apiKey = process.env.BREVO_API_KEY;
const brevoApiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_NAME = "Birthday Chain - سلسلة يوم الولادة";

function isArabic(text) {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

async function checkBirthdaysAndSendEmails() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  console.log(
    `Checking Firestore 'submissions' collection for Month: ${currentMonth}, Day: ${currentDay}`
  );

  try {
    const snapshot = await db
      .collection("submissions")
      .where("birthMonth", "==", currentMonth)
      .where("birthDay", "==", currentDay)
      .get();

    if (snapshot.empty) {
      console.log("No birthdays found for today.");
      return;
    }

    console.log(`Found ${snapshot.size} birthday(s) today.`);

    const randomMessagesPool = await getRandomMessages(snapshot.size);
    if (randomMessagesPool.length === 0) {
      console.warn("Could not fetch any random messages. Using default.");
      randomMessagesPool.push({
        message: "Hope you have a wonderful day",
        lang: "en"
      });
    }

    const emailPromises = [];
    let messageIndex = 0;

    snapshot.forEach((doc) => {
      const birthdayPerson = doc.data();
      if (
        !birthdayPerson.email ||
        typeof birthdayPerson.email !== "string" ||
        !birthdayPerson.email.includes("@")
      ) {
        console.warn(
          `Skipping submission ${doc.id} due to invalid email: ${birthdayPerson.email}`
        );
        return;
      }

      console.log(`Processing birthday for: ${birthdayPerson.email}`);

      const selectedMessageData =
        randomMessagesPool[messageIndex % randomMessagesPool.length];
      const messageToSend = selectedMessageData.message;
      messageIndex++;

      emailPromises.push(
        sendSingleBirthdayEmail(
          birthdayPerson.email,
          messageToSend,
          SENDER_EMAIL
        )
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
    const snapshot = await db
      .collection("submissions")
      .limit(Math.max(limit * 2, 50))
      .get();

    const potentialMessages = [];
    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.message && data.message.trim() !== "") {
          potentialMessages.push(data.message.trim());
        }
      });
    }

    potentialMessages.sort(() => 0.5 - Math.random());
    const selectedMessages = potentialMessages.slice(0, limit);

    console.log(
      `Selected ${selectedMessages.length} random messages from pool.`
    );
    return selectedMessages.map((msg) => ({ message: msg }));
  } catch (error) {
    console.error("Error fetching random messages:", error);
    return [];
  }
}

async function sendSingleBirthdayEmail(recipientEmail, message, senderEmail) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.to = [{ email: recipientEmail }];
  sendSmtpEmail.sender = { name: SENDER_NAME, email: senderEmail };

  const messageIsArabic = isArabic(message);

  if (messageIsArabic) {
    console.log(
      `Message for ${recipientEmail} detected as Arabic. Sending Arabic email.`
    );
    sendSmtpEmail.subject = "🎉 كل عام وأنت بخير";
    sendSmtpEmail.htmlContent = `
        <html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"></head>
        <body style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
            <h2>يوم ميلاد سعيد &#127881;</h2>
            <p>في شخص عشوائي رسل لك هذه الرسالة في يوم ميلادك</p>
            <blockquote style="border-right: 4px solid #ccc; border-left: none; padding-right: 1em; margin-right: 1em; margin-left: 0; text-align: right; font-style: italic;">
              <p>${message}</p>
            </blockquote>
            <p>نتمنى لك يوم سعيد 🎁</p>
            <hr>
            <a href="https://m0hesepshdoh.github.io/birthday-message-sender/" title="اكتب رسالتك لشخص عشوائي وكمل السلسلة">أكمل السلسلة</a>
            </body></html>`;
  } else {
    console.log(
      `Message for ${recipientEmail} detected as non-Arabic. Sending English email.`
    );
    sendSmtpEmail.subject = "🎉 Happy Birthday from the Message Chain!";
    sendSmtpEmail.htmlContent = `
        <html lang="en">
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif;">
            <h2>Happy Birthday! &#127881;</h2>
            <p>Someone in the Birthday Message Chain sent this to you :</p>
            <blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin-left: 1em; font-style: italic;">
              <p>${message}</p>
            </blockquote>
            <p>We hope you have a fantastic day!</p>
            <hr>
            <a href="https://m0hesepshdoh.github.io/birthday-message-sender/" title="Complete The Birthday Chain by Writing a Message">Continue the Chain</a>
        </body></html>`;
  }

  try {
    await brevoApiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      `✅ Birthday email successfully sent to ${recipientEmail} (${
        messageIsArabic ? "Arabic" : "English"
      })`
    );
  } catch (error) {
    const errorBody = error.response ? error.response.body : error;
    console.error(
      `❌ Error sending birthday email to ${recipientEmail}:`,
      JSON.stringify(errorBody, null, 2)
    );
  }
}
checkBirthdaysAndSendEmails();
