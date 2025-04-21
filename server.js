require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// This is your single target number
const recipientNumber = '+31621308158';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/send-sms', async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).send('Missing location data');
  }

  const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const message = `test\nLocation: ${googleMapsLink}`;

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipientNumber
    });

    console.log('Message sent:', result.sid);
    res.status(200).send('SMS with location sent');
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send('Failed to send SMS');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
