import axios from 'axios';

/**
 * Analyzes produce text and image using Google's Gemini API.
 * @param {string} farmerText - The raw text from the farmer.
 * @param {string} imageUrl - The public URL of the uploaded produce image.
 * @param {object} location - The farmer's location object { type: 'Point', coordinates: [lon, lat] }.
 * @returns {Promise<object>} A promise that resolves to the structured JSON object from Gemini.
 */
export const analyzeProduceWithGemini = async (farmerText, imageUrl, location) => {
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // The prompt now dynamically uses the farmer's location coordinates.
  const prompt = `
    You are an expert agricultural analyst for the "VeggieHelp" platform in India.
    Analyze the provided user text and image. The farmer's location coordinates are [longitude, latitude]: [${location.coordinates[0]}, ${location.coordinates[1]}]. The current date is ${formattedDate}.

    User Text: "${farmerText}"

    Based on all the information, perform the following tasks and provide the output ONLY as a single, valid JSON object with no extra text or markdown:

    1. "categorizeProduct": Extract the produce item, quantity, and unit from the text.
    2. "assessQuality": Analyze the image at the provided URL and write a brief, one-sentence quality assessment.
    3. "suggestPrice": Based on the product, its quality, and current market trends for the provided location coordinates, suggest a fair market price per unit in INR.
    4. "generateAd": Write a short, catchy advertisement (20-25 words) in English with some Malayalam to attract local buyers.
  `;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg", // Assuming JPEG, can be made dynamic
              data: await axios.get(imageUrl, { responseType: 'arraybuffer' }).then(res => Buffer.from(res.data, 'binary').toString('base64'))
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(GEMINI_API_URL, requestBody);
    // The Gemini response is often wrapped in markdown, so we clean it.
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
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

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