import React from 'react';

function UserList({ users, currentSpeaker }) {
  return (
    <div className="user-list">
      <h3>Connected Users</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index} className={user === currentSpeaker ? 'current-speaker' : ''}>
            {user} {user === currentSpeaker ? '(Speaking)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;