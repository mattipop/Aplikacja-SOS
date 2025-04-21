require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const phoneNumbers = [
  '+31621308158'
];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/send-sms', async (req, res) => {
  const message = 'test'; // Your fixed SMS message

  try {
    const results = await Promise.all(
      phoneNumbers.map(number =>
        client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: number
        })
      )
    );

    console.log('Messages sent:', results.map(msg => msg.sid));
    res.status(200).send('SMS sent');
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send('Failed to send SMS');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
