// File: client/src/components/ChatBox.jsx

import React, { useState } from 'react';
import axios from 'axios'; // Import axios to make API calls

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { from: 'system', text: 'Hi there! Need help with your listing?' },
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to handle loading

  /**
   * Handles sending a message to the backend and receiving a reply.
   */
  const handleSend = async () => {
    // Prevent sending empty messages or sending while waiting for a reply
    if (newMsg.trim() === '' || isLoading) return;

    const userMessage = { from: 'farmer', text: newMsg };
    
    // Add user's message to the chat immediately for a responsive feel
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMsg('');
    setIsLoading(true);

    try {
      // Call the backend API endpoint
      const response = await axios.post('/api/chat', {
        history: messages, // Send the previous conversation history
        message: newMsg,   // Send the new user message
      });

      // Create the system reply object from the API response
      const systemReply = { from: 'system', text: response.data.reply };
      
      // Add the system's reply to the chat
      setMessages([...updatedMessages, systemReply]);

    } catch (error) {
      console.error("Error fetching chatbot reply:", error);
      // If there's an error, inform the user in the chat
      const errorReply = { from: 'system', text: 'Sorry, I am having trouble connecting. Please try again.' };
      setMessages([...updatedMessages, errorReply]);
    } finally {
      // Re-enable the input and button
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col border rounded-lg shadow-md p-4 bg-white">
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            // Use flex to align messages correctly
            className={`flex ${msg.from === 'farmer' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-2 rounded-lg max-w-[70%] text-left ${
                msg.from === 'farmer' ? 'bg-green-100' : 'bg-gray-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          className="flex-1 border rounded px-2 py-1 disabled:bg-gray-100"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
