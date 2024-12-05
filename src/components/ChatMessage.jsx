import React from 'react';

function ChatMessage({ message }) {
  return (
    <div className="message">
      <span className="user">{message.user}: </span>
      <span className="text">{message.text}</span>
      <span className="timestamp">
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
}

export default ChatMessage;