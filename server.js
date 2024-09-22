const express = require('express');
const cors = require('cors');
const mime = require('mime-types');  // To detect MIME type
const app = express();

// Use the port provided by Render or fallback to 3000 for local development
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));  // Increase the limit to handle Base64 file data

app.post('/bfhl', (req, res) => {
  const data = req.body.data;
  const file_b64 = req.body.file_b64;  // Accept Base64 encoded file

  // Log the received data for debugging
  console.log('Received body:', req.body);

  // Validate that the data is an array
  if (!Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      message: 'Data should be an array',
    });
  }

  const userId = 'ap9140';
  const email = 'ap9140@srmist.edu.in';
  const rollNumber = 'RA2111003011035';

  // Filtering numbers and alphabets
  const numbers = data.filter((item) => !isNaN(item) && !isNaN(parseFloat(item)));
  const alphabets = data.filter((item) => isNaN(item));

  // Find the highest lowercase alphabet
  const lowercaseAlphabets = alphabets.filter((item) => item === item.toLowerCase());
  const highestLowercaseAlphabet = lowercaseAlphabets.length > 0
    ? lowercaseAlphabets.sort((a, b) => b.localeCompare(a))[0]
    : null;

  // Handle file processing (Base64 file validation)
  let fileValid = false;
  let fileMimeType = null;
  let fileSizeKB = null;

  if (file_b64) {
    const buffer = Buffer.from(file_b64, 'base64');
    console.log('Buffer:', buffer);  // Log buffer for debugging
    fileMimeType = mime.lookup(buffer);
    console.log('MIME Type:', fileMimeType);  // Log MIME type for debugging
    fileSizeKB = Buffer.byteLength(buffer) / 1024;
    fileValid = fileMimeType ? true : false;
  }

  // Return the response with all processed data
  res.json({
    is_success: true,
    user_id: userId,
    email,
    roll_number: rollNumber,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  });
});

app.get('/bfhl', (req, res) => {
  res.json({ operation_code: 1 });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
