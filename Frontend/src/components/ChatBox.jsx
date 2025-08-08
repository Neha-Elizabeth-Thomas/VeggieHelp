// File: client/src/components/ChatBox.jsx

import React, { useState } from 'react';
import api from '../services/api'; // Import your centralized api service

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { from: 'system', text: 'Hi there! Need help with your listing?' },
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (newMsg.trim() === '' || isLoading) return;

    const userMessage = { from: 'farmer', text: newMsg };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMsg('');
    setIsLoading(true);

    try {
      // --- CORRECTED: Use the 'api' instance, not the default 'axios' ---
      // This ensures the request is sent with the authentication cookie.
      const response = await api.post('/chat', {
        history: messages,
        message: newMsg,
      });

      const systemReply = { from: 'system', text: response.data.reply };
      setMessages([...updatedMessages, systemReply]);

    } catch (error) {
      console.error("Error fetching chatbot reply:", error);
      const errorReply = { from: 'system', text: 'Sorry, I am having trouble connecting. Please try again.' };
      setMessages([...updatedMessages, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col border rounded-lg shadow-md p-4 bg-white">
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
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
