import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // For demo purposes only
});

/**
 * Send a message to the AI chatbot with context about user's medications and visits
 * @param {string} message - User's question
 * @param {object} context - { medications: [], visits: [], language: 'en'|'es' }
 * @returns {Promise<string>} - AI response
 */
export async function sendChatMessage(message, context = {}) {
  const { medications = [], visits = [], language = 'en' } = context;

  try {
    // Build context for AI
    let contextInfo = '';
    
    if (medications.length > 0) {
      const medList = medications.map(m => 
        `${m.name} (${m.dosage}, ${m.frequency})`
      ).join(', ');
      contextInfo += language === 'es'
        ? `\n\nMedicinas actuales del usuario: ${medList}`
        : `\n\nUser's current medications: ${medList}`;
    }

    if (visits.length > 0) {
      const nextVisit = visits[0];
      contextInfo += language === 'es'
        ? `\n\nPróxima visita: ${nextVisit.doctorName} en ${nextVisit.hospital} el ${nextVisit.date}`
        : `\n\nNext visit: ${nextVisit.doctorName} at ${nextVisit.hospital} on ${nextVisit.date}`;
    }

    const systemPrompt = language === 'es'
      ? `Eres un asistente médico amigable y útil. Ayuda a los usuarios con preguntas sobre:
- Sus medicinas y posibles efectos secundarios
- Sus próximas citas médicas
- Qué llevar a las visitas al doctor
- Interacciones entre medicamentos
- Cuándo buscar atención médica

IMPORTANTE:
- Usa lenguaje muy simple
- Sé amable y comprensivo
- Siempre recuerda que NO eres un doctor real
- Para emergencias, dile que llame al 911
- No diagnostiques enfermedades

${contextInfo}`
      : `You are a friendly and helpful medical assistant. Help users with questions about:
- Their medications and possible side effects
- Their upcoming doctor appointments
- What to bring to doctor visits
- Drug interactions
- When to seek medical care

IMPORTANT:
- Use very simple language (6th grade level)
- Be kind and understanding
- Always remind them you're not a real doctor
- For emergencies, tell them to call 911
- Don't diagnose illnesses

${contextInfo}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in chatbot:', error);
    
    // If it's a rate limit error (429), provide demo response
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      console.warn('⚠️ OpenAI quota exceeded. Using demo chatbot response.');
      return getDemoChatResponse(message, context);
    }
    
    throw new Error(language === 'es'
      ? 'No pude responder. Por favor intenta de nuevo.'
      : 'Could not respond. Please try again.'
    );
  }
}

/**
 * Provides demo chatbot responses when OpenAI API is unavailable
 */
function getDemoChatResponse(message, context) {
  const { medications = [], visits = [], language = 'en' } = context;
  const messageLower = message.toLowerCase();
  
  // Medication questions
  if (messageLower.includes('side effect') || messageLower.includes('efecto') || messageLower.includes('secundario')) {
    if (medications.length > 0) {
      return language === 'es'
        ? `🤖 MODO DEMO: Estás tomando ${medications[0].name}. Los efectos secundarios comunes pueden incluir náuseas, mareos o dolor de cabeza. Si experimentas efectos secundarios graves, contacta a tu médico. Nota: Esta es una respuesta de demostración ya que tu límite de OpenAI se ha excedido.`
        : `🤖 DEMO MODE: You're taking ${medications[0].name}. Common side effects may include nausea, dizziness, or headache. If you experience severe side effects, contact your doctor. Note: This is a demo response as your OpenAI quota has been exceeded.`;
    }
  }
  
  // Next visit questions
  if (messageLower.includes('next visit') || messageLower.includes('appointment') || messageLower.includes('próxima') || messageLower.includes('cita')) {
    if (visits.length > 0) {
      const nextVisit = visits[0];
      return language === 'es'
        ? `🤖 MODO DEMO: Tu próxima visita es con ${nextVisit.doctorName} en ${nextVisit.hospital} el ${nextVisit.date}. Recuerda llevar tu identificación, tarjeta de seguro y lista de medicamentos. Nota: Esta es una respuesta de demostración.`
        : `🤖 DEMO MODE: Your next visit is with ${nextVisit.doctorName} at ${nextVisit.hospital} on ${nextVisit.date}. Remember to bring your ID, insurance card, and medication list. Note: This is a demo response.`;
    } else {
      return language === 'es'
        ? `🤖 MODO DEMO: No tienes visitas programadas actualmente. Puedes agregar una en la sección "Hospital Visits". Nota: Esta es una respuesta de demostración.`
        : `🤖 DEMO MODE: You don't have any visits scheduled currently. You can add one in the "Hospital Visits" section. Note: This is a demo response.`;
    }
  }
  
  // Drug interaction questions
  if (messageLower.includes('together') || messageLower.includes('interact') || messageLower.includes('juntas') || messageLower.includes('interacción')) {
    return language === 'es'
      ? `🤖 MODO DEMO: Es importante consultar con tu médico o farmacéutico sobre posibles interacciones entre medicamentos. Ellos pueden revisar todas tus medicinas y darte consejos personalizados. Nota: Esta es una respuesta de demostración ya que tu límite de OpenAI se ha excedido.`
      : `🤖 DEMO MODE: It's important to check with your doctor or pharmacist about possible drug interactions. They can review all your medications and give you personalized advice. Note: This is a demo response as your OpenAI quota has been exceeded.`;
  }
  
  // Default response
  return language === 'es'
    ? `🤖 MODO DEMO: Hola! Soy tu asistente de salud. Puedo ayudarte con preguntas sobre medicinas, citas médicas y consejos generales de salud. Recuerda que no soy un doctor real. Para emergencias, llama al 911. Nota: Esta es una respuesta de demostración ya que tu límite de OpenAI se ha excedido. Para usar el chatbot completo con IA, agrega créditos a tu cuenta de OpenAI.`
    : `🤖 DEMO MODE: Hi! I'm your health assistant. I can help with questions about medications, appointments, and general health advice. Remember, I'm not a real doctor. For emergencies, call 911. Note: This is a demo response as your OpenAI quota has been exceeded. To use the full AI chatbot, add credits to your OpenAI account.`;
}

/**
 * Quick responses for common questions
 */
export const quickQuestions = {
  en: [
    'What are the side effects of my medicine?',
    'When is my next doctor visit?',
    'Can I take these medicines together?',
    'What should I bring to my appointment?',
    'How do I take this medicine?',
    'What if I miss a dose?'
  ],
  es: [
    '¿Cuáles son los efectos secundarios de mi medicina?',
    '¿Cuándo es mi próxima visita al doctor?',
    '¿Puedo tomar estas medicinas juntas?',
    '¿Qué debo llevar a mi cita?',
    '¿Cómo tomo esta medicina?',
    '¿Qué pasa si olvido una dosis?'
  ]
};

