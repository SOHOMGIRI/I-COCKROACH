const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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
    const HF_API_KEY = process.env.HF_API_KEY;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    const data = await response.json();
    const enhancedText = Array.isArray(data) ? data[0]?.generated_text : null;

    if (enhancedText) {
      return res.json({ enhancedText: enhancedText.trim() });
    } else {
      console.error('HuggingFace error response:', data);
      return res.status(500).json({ message: 'AI enhancement failed', details: data });
    }
  } catch (err) {
    console.error('AI route error:', err);
    return res.status(500).json({ message: 'Server error during AI enhancement' });
  }
});

module.exports = router;
