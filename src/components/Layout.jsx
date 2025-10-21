import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Compass, Home, Activity, Pill, Calendar, MapPin, MessageCircle, 
  LogOut, Globe, Menu, X, Sparkles, User, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('symptoms'), href: '/symptoms', icon: Activity },
    { name: t('medications'), href: '/medications', icon: Pill },
    { name: t('visits'), href: '/visits', icon: Calendar },
    { name: t('clinics'), href: '/clinics', icon: MapPin },
    { name: t('chat'), href: '/chat', icon: MessageCircle },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-72' : 'w-20'
      }`}>
        <div className="flex-1 flex flex-col glass-card rounded-none border-r-2 border-white/20 shadow-2xl">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative gradient-bg rounded-full p-3 shadow-xl">
                  <Compass className="h-8 w-8 text-white" />
                </div>
              </div>
              {sidebarOpen && (
                <div>
                  <span className="text-xl font-black gradient-text block">ClinicCompass</span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    {language === 'es' ? 'IA Para Todos' : 'AI for Everyone'}
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="p-4 border-b border-white/20">
            <div className={`bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-4 ${sidebarOpen ? '' : 'px-2'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-xl scale-105'
                      : 'text-gray-700 hover:bg-white/80 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-50"></div>
                  )}
                  <Icon className={`h-6 w-6 relative z-10 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                  {sidebarOpen && (
                    <span className="text-base relative z-10 flex-1">{item.name}</span>
                  )}
                  {sidebarOpen && isActive && (
                    <ChevronRight className="h-5 w-5 relative z-10" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/20 space-y-2">
            <button
              onClick={toggleLanguage}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-xl transition-all hover:scale-105 font-bold ${
                sidebarOpen ? '' : 'justify-center'
              }`}
            >
              <Globe className="h-6 w-6 text-primary" />
              {sidebarOpen && (
                <span className="text-primary flex-1 text-left">{language === 'en' ? 'Español' : 'English'}</span>
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all font-bold hover:scale-105 ${
                sidebarOpen ? '' : 'justify-center'
              }`}
            >
              <LogOut className="h-6 w-6" />
              {sidebarOpen && <span className="flex-1 text-left">{t('logout')}</span>}
            </button>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-2 border-primary"
          >
            <ChevronRight className={`h-4 w-4 text-primary transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        {/* Top Bar for Mobile */}
        <div className="lg:hidden glass-card sticky top-0 z-40 border-b-2 border-white/20 shadow-xl">
          <div className="px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <div className="gradient-bg rounded-full p-2 shadow-lg">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-black gradient-text">ClinicCompass</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl hover:bg-white/80 transition-all"
              >
                {mobileMenuOpen ? (
                  <X className="h-8 w-8 text-primary" />
                ) : (
                  <Menu className="h-8 w-8 text-primary" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="mt-4 space-y-2 animate-fadeIn">
                {/* User Profile */}
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-5 py-4 rounded-xl font-bold text-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-xl'
                          : 'bg-white/60 text-gray-700 hover:bg-white hover:shadow-lg'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Language & Logout */}
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center gap-3 px-5 py-4 bg-white/80 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                >
                  <Globe className="h-6 w-6 text-primary" />
                  <span className="text-primary">{language === 'en' ? 'Cambiar a Español' : 'Switch to English'}</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                >
                  <LogOut className="h-6 w-6" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="glass-card border-t-2 border-white/20 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2 mb-2">
                {language === 'es' 
                  ? '🌟 Hecho con ❤️ para todos' 
                  : '🌟 Made with ❤️ for everyone'}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'es'
                  ? 'Atención: Esta no es un consejo médico profesional. Siempre consulta a un doctor.'
                  : 'Disclaimer: This is not professional medical advice. Always consult a doctor.'}
              </p>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  AI-Powered
                </span>
                <span>•</span>
                <span>100% Free</span>
                <span>•</span>
                <span>Privacy First</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
