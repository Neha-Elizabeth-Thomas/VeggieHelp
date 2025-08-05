import React, { useState } from 'react';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { from: 'system', text: 'Hi there! Need help with your listing?' },
  ]);
  const [newMsg, setNewMsg] = useState('');

  const handleSend = () => {
    if (newMsg.trim() === '') return;
    setMessages([...messages, { from: 'farmer', text: newMsg }]);
    setNewMsg('');
    // Simulate system reply
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'system', text: 'Thanks for your message!' }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col border rounded-lg shadow-md p-4 bg-white">
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md max-w-[70%] ${
              msg.from === 'farmer' ? 'bg-green-100 self-end text-right' : 'bg-gray-100 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
