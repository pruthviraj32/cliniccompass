import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Mail, Lock, AlertCircle, Globe, Sparkles, Shield, Heart } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t('error'));
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(language === 'es' 
        ? 'Error al iniciar sesión. Verifica tus credenciales.'
        : 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center hero-pattern py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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

        {/* Header with Animation */}
        <div className="text-center animate-scaleIn">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative gradient-bg rounded-full p-5 shadow-2xl glow animate-float">
              <Compass className="h-20 w-20 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-black mb-3 gradient-text">
            ClinicCompass
          </h2>
          <p className="text-2xl text-gray-700 font-bold mb-2">
            {t('tagline')}
          </p>
          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            {language === 'es' ? 'Gratis • Inteligente • Para Todos' : 'Free • Smart • For Everyone'}
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </p>
        </div>

        {/* Login Form with Glass Effect */}
        <form className="mt-8 space-y-6 card card-glow animate-fadeIn" onSubmit={handleSubmit}>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{t('login')}</h3>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-800 px-5 py-4 rounded-2xl flex items-start gap-3 shadow-lg animate-scaleIn">
              <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span className="text-lg font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-14 group"
                  placeholder="you@example.com"
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-14"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                {t('loading')}
              </>
            ) : (
              <>
                <Shield className="h-6 w-6" />
                {t('login')}
              </>
            )}
          </button>

          {/* Sign up link */}
          <div className="text-center pt-4">
            <p className="text-lg text-gray-600">
              {t('dontHaveAccount')}{' '}
              <Link 
                to="/signup" 
                className="font-bold text-primary hover:text-blue-700 transition-colors underline decoration-2 underline-offset-4"
              >
                {t('signup')}
              </Link>
            </p>
          </div>
        </form>

        {/* Features Footer */}
        <div className="grid grid-cols-3 gap-4 animate-fadeIn">
          {[
            { icon: Heart, text: language === 'es' ? 'Gratis' : 'Free', color: 'text-red-500' },
            { icon: Shield, text: language === 'es' ? 'Seguro' : 'Secure', color: 'text-blue-500' },
            { icon: Sparkles, text: 'AI', color: 'text-yellow-500' }
          ].map((feature, idx) => (
            <div key={idx} className="glass-card p-4 text-center hover:shadow-xl transition-all hover:scale-105">
              <feature.icon className={`h-8 w-8 mx-auto mb-2 ${feature.color}`} />
              <p className="text-sm font-bold text-gray-700">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
