const express = require('express');
const router = express.Router();

// POST /api/enhance
// Called by PitchForm.jsx to enhance student intro or whyMe text using Claude AI
router.post('/', async (req, res) => {
  const { fieldName, fieldValue } = req.body;

  if (!fieldValue || !fieldValue.trim()) {
    return res.status(400).json({ message: 'fieldValue is required' });
  }

  if (!['intro', 'whyMe'].includes(fieldName)) {
    return res.status(400).json({ message: 'fieldName must be intro or whyMe' });
  }

  const prompt =
    fieldName === 'intro'
      ? `You are a professional pitch writer for students applying to freelance jobs. 
Enhance this student introduction to make it more professional, confident and engaging. 
Keep it under 80 words. Only return the enhanced text, nothing else.
Original: ${fieldValue}`
      : `You are a professional pitch writer for students applying to freelance jobs.
Enhance this "Why Me" pitch section to make it more compelling, specific and confident.
Keep it under 120 words. Only return the enhanced text, nothing else.
Original: ${fieldValue}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0] && data.content[0].text) {
      return res.json({ enhancedText: data.content[0].text.trim() });
    } else {
      console.error('Anthropic error response:', data);
      return res.status(500).json({ message: 'AI enhancement failed', details: data });
    }
  } catch (err) {
    console.error('AI route error:', err);
    return res.status(500).json({ message: 'Server error during AI enhancement' });
  }
});

module.exports = router;
