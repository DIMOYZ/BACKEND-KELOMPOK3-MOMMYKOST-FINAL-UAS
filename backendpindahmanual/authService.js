// backend/authService.js

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
  } from 'firebase/auth';
  import { ref, set, get } from 'firebase/database';
  import { auth, db } from './firebase';
  
  /**
   * Mendaftarkan user baru (Register)
   * @param {string} email 
   * @param {string} password 
   * @param {object} profileData (username, profesi, gender, location, nohp, dll)
   * @returns {Promise<void>}
   */
  export async function registerUser(email, password, profileData) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    // Simpan data ke Realtime Database
    await set(ref(db, `users/${user.uid}`), {
      ...profileData,
      email,
      role: 'user', // default
    });
  }
  
  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<import("firebase/auth").UserCredential>}
   */
  export async function loginUser(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  }
  
  /**
   * Logout user saat ini
   * @returns {Promise<void>}
   */
  export async function logoutUser() {
    await signOut(auth);
  }
  
  /**
   * Mendengarkan perubahan status user login (onAuthStateChanged)
   * @param {function} callback 
   * @returns {function} unsubscribe function
   */
  export function onAuthChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
  
  /**
   * Mengambil data role (admin/user) user di DB
   * @param {string} uid user ID
   * @returns {Promise<string|undefined>} role
   */
  export async function getUserRole(uid) {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData.role; 
    }
    return undefined;
  }
  