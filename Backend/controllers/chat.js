import { getChatbotResponse } from '../services/gemini.js';

/**
 * @desc    Handle an incoming chat message and get a response from Gemini
 * @route   POST /api/chat
 * @access  Private
 */
export const handleChatMessage = async (req, res) => {
  const { history, message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'A message is required.' });
  }
  
  // The history can be optional for the first message
  const conversationHistory = history || []; 

  try {
    const botResponse = await getChatbotResponse(conversationHistory, message);
    res.status(200).json({ reply: botResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while getting chat response.' });
  }
};
