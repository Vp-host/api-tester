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
    const requestMethod = req.method; // Get request method
    const requestUrl = req.originalUrl; // Get request URL
    const requestHeaders = req.headers; // Get request headers
    const requestTime = new Date().toISOString(); // Get request timestamp

    const metadata = {
      ip: clientIp,
      method: requestMethod,
      url: requestUrl,
      headers: requestHeaders,
      timestamp: requestTime
    };

    const webhookData = {
      content: `-----------------------------------------
Name: Hello World
Email: abc@gmail.com
Message: Hello from hello world
Client IP: ${clientIp}
Request Method: ${requestMethod}
Request URL: ${requestUrl}
Request Headers: ${JSON.stringify(requestHeaders, null, 2)}
Request Time: ${requestTime}
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
    res.status(200).json({
      message: 'Webhook sent successfully',
      metadata: metadata
    });
  } catch (error) {
    console.error('Error sending webhook:', error);
    res.status(500).json({
      message: 'Error sending webhook',
      error: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});