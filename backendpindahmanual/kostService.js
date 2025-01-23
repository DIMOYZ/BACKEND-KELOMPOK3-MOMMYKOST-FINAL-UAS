// backend/kostService.js

import { ref, push, onValue, update, remove, off } from 'firebase/database';
import { db } from './firebase';

/**
 * Menambahkan data kost baru
 * @param {string} name
 * @param {string} category
 * @param {string} price
 */
export async function addKost(name, category, price) {
  const kostsRef = ref(db, 'kosts');
  await push(kostsRef, {
    name,
    category,
    price
  });
}

/**
 * Mengambil semua data kost (realtime listener)
 * @param {function} callback - callback(kostArray)
 * @returns {function} unsubscribe
 */
export function listenAllKosts(callback) {
  const kostsRef = ref(db, 'kosts');
  const listener = onValue(kostsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const loadedKosts = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      callback(loadedKosts);
    } else {
      callback([]);
    }
  });

  // fungsi untuk berhenti mendengarkan
  return () => {
    off(kostsRef, 'value', listener);
  };
}

/**
 * Update data kost
 * @param {string} kostId
 * @param {object} newData { name, category, price, dsb. }
 */
export async function updateKost(kostId, newData) {
  const kostRef = ref(db, `kosts/${kostId}`);
  await update(kostRef, newData);
}

/**
 * Menghapus data kost
 * @param {string} kostId
 */
export async function deleteKost(kostId) {
  const kostRef = ref(db, `kosts/${kostId}`);
  await remove(kostRef);
}
