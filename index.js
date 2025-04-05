const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendEmail(recipientEmail, message) {
    const sendSmtpEmail = {
        to: [{ email: recipientEmail }],
        sender: { name: "Birthday Bot", email: "your-email@yourdomain.com" },
        subject: "Happy Birthday!",
        htmlContent: `<p>${message}</p>`
    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}
