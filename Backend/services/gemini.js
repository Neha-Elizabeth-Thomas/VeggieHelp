import axios from 'axios';

/**
 * Analyzes produce text and image using Google's Gemini API.
 * @param {string} farmerText - The raw text from the farmer.
 * @param {string} imageUrl - The public URL of the uploaded produce image.
 * @param {object} location - The farmer's location object { type: 'Point', coordinates: [lon, lat] }.
 * @returns {Promise<object>} A promise that resolves to the structured JSON object from Gemini.
 */
export const analyzeProduceWithGemini = async (farmerText, imageUrl, location) => {
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // --- MODIFIED PROMPT ---
  const prompt = `
    Analyze the user's text and the provided image of produce.
    The user is a farmer in India.
    The farmer's location coordinates are [longitude, latitude]: [${location.coordinates[0]}, ${location.coordinates[1]}].
    The current date is ${formattedDate}.
    User Text: "${farmerText}"

    Perform these tasks and respond ONLY with a single, valid JSON object:
    1. "categorizeProduct": An object containing three keys: "produceItem" (e.g., "tomato"), "quantity" (e.g., 50), and "unit" (e.g., "kg").
    2. "assessQuality": A brief, one-sentence quality assessment of the produce in the image.
    3. "suggestPrice": A suggested fair market price per unit in INR, as a number.
    4. "generateAd": A short, catchy advertisement (20-25 words) in Hinglish for local buyers.
  `;

  try {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBase64 = Buffer.from(imageResponse.data, 'binary').toString('base64');

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ]
    };

    const response = await axios.post(GEMINI_API_URL, requestBody);
    const rawJson = response.data.candidates[0].content.parts[0].text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
        
    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
    throw new Error('Failed to analyze produce with Gemini API.');
  }
};

/**
 * Generates a chatbot response using Gemini-Pro.
 * @param {Array<object>} history - The conversation history.
 * @param {string} newMessage - The new message from the user.
 * @returns {Promise<string>} A promise that resolves to the chatbot's text response.
 */
export const getChatbotResponse = async (history, newMessage) => {
  // Use the text-only model for chat
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

  // Construct the conversation history in the format Gemini expects
  const contents = history.map(msg => ({
    role: msg.from === 'farmer' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  // Add the new user message
  contents.push({
    role: 'user',
    parts: [{ text: newMessage }],
  });

  const systemInstruction = {
    role: 'system',
    parts: [{text: `You are a helpful and friendly assistant for the "SubziSahayak" platform. Your goal is to help Indian farmers and buyers. Keep your responses concise and clear.`}]
  }

  const requestBody = {
    contents,
    systemInstruction,
  };

  try {
    const response = await axios.post(GEMINI_API_URL, requestBody);
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini Chat API:", error.response ? error.response.data : error.message);
    throw new Error('Failed to get chatbot response from Gemini API.');
  }
};