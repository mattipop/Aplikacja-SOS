require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Only one phone number
const targetNumber = '+31621308158';

app.use(express.static(path.join(__dirname, 'public')));

app.post('/send-sms', async (req, res) => {
  try {
    await client.messages.create({
      body: 'test',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: targetNumber
    });

    res.status(200).send('SMS sent');
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send('Failed to send SMS');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
