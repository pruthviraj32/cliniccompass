import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { sendChatMessage, quickQuestions } from '../services/chatbot.service';
import { getMedications } from '../services/medication.service';
import { getHospitalVisits } from '../services/hospitalVisit.service';
import Layout from '../components/Layout';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: language === 'es'
        ? '¡Hola! Soy tu asistente de salud. Puedo ayudarte con preguntas sobre tus medicinas, citas médicas y más. ¿Qué necesitas saber?'
        : 'Hi! I\'m your health assistant. I can help you with questions about your medications, appointments, and more. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({ medications: [], visits: [] });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadContext();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadContext() {
    try {
      const [meds, visits] = await Promise.all([
        getMedications(user.uid),
        getHospitalVisits(user.uid)
      ]);
      setContext({
        medications: meds,
        visits: visits.upcoming || []
      });
    } catch (error) {
      console.error('Error loading context:', error);
    }
  }

  async function handleSend(messageText = input) {
    const userMessage = messageText.trim();
    if (!userMessage || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await sendChatMessage(userMessage, {
        ...context,
        language
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'es'
          ? 'Lo siento, tuve un problema. Por favor intenta de nuevo.'
          : 'Sorry, I had a problem. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="text-center mb-6">
          <div className="inline-block bg-indigo-500 rounded-full p-4 mb-4">
            <MessageCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('askQuestion')}</h1>
          <p className="text-xl text-gray-600">
            {language === 'es'
              ? 'Haz preguntas sobre tus medicinas y citas'
              : 'Ask questions about your medications and appointments'}
          </p>
        </div>

        {/* Chat Box */}
        <div className="card bg-white h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-4 rounded-2xl text-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="border-t-2 border-gray-100 p-4">
              <p className="text-base font-semibold text-gray-700 mb-3">{t('exampleQuestions')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickQuestions[language].slice(0, 4).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(question)}
                    className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-base transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t-2 border-gray-100 p-4">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chatPlaceholder')}
                className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary px-6"
              >
                <Send className="h-6 w-6" />
              </button>
            </form>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 card bg-yellow-50 border-2 border-yellow-200">
          <p className="text-lg text-gray-700">
            <strong>{language === 'es' ? '⚠️ Importante:' : '⚠️ Important:'}</strong>{' '}
            {language === 'es'
              ? 'Soy un asistente de IA, no un doctor real. Para emergencias, llama al 911. Para consejo médico, consulta a un profesional de salud.'
              : 'I\'m an AI assistant, not a real doctor. For emergencies, call 911. For medical advice, consult a healthcare professional.'}
          </p>
        </div>
      </div>
    </Layout>
  );
}

