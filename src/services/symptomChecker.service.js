import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // For demo purposes only
});

/**
 * Analyzes symptoms and provides triage recommendation
 * @param {string} symptoms - User's description of symptoms
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<object>} - {severity: 'home'|'clinic'|'emergency', explanation: string, advice: string}
 */
export async function analyzeSymptoms(symptoms, language = 'en') {
  try {
    const systemPrompt = language === 'es' 
      ? `Eres un asistente médico útil. Analiza los síntomas del usuario y proporciona:
1. Nivel de urgencia: "home" (quedarse en casa), "clinic" (visitar clínica), o "emergency" (emergencia)
2. Explicación simple en español
3. Consejo claro en español

IMPORTANTE:
- Usa lenguaje muy simple
- Sé conservador - si hay duda, recomienda ver un doctor
- Siempre recuerda que NO eres un doctor
- Para síntomas graves (dolor de pecho, dificultad para respirar, sangrado severo), siempre recomienda "emergency"

Responde en JSON: {"severity": "home/clinic/emergency", "explanation": "...", "advice": "..."}`
      : `You are a helpful medical assistant. Analyze the user's symptoms and provide:
1. Urgency level: "home" (rest at home), "clinic" (visit clinic), or "emergency" (go to ER)
2. Simple explanation
3. Clear advice

IMPORTANT:
- Use very simple language (6th grade level)
- Be conservative - when in doubt, recommend seeing a doctor
- Always remind them you're not a doctor
- For serious symptoms (chest pain, breathing difficulty, severe bleeding), always recommend "emergency"

Respond in JSON: {"severity": "home/clinic/emergency", "explanation": "...", "advice": "..."}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: symptoms }
      ],
      temperature: 0.3, // Lower temperature for more consistent medical advice
      max_tokens: 400
    });

    const content = response.choices[0].message.content;
    
    // Parse JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (e) {
      // Fallback if JSON parsing fails
      result = {
        severity: 'clinic',
        explanation: content,
        advice: language === 'es' 
          ? 'Por favor consulta a un médico para estar seguro.'
          : 'Please consult a doctor to be sure.'
      };
    }

    // Add disclaimer
    result.disclaimer = language === 'es'
      ? 'Nota: Esta no es un consejo médico profesional. Siempre consulta a un doctor para diagnóstico y tratamiento.'
      : 'Note: This is not professional medical advice. Always consult a doctor for diagnosis and treatment.';

    return result;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    
    // If it's a rate limit error (429), provide demo response
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      console.warn('⚠️ OpenAI quota exceeded. Using demo mode.');
      return getDemoResponse(symptoms, language);
    }
    
    throw new Error(language === 'es' 
      ? 'No pudimos analizar los síntomas. Por favor intenta de nuevo.'
      : 'Could not analyze symptoms. Please try again.'
    );
  }
}

/**
 * Provides a demo response when OpenAI API is unavailable
 * This allows testing the app without API credits
 */
function getDemoResponse(symptoms, language) {
  const symptomsLower = symptoms.toLowerCase();
  
  // Emergency keywords
  const emergencyKeywords = ['chest pain', 'can\'t breathe', 'breathing', 'unconscious', 'severe bleeding', 'stroke', 'heart attack', 'dolor de pecho', 'no puedo respirar', 'sangrado severo'];
  const isEmergency = emergencyKeywords.some(keyword => symptomsLower.includes(keyword));
  
  // Clinic keywords
  const clinicKeywords = ['fever', 'pain', 'infection', 'cough', 'vomit', 'fiebre', 'dolor', 'infección', 'tos', 'vómito'];
  const needsClinic = clinicKeywords.some(keyword => symptomsLower.includes(keyword));
  
  if (isEmergency) {
    return {
      severity: 'emergency',
      explanation: language === 'es'
        ? '⚠️ Tus síntomas podrían ser graves. Es importante buscar atención médica de emergencia inmediatamente.'
        : '⚠️ Your symptoms could be serious. It\'s important to seek emergency medical attention immediately.',
      advice: language === 'es'
        ? 'Ve a la sala de emergencias ahora o llama al 911.'
        : 'Go to the emergency room now or call 911.',
      disclaimer: language === 'es'
        ? '🤖 MODO DEMO: Esta es una respuesta de demostración. Tu límite de OpenAI se ha excedido. Nota: Esta no es un consejo médico profesional.'
        : '🤖 DEMO MODE: This is a demo response. Your OpenAI quota has been exceeded. Note: This is not professional medical advice.',
      isDemo: true
    };
  } else if (needsClinic) {
    return {
      severity: 'clinic',
      explanation: language === 'es'
        ? 'Basado en tus síntomas, sería bueno que visites una clínica para una evaluación profesional.'
        : 'Based on your symptoms, it would be good to visit a clinic for a professional evaluation.',
      advice: language === 'es'
        ? 'Programa una cita con un médico en los próximos días. Mientras tanto, descansa y mantente hidratado.'
        : 'Schedule an appointment with a doctor in the next few days. Meanwhile, rest and stay hydrated.',
      disclaimer: language === 'es'
        ? '🤖 MODO DEMO: Esta es una respuesta de demostración. Tu límite de OpenAI se ha excedido. Nota: Esta no es un consejo médico profesional.'
        : '🤖 DEMO MODE: This is a demo response. Your OpenAI quota has been exceeded. Note: This is not professional medical advice.',
      isDemo: true
    };
  } else {
    return {
      severity: 'home',
      explanation: language === 'es'
        ? 'Tus síntomas parecen leves. Puedes cuidarte en casa con reposo.'
        : 'Your symptoms seem mild. You can take care of yourself at home with rest.',
      advice: language === 'es'
        ? 'Descansa, toma líquidos, y monitorea tus síntomas. Si empeoran, consulta a un médico.'
        : 'Rest, drink fluids, and monitor your symptoms. If they worsen, consult a doctor.',
      disclaimer: language === 'es'
        ? '🤖 MODO DEMO: Esta es una respuesta de demostración. Tu límite de OpenAI se ha excedido. Nota: Esta no es un consejo médico profesional.'
        : '🤖 DEMO MODE: This is a demo response. Your OpenAI quota has been exceeded. Note: This is not professional medical advice.',
      isDemo: true
    };
  }
}

/**
 * Generates a visit checklist based on symptoms and visit type
 * @param {string} symptoms - User's symptoms
 * @param {string} visitType - Type of visit
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<string[]>} - Array of checklist items
 */
export async function generateVisitChecklist(symptoms, visitType, language = 'en') {
  const baseChecklist = language === 'es' ? [
    'Tarjeta de identificación',
    'Tarjeta de seguro médico (si tienes)',
    'Lista de todas tus medicinas actuales',
    'Notas sobre tus síntomas'
  ] : [
    'ID card or driver\'s license',
    'Insurance card (if you have one)',
    'List of all current medications',
    'Notes about your symptoms'
  ];

  try {
    const prompt = language === 'es'
      ? `El usuario tiene estos síntomas: "${symptoms}". Sugiere 3 preguntas importantes que deben hacer al doctor. Responde con una lista simple.`
      : `User has these symptoms: "${symptoms}". Suggest 3 important questions they should ask the doctor. Respond with a simple list.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    });

    const questions = response.choices[0].message.content
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3);

    return [...baseChecklist, ...questions];
  } catch (error) {
    console.error('Error generating checklist:', error);
    return baseChecklist;
  }
}

