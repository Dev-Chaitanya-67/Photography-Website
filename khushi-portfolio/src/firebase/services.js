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
  updateDoc,
  deleteDoc 
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

// --- 3. INQUIRIES SYSTEM ---

// Add New Inquiry (From Contact Page)
export const addInquiry = async (formData) => {
  try {
    // Create a new document reference with an auto-generated ID
    const newInquiryRef = doc(collection(db, "inquiries")); 
    
    const inquiryData = {
      id: newInquiryRef.id,
      ...formData,
      status: 'new', // new, read, contacted
      submittedAt: new Date().toISOString()
    };

    await setDoc(newInquiryRef, inquiryData);
    return { success: true };
  } catch (error) {
    console.error("Error adding inquiry:", error);
    return { success: false, message: error.message };
  }
};

// Get All Inquiries (For Admin Panel)
export const getInquiries = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "inquiries"));
    const list = querySnapshot.docs.map(doc => doc.data());
    // Sort by Date (Newest First)
    list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    return list;
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }
};

// Update Inquiry Status (e.g. Mark as Contacted)
export const updateInquiryStatus = async (id, newStatus) => {
  try {
    const ref = doc(db, "inquiries", id);
    await updateDoc(ref, { status: newStatus });
    return true;
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return false;
  }
};

// --- 4. PACKAGES SYSTEM ---

// Get All Packages
export const getAllPackages = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "packages"));
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by order or name if needed
        return list;
    } catch (error) {
        console.error("Error fetching packages:", error);
        return [];
    }
};

// Save Package (Create or Update)
export const savePackage = async (pkgData) => {
    try {
        const collectionRef = collection(db, "packages");
        // Use custom ID if provided (like 'basic', 'pro') or let Firestore gen one
        const docId = pkgData.id || doc(collectionRef).id; 
        const docRef = doc(db, "packages", docId);
        
        await setDoc(docRef, { ...pkgData, id: docId }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error saving package:", error);
        return { success: false, message: error.message };
    }
};

// Toggle Package Visibility
export const togglePackageHidden = async (id, currentHiddenStatus) => {
    try {
        await updateDoc(doc(db, "packages", id), { isHidden: !currentHiddenStatus });
        return true;
    } catch (error) {
        console.error("Error toggling package:", error);
        return false;
    }
};

// --- NEW: User Favorites ---
export const saveUserFavorites = async (uid, favorites) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      favorites: favorites 
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving favorites:", error);
    return { success: false, message: error.message };
  }
};
// --- 5. ARTIST PROFILE SYSTEM ---

export const getArtistProfile = async () => {
    try {
        const docRef = doc(db, 'siteContent', 'artistProfile');
        const snap = await getDoc(docRef);
        if (snap.exists()) return snap.data();
        return null;
    } catch (error) {
        console.error('Error fetching artist profile:', error);
        return null;
    }
};

export const saveArtistProfile = async (data) => {
    try {
        const docRef = doc(db, 'siteContent', 'artistProfile');
        await setDoc(docRef, data, { merge: true });
        return { success: true };
    } catch (error) {
        console.error('Error saving artist profile:', error);
        return { success: false, message: error.message };
    }
};

