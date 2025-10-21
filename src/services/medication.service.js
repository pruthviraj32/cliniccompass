import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Add a new medication
 */
export async function addMedication(userId, medicationData) {
  try {
    const docRef = await addDoc(collection(db, 'medications'), {
      userId,
      name: medicationData.name,
      dosage: medicationData.dosage,
      frequency: medicationData.frequency,
      time: medicationData.time,
      instructions: medicationData.instructions || '',
      active: true,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw error;
  }
}

/**
 * Get all medications for a user
 */
export async function getMedications(userId) {
  try {
    const q = query(
      collection(db, 'medications'),
      where('userId', '==', userId),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting medications:', error);
    throw error;
  }
}

/**
 * Update a medication
 */
export async function updateMedication(medicationId, updates) {
  try {
    const medRef = doc(db, 'medications', medicationId);
    await updateDoc(medRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
}

/**
 * Delete a medication (soft delete)
 */
export async function deleteMedication(medicationId) {
  try {
    const medRef = doc(db, 'medications', medicationId);
    await updateDoc(medRef, {
      active: false,
      deletedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
}

