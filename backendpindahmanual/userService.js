// backend/userService.js

import { ref, onValue, update } from 'firebase/database';
import { db, auth } from './firebase';

/**
 * Ambil data user realtime
 * @param {string} uid
 * @param {function} callback - callback(snapshotVal)
 * @returns {function} unsubscribe
 */
export function listenUserData(uid, callback) {
  const userRef = ref(db, `users/${uid}`);
  const unsubscribe = onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });
  return () => {
    unsubscribe();
  };
}

/**
 * Update user profile
 * @param {string} uid 
 * @param {object} newData 
 * @returns {Promise<void>}
 */
export async function updateUserProfile(uid, newData) {
  await update(ref(db, `users/${uid}`), newData);
}
