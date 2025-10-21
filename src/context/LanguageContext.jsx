import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translations for English and Spanish
const translations = {
  en: {
    // Navigation
    home: 'Home',
    symptoms: 'Check Symptoms',
    medications: 'My Medications',
    visits: 'Hospital Visits',
    clinics: 'Find Clinics',
    chat: 'Ask Questions',
    profile: 'Profile',
    logout: 'Logout',
    
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    
    // Home
    welcome: 'Welcome to ClinicCompass',
    tagline: 'Your guide to affordable healthcare',
    description: 'Simple health guidance in your language. Check symptoms, track medicines, and find nearby clinics.',
    getStarted: 'Get Started',
    
    // Symptom Checker
    howAreYouFeeling: 'How are you feeling today?',
    describeSymptomsPrompt: 'Tell us in simple words what is bothering you',
    describeSymptomsPlaceholder: 'Example: My head hurts and I feel hot',
    checkSymptoms: 'Check Symptoms',
    analyzing: 'Looking at your symptoms...',
    
    // Triage
    recommendationHome: 'You can rest at home',
    recommendationClinic: 'Visit a clinic soon',
    recommendationER: 'Go to Emergency Room NOW',
    homeAdvice: 'Take rest, drink water, and watch for changes',
    clinicAdvice: 'Make an appointment with a doctor within 24-48 hours',
    erAdvice: 'This needs immediate medical attention. Go to ER or call 911',
    
    // Medications
    myMedications: 'My Medications',
    addMedication: 'Add Medicine',
    medicineName: 'Medicine Name',
    dosage: 'How Much',
    frequency: 'How Often',
    time: 'What Time',
    instructions: 'Special Instructions',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    
    // Hospital Visits
    myVisits: 'My Hospital Visits',
    addVisit: 'Add Visit',
    doctorName: 'Doctor Name',
    hospital: 'Hospital/Clinic',
    date: 'Date',
    reason: 'Reason for Visit',
    notes: 'Notes',
    upcoming: 'Upcoming',
    past: 'Past Visits',
    
    // Clinic Finder
    findClinics: 'Find Nearby Clinics',
    searching: 'Looking for clinics...',
    distance: 'miles away',
    free: 'Free',
    lowCost: 'Low Cost',
    getDirections: 'Get Directions',
    call: 'Call',
    
    // Chat
    askQuestion: 'Ask a Question',
    chatPlaceholder: 'Type your question here...',
    send: 'Send',
    exampleQuestions: 'Example Questions:',
    q1: 'Does this medicine cause side effects?',
    q2: 'When is my next hospital visit?',
    q3: 'Can I take these medicines together?',
    q4: 'What should I bring to my appointment?',
    
    // Checklist
    visitChecklist: 'Visit Checklist',
    bringTheseItems: 'Bring these items to your visit:',
    idCard: 'ID card or driver\'s license',
    insuranceCard: 'Insurance card (if you have one)',
    medicationList: 'List of all your medicines',
    symptomsWritten: 'Written notes about your symptoms',
    questions: 'Questions you want to ask the doctor',
    
    // Common
    loading: 'Loading...',
    error: 'Something went wrong',
    tryAgain: 'Try Again',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    yes: 'Yes',
    no: 'No',
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    symptoms: 'Revisar Síntomas',
    medications: 'Mis Medicinas',
    visits: 'Visitas al Hospital',
    clinics: 'Buscar Clínicas',
    chat: 'Hacer Preguntas',
    profile: 'Perfil',
    logout: 'Cerrar Sesión',
    
    // Auth
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    name: 'Nombre Completo',
    createAccount: 'Crear Cuenta',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    
    // Home
    welcome: 'Bienvenido a ClinicCompass',
    tagline: 'Tu guía para atención médica accesible',
    description: 'Orientación de salud simple en tu idioma. Revisa síntomas, rastrea medicinas y encuentra clínicas cercanas.',
    getStarted: 'Comenzar',
    
    // Symptom Checker
    howAreYouFeeling: '¿Cómo te sientes hoy?',
    describeSymptomsPrompt: 'Dinos en palabras simples qué te molesta',
    describeSymptomsPlaceholder: 'Ejemplo: Me duele la cabeza y me siento caliente',
    checkSymptoms: 'Revisar Síntomas',
    analyzing: 'Revisando tus síntomas...',
    
    // Triage
    recommendationHome: 'Puedes descansar en casa',
    recommendationClinic: 'Visita una clínica pronto',
    recommendationER: 'Ve a Emergencias AHORA',
    homeAdvice: 'Descansa, toma agua y observa los cambios',
    clinicAdvice: 'Haz una cita con un doctor en 24-48 horas',
    erAdvice: 'Esto necesita atención médica inmediata. Ve a emergencias o llama al 911',
    
    // Medications
    myMedications: 'Mis Medicinas',
    addMedication: 'Agregar Medicina',
    medicineName: 'Nombre de la Medicina',
    dosage: 'Cuánto',
    frequency: 'Con Qué Frecuencia',
    time: 'A Qué Hora',
    instructions: 'Instrucciones Especiales',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    
    // Hospital Visits
    myVisits: 'Mis Visitas al Hospital',
    addVisit: 'Agregar Visita',
    doctorName: 'Nombre del Doctor',
    hospital: 'Hospital/Clínica',
    date: 'Fecha',
    reason: 'Razón de la Visita',
    notes: 'Notas',
    upcoming: 'Próximas',
    past: 'Visitas Pasadas',
    
    // Clinic Finder
    findClinics: 'Buscar Clínicas Cercanas',
    searching: 'Buscando clínicas...',
    distance: 'millas de distancia',
    free: 'Gratis',
    lowCost: 'Bajo Costo',
    getDirections: 'Obtener Direcciones',
    call: 'Llamar',
    
    // Chat
    askQuestion: 'Hacer una Pregunta',
    chatPlaceholder: 'Escribe tu pregunta aquí...',
    send: 'Enviar',
    exampleQuestions: 'Ejemplos de Preguntas:',
    q1: '¿Esta medicina causa efectos secundarios?',
    q2: '¿Cuándo es mi próxima visita al hospital?',
    q3: '¿Puedo tomar estas medicinas juntas?',
    q4: '¿Qué debo llevar a mi cita?',
    
    // Checklist
    visitChecklist: 'Lista para la Visita',
    bringTheseItems: 'Lleva estos artículos a tu visita:',
    idCard: 'Tarjeta de identificación o licencia',
    insuranceCard: 'Tarjeta de seguro (si tienes una)',
    medicationList: 'Lista de todas tus medicinas',
    symptomsWritten: 'Notas escritas sobre tus síntomas',
    questions: 'Preguntas que quieres hacer al doctor',
    
    // Common
    loading: 'Cargando...',
    error: 'Algo salió mal',
    tryAgain: 'Intentar de Nuevo',
    back: 'Atrás',
    next: 'Siguiente',
    done: 'Hecho',
    yes: 'Sí',
    no: 'No',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isSpanish: language === 'es',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

