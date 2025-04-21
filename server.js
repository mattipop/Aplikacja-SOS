require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const targetNumber = '+31621308158';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // allow JSON body parsing

app.post('/send-sms', async (req, res) => {
  const { lat, lon } = req.body;

  // Basic check
  if (!lat || !lon) {
    return res.status(400).send('Missing location data');
  }

  const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
  const message = `test\nLocation: ${mapsLink}`;

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: targetNumber
    });

    res.status(200).send('SMS with location sent');
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send('Failed to send SMS');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
