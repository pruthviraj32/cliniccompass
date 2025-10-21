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
    throw new Error(language === 'es'
      ? 'No pude responder. Por favor intenta de nuevo.'
      : 'Could not respond. Please try again.'
    );
  }
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

