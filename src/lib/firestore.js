import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  Timestamp 
} from 'firebase/firestore';

// Helper to convert Clerk user to Firestore profile
export async function createProfile(userId, email, fullName, role, avatarUrl = null) {
  try {
    const profileRef = doc(db, 'profiles', userId);
    await setDoc(profileRef, {
      clerk_user_id: userId,
      email,
      full_name: fullName,
      avatar_url: avatarUrl,
      role,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { error: error.message };
  }
}

// Get profile by Clerk user ID
export async function getProfileByClerkId(userId) {
  try {
    const q = query(collection(db, 'profiles'), where('clerk_user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { data: null, error: null };
    }
    
    const doc = querySnapshot.docs[0];
    return { data: { id: doc.id, ...doc.data() }, error: null };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { data: null, error: error.message };
  }
}

// Update profile
export async function updateProfile(userId, updates) {
  try {
    const q = query(collection(db, 'profiles'), where('clerk_user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { error: 'Profile not found' };
    }
    
    const profileRef = doc(db, 'profiles', querySnapshot.docs[0].id);
    await updateDoc(profileRef, {
      ...updates,
      updated_at: Timestamp.now(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: error.message };
  }
}

// Generic collection operations
export async function getCollection(collectionName, filters = []) {
  try {
    let q = collection(db, collectionName);
    
    if (filters.length > 0) {
      q = query(q, ...filters);
    }
    
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return { data: null, error: error.message };
  }
}

export async function getDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { data: null, error: 'Document not found' };
    }
    
    return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
  } catch (error) {
    console.error('Error fetching document:', error);
    return { data: null, error: error.message };
  }
}

export async function createDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error creating document:', error);
    return { error: error.message };
  }
}

export async function updateDocument(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updated_at: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating document:', error);
    return { error: error.message };
  }
}

export async function deleteDocument(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { error: error.message };
  }
}

// Timestamp helper
export { Timestamp };
