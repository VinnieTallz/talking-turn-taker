import { useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { SOCKET_EVENTS } from '../utils/socketEvents';

const SOCKET_URL = 'http://localhost:3000';

export function useSocket(setMessages, setUsers, setTimer, setCurrentSpeaker) {
  const socketRef = useRef();

  useEffect(() => {
    // Create new socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5
    });

    const socket = socketRef.current;

    socket.on(SOCKET_EVENTS.MESSAGE, (message) => {
      console.log('Received message:', message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on(SOCKET_EVENTS.USER_LIST, (users) => {
      console.log('Received user list:', users);
      setUsers(users);
    });

    socket.on(SOCKET_EVENTS.TIMER, (timerData) => {
      console.log('Received timer update:', timerData);
      setTimer(timerData);
    });

    socket.on(SOCKET_EVENTS.CURRENT_SPEAKER, ({ speaker }) => {
      console.log('Current speaker updated:', speaker);
      setCurrentSpeaker(speaker);
    });

    socket.on(SOCKET_EVENTS.ERROR, ({ message }) => {
      console.error('Socket error:', message);
      alert(message);
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [setMessages, setUsers, setTimer, setCurrentSpeaker]);

  const sendMessage = useCallback((message) => {
    if (socketRef.current?.connected) {
      console.log('Sending message:', message);
      socketRef.current.emit(SOCKET_EVENTS.MESSAGE, message);
    } else {
      console.error('Socket not connected');
    }
  }, []);

  const joinChat = useCallback((nickname) => {
    if (socketRef.current?.connected) {
      console.log('Joining chat with nickname:', nickname);
      socketRef.current.emit(SOCKET_EVENTS.JOIN, { nickname });
    } else {
      console.error('Socket not connected');
    }
  }, []);

  return { sendMessage, joinChat };
}

export default useSocket;