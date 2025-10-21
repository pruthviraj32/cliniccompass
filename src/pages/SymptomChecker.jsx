import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { analyzeSymptoms, generateVisitChecklist } from '../services/symptomChecker.service';
import Layout from '../components/Layout';
import { 
  Activity, AlertCircle, Home, Building2, AlertTriangle,
  CheckCircle, Clipboard, Mic, X
} from 'lucide-react';

export default function SymptomChecker() {
  const { t, language } = useLanguage();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [error, setError] = useState('');

  async function handleAnalyze() {
    if (!symptoms.trim()) {
      setError(language === 'es' 
        ? 'Por favor describe tus síntomas'
        : 'Please describe your symptoms');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);
      
      const analysis = await analyzeSymptoms(symptoms, language);
      setResult(analysis);

      // Generate checklist if clinic or ER visit recommended
      if (analysis.severity !== 'home') {
        const list = await generateVisitChecklist(symptoms, analysis.severity, language);
        setChecklist(list);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getSeverityConfig(severity) {
    const configs = {
      home: {
        title: t('recommendationHome'),
        advice: t('homeAdvice'),
        icon: Home,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100'
      },
      clinic: {
        title: t('recommendationClinic'),
        advice: t('clinicAdvice'),
        icon: Building2,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-900',
        iconColor: 'text-yellow-600',
        iconBg: 'bg-yellow-100'
      },
      emergency: {
        title: t('recommendationER'),
        advice: t('erAdvice'),
        icon: AlertTriangle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-900',
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100'
      }
    };
    return configs[severity] || configs.clinic;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary rounded-full p-4 mb-4">
            <Activity className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {t('howAreYouFeeling')}
          </h1>
          <p className="text-2xl text-gray-600">
            {t('describeSymptomsPrompt')}
          </p>
        </div>

        {/* Input Section */}
        <div className="card mb-8">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={t('describeSymptomsPlaceholder')}
            className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/50 focus:border-primary transition-all min-h-[200px] resize-none"
            disabled={loading}
          />

          {error && (
            <div className="mt-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span className="text-lg">{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !symptoms.trim()}
            className="btn-primary w-full mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                {t('analyzing')}
              </span>
            ) : (
              t('checkSymptoms')
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Severity Card */}
            <div className={`card border-4 ${getSeverityConfig(result.severity).borderColor} ${getSeverityConfig(result.severity).bgColor}`}>
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-full ${getSeverityConfig(result.severity).iconBg}`}>
                  {(() => {
                    const Icon = getSeverityConfig(result.severity).icon;
                    return <Icon className={`h-12 w-12 ${getSeverityConfig(result.severity).iconColor}`} />;
                  })()}
                </div>
                <div className="flex-1">
                  <h2 className={`text-3xl font-bold mb-3 ${getSeverityConfig(result.severity).textColor}`}>
                    {getSeverityConfig(result.severity).title}
                  </h2>
                  <p className="text-xl text-gray-800 mb-4 leading-relaxed">
                    {result.explanation}
                  </p>
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {language === 'es' ? 'Qué hacer:' : 'What to do:'}
                    </p>
                    <p className="text-xl text-gray-800">
                      {getSeverityConfig(result.severity).advice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <p className="text-base text-gray-600 italic">
                  ⚠️ {result.disclaimer}
                </p>
              </div>
            </div>

            {/* Checklist */}
            {checklist.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <Clipboard className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('visitChecklist')}
                  </h2>
                </div>
                <p className="text-xl text-gray-700 mb-4 font-semibold">
                  {t('bringTheseItems')}
                </p>
                <div className="space-y-3">
                  {checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                      <span className="text-lg text-gray-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {result.severity === 'clinic' && (
                <button
                  onClick={() => window.location.href = '/clinics'}
                  className="btn-secondary flex-1"
                >
                  {language === 'es' ? 'Buscar Clínicas' : 'Find Clinics'}
                </button>
              )}
              <button
                onClick={() => {
                  setSymptoms('');
                  setResult(null);
                  setChecklist([]);
                  setError('');
                }}
                className="btn-outline flex-1"
              >
                {language === 'es' ? 'Nueva Consulta' : 'New Check'}
              </button>
            </div>
          </div>
        )}

        {/* Example Symptoms */}
        {!result && !loading && (
          <div className="card bg-blue-50 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'es' ? 'Ejemplos:' : 'Examples:'}
            </h3>
            <div className="space-y-2">
              {(language === 'es' ? [
                'Me duele la cabeza desde ayer',
                'Tengo fiebre y tos',
                'Me duele el estómago después de comer',
                'Tengo dolor en el pecho'
              ] : [
                'My head hurts since yesterday',
                'I have fever and cough',
                'My stomach hurts after eating',
                'I have chest pain'
              ]).map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setSymptoms(example)}
                  className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-blue-100 transition-colors text-lg"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

