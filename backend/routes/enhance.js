const express = require('express');
const router = express.Router();

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
      ? `You are a professional pitch writer for students applying to freelance jobs. Enhance this student introduction to make it more professional, confident and engaging. Keep it under 80 words. Only return the enhanced text, nothing else. Original: ${fieldValue}`
      : `You are a professional pitch writer for students applying to freelance jobs. Enhance this "Why Me" pitch section to make it more compelling, specific and confident. Keep it under 120 words. Only return the enhanced text, nothing else. Original: ${fieldValue}`;

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    const enhancedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (enhancedText) {
      return res.json({ enhancedText: enhancedText.trim() });
    } else {
      console.error('Gemini error response:', data);
      return res.status(500).json({ message: 'AI enhancement failed', details: data });
    }
  } catch (err) {
    console.error('AI route error:', err);
    return res.status(500).json({ message: 'Server error during AI enhancement' });
  }
});

module.exports = router;
