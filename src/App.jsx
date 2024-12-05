import { useState, useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import Timer from './components/Timer';
import UserList from './components/UserList';
import useSocket from './hooks/useSocket';
import './App.css';

function App() {
  const [nickname, setNickname] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [timer, setTimer] = useState({ time: 30, isSpeakerTime: true });
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { sendMessage, joinChat } = useSocket(
    setMessages,
    setUsers,
    setTimer,
    setCurrentSpeaker
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      joinChat(nickname.trim());
      setIsJoined(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = messageInputRef.current.value.trim();
    if (message) {
      sendMessage(message);
      messageInputRef.current.value = '';
    }
  };

  if (!isJoined) {
    return (
      <div className="join-form">
        <h2>Join Chat</h2>
        <form onSubmit={handleJoin}>
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button type="submit">Join</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-app">
      <Timer 
        time={timer.time}
        isSpeakerTime={timer.isSpeakerTime}
        currentSpeaker={currentSpeaker}
      />
      
      <div className="chat-container">
        <UserList users={users} currentSpeaker={currentSpeaker} />
        
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            ref={messageInputRef}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;