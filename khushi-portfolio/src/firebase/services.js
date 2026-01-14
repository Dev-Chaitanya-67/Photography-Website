import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail // <--- IMPORT THIS
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  updateDoc 
} from "firebase/firestore";
import { auth, db } from "./config.js";// Import the keys you just set up

// --- 1. AUTHENTICATION ---

// Register New User
export const registerUser = async (name, email, password) => {
  try {
    // A. Create Account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // B. Create "User Profile" in Firestore Database
    const userData = {
      uid: user.uid,
      name: name,
      email: email,
      eventName: "Welcome Guest", // Default
      folderId: "", // Empty initially
      hasBooking: false,
      role: "client", // default role
      createdAt: new Date().toISOString()
    };

    // Save to 'users' collection using UID as the document ID
    await setDoc(doc(db, "users", user.uid), userData);

    return { success: true, user: userData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const resetUserPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Reset link sent to your email!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    // A. Verify Credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // B. Fetch their Profile Data (Name, Folder ID, etc.)
    const userDoc = await getDoc(doc(db, "users", uid));
    
    if (userDoc.exists()) {
      return { success: true, user: userDoc.data() };
    } else {
      return { success: false, message: "User profile not found." };
    }
  } catch (error) {
    return { success: false, message: "Invalid email or password." };
  }
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};

// --- 2. ADMIN POWERS ---

// Get All Users (For Admin Panel)
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    // Convert snapshot to array
    const usersList = querySnapshot.docs.map(doc => doc.data());
    return usersList;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Update User (Approve Booking / Save Folder ID)
export const updateUserField = async (uid, field, value) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      [field]: value
    });
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};