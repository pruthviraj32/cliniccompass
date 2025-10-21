import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Mail, Lock, User, AlertCircle, Globe, CheckCircle, Sparkles, Zap, Heart } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.displayName || !formData.email || !formData.password) {
      setError(language === 'es' ? 'Por favor completa todos los campos' : 'Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError(language === 'es' ? 'La contraseña debe tener al menos 6 caracteres' : 'Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signup(formData.email, formData.password, formData.displayName);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError(language === 'es' 
          ? 'Este correo ya está registrado'
          : 'This email is already registered');
      } else {
        setError(language === 'es' 
          ? 'Error al crear cuenta. Intenta de nuevo.'
          : 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  const features = [
    { 
      icon: Zap, 
      text: language === 'es' ? 'Verificador de síntomas con IA' : 'AI-powered symptom checker',
      color: 'from-yellow-400 to-orange-500'
    },
    { 
      icon: Heart, 
      text: language === 'es' ? 'Rastreador de medicinas' : 'Medication tracker',
      color: 'from-red-400 to-pink-500'
    },
    { 
      icon: Compass, 
      text: language === 'es' ? 'Buscador de clínicas gratis' : 'Free clinic finder',
      color: 'from-green-400 to-emerald-500'
    },
    { 
      icon: Sparkles, 
      text: language === 'es' ? 'Asistente de salud 24/7' : '24/7 health assistant',
      color: 'from-blue-400 to-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center hero-pattern py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Language Toggle */}
        <div className="flex justify-end animate-fadeIn">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-5 py-3 glass-card hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Globe className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">{language === 'en' ? 'Español' : 'English'}</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center animate-scaleIn">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative gradient-bg rounded-full p-5 shadow-2xl glow animate-float">
              <Compass className="h-20 w-20 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-black mb-3">
            <span className="gradient-text">
              {language === 'es' ? 'Únete a' : 'Join'} ClinicCompass
            </span>
          </h2>
          <p className="text-xl text-gray-700 font-semibold">
            {t('tagline')}
          </p>
        </div>

        {/* Signup Form */}
        <form className="space-y-6 card card-glow animate-fadeIn" onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{t('createAccount')}</h3>
            <p className="text-base text-gray-600 mt-1">
              {language === 'es' ? '¡100% Gratis Para Siempre!' : '100% Free Forever!'}
            </p>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-800 px-5 py-4 rounded-2xl flex items-start gap-3 shadow-lg animate-scaleIn">
              <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span className="text-lg font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Name Input */}
            <div className="relative">
              <label htmlFor="displayName" className="block text-lg font-bold text-gray-900 mb-2">
                {t('name')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-6 w-6 text-primary transition-transform group-focus-within:scale-110" />
                </div>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  className="input-field pl-14"
                  placeholder={language === 'es' ? 'Juan Pérez' : 'John Doe'}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="block text-lg font-bold text-gray-900 mb-2">
                {t('email')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-6 w-6 text-primary transition-transform group-focus-within:scale-110" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-14"
                  placeholder="tu@ejemplo.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-lg font-bold text-gray-900 mb-2">
                {t('password')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-primary transition-transform group-focus-within:scale-110" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-14"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                {language === 'es' ? 'Mínimo 6 caracteres' : 'At least 6 characters'}
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-green-200 shadow-inner">
            <p className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              {language === 'es' ? 'Lo que obtendrás gratis:' : 'What you\'ll get for free:'}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-102">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-base font-medium text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-secondary w-full flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                {t('loading')}
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6" />
                {t('createAccount')}
              </>
            )}
          </button>

          {/* Sign in link */}
          <div className="text-center pt-2">
            <p className="text-lg text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <Link 
                to="/login" 
                className="font-bold text-primary hover:text-blue-700 transition-colors underline decoration-2 underline-offset-4"
              >
                {t('login')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
