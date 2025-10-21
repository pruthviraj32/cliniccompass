import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Add a new hospital visit
 */
export async function addHospitalVisit(userId, visitData) {
  try {
    const docRef = await addDoc(collection(db, 'hospital_visits'), {
      userId,
      doctorName: visitData.doctorName,
      hospital: visitData.hospital,
      date: visitData.date,
      reason: visitData.reason,
      notes: visitData.notes || '',
      completed: false,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding hospital visit:', error);
    throw error;
  }
}

/**
 * Get all hospital visits for a user
 */
export async function getHospitalVisits(userId) {
  try {
    const q = query(
      collection(db, 'hospital_visits'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const visits = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by date (client-side)
    visits.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Separate into upcoming and past
    const now = new Date();
    const upcoming = visits.filter(v => new Date(v.date) >= now && !v.completed);
    const past = visits.filter(v => new Date(v.date) < now || v.completed);

    return { upcoming, past, all: visits };
  } catch (error) {
    console.error('Error getting hospital visits:', error);
    throw error;
  }
}

/**
 * Update a hospital visit
 */
export async function updateHospitalVisit(visitId, updates) {
  try {
    const visitRef = doc(db, 'hospital_visits', visitId);
    await updateDoc(visitRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating hospital visit:', error);
    throw error;
  }
}

/**
 * Mark visit as completed
 */
export async function completeHospitalVisit(visitId, notes = '') {
  try {
    const visitRef = doc(db, 'hospital_visits', visitId);
    await updateDoc(visitRef, {
      completed: true,
      completedAt: Timestamp.now(),
      completionNotes: notes
    });
  } catch (error) {
    console.error('Error completing hospital visit:', error);
    throw error;
  }
}

/**
 * Delete a hospital visit
 */
export async function deleteHospitalVisit(visitId) {
  try {
    await deleteDoc(doc(db, 'hospital_visits', visitId));
  } catch (error) {
    console.error('Error deleting hospital visit:', error);
    throw error;
  }
}

