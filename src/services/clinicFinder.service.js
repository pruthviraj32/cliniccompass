/**
 * Find nearby clinics and health centers
 * Uses browser geolocation and mock data for demo
 * In production, would use Google Places API or similar
 */

// Mock clinic data for demo
const mockClinics = [
  {
    id: 1,
    name: 'Community Health Center',
    type: 'Free Clinic',
    address: '123 Main Street',
    phone: '(555) 123-4567',
    distance: 0.8,
    services: ['Primary Care', 'Dental', 'Mental Health'],
    cost: 'free',
    hours: 'Mon-Fri 8AM-6PM'
  },
  {
    id: 2,
    name: 'Neighborhood Medical Clinic',
    type: 'Low Cost',
    address: '456 Oak Avenue',
    phone: '(555) 234-5678',
    distance: 1.2,
    services: ['Urgent Care', 'Lab Tests', 'X-Ray'],
    cost: 'low',
    hours: 'Mon-Sat 7AM-9PM'
  },
  {
    id: 3,
    name: 'Free Health Services',
    type: 'Free Clinic',
    address: '789 Elm Street',
    phone: '(555) 345-6789',
    distance: 1.5,
    services: ['Primary Care', 'Pharmacy', 'Vaccines'],
    cost: 'free',
    hours: 'Tue-Thu 9AM-5PM'
  },
  {
    id: 4,
    name: 'Affordable Care Clinic',
    type: 'Sliding Scale',
    address: '321 Pine Road',
    phone: '(555) 456-7890',
    distance: 2.1,
    services: ['Family Medicine', 'Pediatrics', 'Women\'s Health'],
    cost: 'sliding',
    hours: 'Mon-Fri 8AM-8PM, Sat 9AM-3PM'
  },
  {
    id: 5,
    name: 'People\'s Health Center',
    type: 'Free Clinic',
    address: '654 Maple Drive',
    phone: '(555) 567-8901',
    distance: 2.8,
    services: ['Primary Care', 'Chronic Disease Management', 'Health Education'],
    cost: 'free',
    hours: 'Mon-Fri 8AM-6PM'
  }
];

/**
 * Get user's current location
 * @returns {Promise<{lat: number, lng: number}>}
 */
export async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

/**
 * Find clinics near user
 * @param {object} location - {lat, lng}
 * @param {string} filterType - 'all', 'free', 'low'
 * @returns {Promise<array>} - Array of clinics
 */
export async function findNearbyClinics(location = null, filterType = 'all') {
  try {
    // In production, would use Google Places API or similar
    // For demo, return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let clinics = [...mockClinics];

    // Filter by type
    if (filterType === 'free') {
      clinics = clinics.filter(c => c.cost === 'free');
    } else if (filterType === 'low') {
      clinics = clinics.filter(c => c.cost === 'low' || c.cost === 'sliding');
    }

    // Sort by distance
    clinics.sort((a, b) => a.distance - b.distance);

    return clinics;
  } catch (error) {
    console.error('Error finding clinics:', error);
    throw error;
  }
}

/**
 * Get directions to a clinic
 * @param {object} clinic - Clinic object
 * @returns {string} - Google Maps URL
 */
export function getDirectionsUrl(clinic) {
  const address = encodeURIComponent(clinic.address);
  return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
}

/**
 * Format phone number for calling
 * @param {string} phone - Phone number
 * @returns {string} - Tel URL
 */
export function getCallUrl(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return `tel:${cleaned}`;
}

