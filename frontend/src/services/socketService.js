import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

let socket;

export const connectSocket = () => {
  const token = localStorage.getItem('token');
  
  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

export const joinAppointment = (appointmentId) => {
  if (socket) {
    socket.emit('join-appointment', appointmentId);
  }
};

export const sendMessage = (appointmentId, message, sender) => {
  if (socket) {
    socket.emit('send-message', { appointmentId, message, sender });
  }
};

export const onReceiveMessage = (callback) => {
  if (socket) {
    socket.on('receive-message', callback);
  }
};

export const callUser = (appointmentId, offer, to) => {
  if (socket) {
    socket.emit('call-user', { appointmentId, offer, to });
  }
};

export const onCallMade = (callback) => {
  if (socket) {
    socket.on('call-made', callback);
  }
};

export const makeAnswer = (appointmentId, answer, to) => {
  if (socket) {
    socket.emit('make-answer', { appointmentId, answer, to });
  }
};

export const onAnswerMade = (callback) => {
  if (socket) {
    socket.on('answer-made', callback);
  }
};

export const sendIceCandidate = (appointmentId, candidate, to) => {
  if (socket) {
    socket.emit('ice-candidate', { appointmentId, candidate, to });
  }
};

export const onIceCandidate = (callback) => {
  if (socket) {
    socket.on('ice-candidate', callback);
  }
};
