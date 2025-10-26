import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';

/**
 * GameChat Component - Real-time chat for discussion rounds
 */
export default function GameChat({ lobbyCode }) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Listen for new chat messages
    socket.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [socket]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit('send-chat', {
      code: lobbyCode,
      message: newMessage.trim()
    });

    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white/10 border-b border-white/20 px-4 py-3">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          💬 Live Chat
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            <p>No messages yet. Start the discussion!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.playerId === socket.id ? 'items-end' : 'items-start'
              }`}
            >
              <div className="text-xs text-white/60 mb-1 px-2">
                {msg.playerName}
              </div>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.playerId === socket.id
                    ? 'bg-yellow-400 text-blue-950'
                    : 'bg-white/20 text-white'
                }`}
              >
                <p className="break-words">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white/10 border-t border-white/20 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            maxLength={200}
            className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 placeholder-white/50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 rounded-lg text-blue-950 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-white/50 text-xs mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
