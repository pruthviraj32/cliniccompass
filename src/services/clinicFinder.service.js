/**
 * Find nearby clinics and health centers
 * Uses browser geolocation and generates location-specific data
 * In production, would use Google Places API or similar
 */

// Clinic name templates
const clinicNames = [
  'Community Health Center',
  'Neighborhood Medical Clinic',
  'Free Health Services',
  'Affordable Care Clinic',
  'People\'s Health Center',
  'Family Wellness Center',
  'County Health Department',
  'Federally Qualified Health Center',
  'Community Care Clinic',
  'Volunteers in Medicine'
];

// Street name templates
const streetNames = [
  'Main Street', 'Oak Avenue', 'Elm Street', 'Pine Road', 'Maple Drive',
  'First Street', 'Second Avenue', 'Market Street', 'Church Street', 'Park Avenue',
  'Washington Boulevard', 'Lincoln Drive', 'Jefferson Way', 'Madison Street', 'Monroe Avenue'
];

// Services available
const allServices = [
  ['Primary Care', 'Dental', 'Mental Health'],
  ['Urgent Care', 'Lab Tests', 'X-Ray'],
  ['Primary Care', 'Pharmacy', 'Vaccines'],
  ['Family Medicine', 'Pediatrics', 'Women\'s Health'],
  ['Primary Care', 'Chronic Disease Management', 'Health Education'],
  ['Dental', 'Vision', 'Pharmacy'],
  ['Mental Health', 'Substance Abuse', 'Counseling'],
  ['Prenatal Care', 'Women\'s Health', 'Family Planning']
];

/**
 * Get city and state from coordinates using reverse geocoding
 */
async function getCityFromCoords(lat, lng) {
  try {
    // Using Nominatim (OpenStreetMap) - free, no API key needed
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      {
        headers: {
          'User-Agent': 'ClinicCompass/1.0'
        }
      }
    );
    
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    const address = data.address || {};
    
    return {
      city: address.city || address.town || address.village || address.county || 'Your Area',
      state: address.state || '',
      country: address.country || 'USA'
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { city: 'Your Area', state: '', country: 'USA' };
  }
}

/**
 * Fetch real clinics using Google Places via CORS proxy
 * Note: In production, this should be called from your backend server
 */
async function fetchRealClinics(lat, lng) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key not found, using mock data');
    return null;
  }

  try {
    // Use PlacesService via script tag (best approach for frontend)
    // For now, using a CORS proxy for demo purposes
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    
    const query = `community health center OR free clinic near me`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=8000&key=${apiKey}`;
    
    const response = await fetch(corsProxy + encodeURIComponent(searchUrl));
    
    if (!response.ok) {
      console.warn('Google Places API request failed, using mock data');
      return null;
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.warn('No results from Google Places API');
      return null;
    }

    // Remove duplicates and format results
    const seen = new Set();
    const uniqueClinics = [];

    for (const place of data.results.slice(0, 10)) {
      if (!seen.has(place.place_id)) {
        seen.add(place.place_id);
        
        // Calculate distance
        const distance = calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng);
        
        // Determine cost type (heuristic based on name/types)
        let cost = 'sliding';
        const nameLower = place.name.toLowerCase();
        if (nameLower.includes('free') || nameLower.includes('charity') || nameLower.includes('volunteer')) {
          cost = 'free';
        } else if (nameLower.includes('community') || nameLower.includes('fqhc') || nameLower.includes('federally qualified')) {
          cost = 'sliding';
        } else if (nameLower.includes('affordable') || nameLower.includes('low cost')) {
          cost = 'low';
        }

        uniqueClinics.push({
          id: place.place_id,
          name: place.name,
          type: cost === 'free' ? 'Free Clinic' : cost === 'low' ? 'Low Cost' : 'Sliding Scale',
          address: place.formatted_address || place.vicinity,
          phone: 'Call for info', // Need Place Details API for phone
          distance: distance,
          services: guessServices(place.types || []),
          cost: cost,
          hours: place.opening_hours?.open_now ? 'Open Now' : 'Call for hours',
          rating: place.rating || null,
          placeId: place.place_id,
          googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
        });
      }
    }

    return uniqueClinics.slice(0, 8); // Return top 8
  } catch (error) {
    console.error('Error fetching real clinics:', error);
    return null;
  }
}

/**
 * Calculate distance between two coordinates (in miles)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return parseFloat(distance.toFixed(1));
}

/**
 * Guess services based on place types
 */
function guessServices(types) {
  const services = ['Primary Care'];
  
  if (types.includes('dentist')) services.push('Dental');
  if (types.includes('pharmacy')) services.push('Pharmacy');
  if (types.includes('hospital')) services.push('Emergency Care', 'X-Ray');
  if (types.includes('doctor')) services.push('Family Medicine');
  
  // Default services for community health centers
  if (services.length === 1) {
    services.push('Preventive Care', 'Health Screening');
  }
  
  return services;
}

/**
 * Generate location-specific clinics
 */
function generateClinics(locationInfo) {
  const { city, state } = locationInfo;
  const location = state ? `${city}, ${state}` : city;
  
  return clinicNames.slice(0, 6).map((name, index) => {
    const streetNum = Math.floor(Math.random() * 9000) + 1000;
    const street = streetNames[index % streetNames.length];
    const services = allServices[index % allServices.length];
    const costs = ['free', 'free', 'low', 'sliding', 'free', 'low'];
    const cost = costs[index];
    
    // Generate random area code based on location
    let areaCode = '555';
    if (state === 'Texas') areaCode = ['214', '512', '713', '210'][Math.floor(Math.random() * 4)];
    else if (state === 'California') areaCode = ['213', '415', '619', '818'][Math.floor(Math.random() * 4)];
    else if (state === 'New York') areaCode = ['212', '718', '516', '914'][Math.floor(Math.random() * 4)];
    else if (state === 'Florida') areaCode = ['305', '407', '561', '813'][Math.floor(Math.random() * 4)];
    
    const phone = `(${areaCode}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const hours = [
      'Mon-Fri 8AM-6PM',
      'Mon-Sat 7AM-9PM',
      'Tue-Thu 9AM-5PM',
      'Mon-Fri 8AM-8PM, Sat 9AM-3PM',
      'Mon-Fri 8AM-6PM',
      'Mon-Fri 9AM-5PM, Sat 9AM-1PM'
    ][index];
    
    return {
      id: index + 1,
      name: name,
      type: cost === 'free' ? 'Free Clinic' : cost === 'low' ? 'Low Cost' : 'Sliding Scale',
      address: `${streetNum} ${street}, ${location}`,
      phone: phone,
      distance: parseFloat((0.5 + Math.random() * 3).toFixed(1)),
      services: services,
      cost: cost,
      hours: hours
    };
  });
}

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
 * @param {object} location - {lat, lng} or null to get current location
 * @param {string} filterType - 'all', 'free', 'low'
 * @returns {Promise<array>} - Array of clinics
 */
export async function findNearbyClinics(location = null, filterType = 'all') {
  try {
    // Get user location if not provided
    if (!location) {
      try {
        location = await getUserLocation();
      } catch (error) {
        console.warn('Could not get location, using default');
        // Default to a generic location if geolocation fails
        location = { lat: 0, lng: 0 };
      }
    }

    let clinics = [];

    // Try to fetch real clinics from Google Places API first
    if (import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      console.log('Fetching real clinics from Google Places API...');
      const realClinics = await fetchRealClinics(location.lat, location.lng);
      if (realClinics && realClinics.length > 0) {
        clinics = realClinics;
        console.log(`Found ${clinics.length} real clinics`);
      }
    }

    // Fallback to generated clinics if no real data
    if (clinics.length === 0) {
      console.log('Using generated clinic data...');
      // Get city/state from coordinates
      const locationInfo = await getCityFromCoords(location.lat, location.lng);
      clinics = generateClinics(locationInfo);
    }

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

