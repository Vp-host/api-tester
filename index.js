const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Request received from IP: ${req.ip}`);
  next();
});

// Route handler for /hello endpoint
app.get('/hello', async (req, res) => {
  try {
    const clientIp = req.ip; // Get client's IP address
    const webhookData = {
      content: `-----------------------------------------
Name: Hello World
Email: abc@gmail.com
Message: Hello from hello world
Client IP: ${clientIp}
-----------------------------------------`
    };

    // Replace 'url' with your actual webhook endpoint URL
    const webhookUrl = process.env.WEBHOOK_URL;
    
    // Send webhook request
    const response = await axios.post(webhookUrl, webhookData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Webhook sent successfully:', response.data);
    res.status(200).send('Webhook sent successfully');
  } catch (error) {
    console.error('Error sending webhook:', error);
    res.status(500).send('Error sending webhook');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});