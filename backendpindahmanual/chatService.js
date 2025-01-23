// backend/chatService.js

import { ref, onValue, push, off } from 'firebase/database';
import { db } from './firebase';

/**
 * Kirim pesan ke chat umum (group chat)
 * @param {string} userId 
 * @param {string} username 
 * @param {string} text 
 * @param {string} sender - "admin" atau "user"
 */
export async function sendGroupChatMessage(userId, username, text, sender = 'user') {
  const messagesRef = ref(db, 'chats/messages');
  await push(messagesRef, {
    text,
    timestamp: Date.now(),
    sender,
    username,
    userId
  });
}

/**
 * Listen chat group (realtime)
 * @param {function} callback - callback(arrayOfMessages)
 * @returns {function} unsubscribe
 */
export function listenGroupChat(callback) {
  const messagesRef = ref(db, 'chats/messages');
  const handleValue = onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const loadedMessages = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      // Urutkan berdasarkan timestamp
      loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
      callback(loadedMessages);
    } else {
      callback([]);
    }
  });
  return () => {
    off(messagesRef, 'value', handleValue);
  };
}

/**
 * Kirim pesan ke chat personal (user <-> admin), 
 * misal node: `chats/${someUserId}/messages`.
 * (Jika Anda mau struktur data seperti itu.)
 */
export async function sendPrivateMessage(userUid, text, sender = 'user', username = 'User') {
  const messagesRef = ref(db, `chats/${userUid}/messages`);
  await push(messagesRef, {
    text,
    timestamp: Date.now(),
    sender,
    username,
  });
}

/**
 * Listen chat personal (user <-> admin)
 */
export function listenPrivateChat(userUid, callback) {
  const messagesRef = ref(db, `chats/${userUid}/messages`);
  const handleValue = onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const loaded = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      loaded.sort((a, b) => a.timestamp - b.timestamp);
      callback(loaded);
    } else {
      callback([]);
    }
  });
  return () => {
    off(messagesRef, 'value', handleValue);
  };
}
