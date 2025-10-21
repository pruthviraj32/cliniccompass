import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getMedications } from '../services/medication.service';
import { getHospitalVisits } from '../services/hospitalVisit.service';
import Layout from '../components/Layout';
import { 
  Activity, Pill, Calendar, MapPin, MessageCircle, ArrowRight,
  Heart, Shield, Users, Sparkles, Zap, Star
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [medications, setMedications] = useState([]);
  const [upcomingVisits, setUpcomingVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const [meds, visits] = await Promise.all([
        getMedications(user.uid),
        getHospitalVisits(user.uid)
      ]);
      setMedications(meds);
      setUpcomingVisits(visits.upcoming || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Friend';

  const quickActions = [
    {
      title: t('symptoms'),
      description: language === 'es' 
        ? 'Revisa tus síntomas y obtén orientación'
        : 'Check your symptoms and get guidance',
      icon: Activity,
      href: '/symptoms',
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      iconBg: 'from-blue-400 to-blue-600'
    },
    {
      title: t('medications'),
      description: language === 'es'
        ? 'Rastrea tus medicinas'
        : 'Track your medications',
      icon: Pill,
      href: '/medications',
      gradient: 'from-purple-500 via-purple-600 to-pink-600',
      iconBg: 'from-purple-400 to-pink-500'
    },
    {
      title: t('visits'),
      description: language === 'es'
        ? 'Gestiona tus citas'
        : 'Manage your appointments',
      icon: Calendar,
      href: '/visits',
      gradient: 'from-pink-500 via-pink-600 to-red-600',
      iconBg: 'from-pink-400 to-red-500'
    },
    {
      title: t('clinics'),
      description: language === 'es'
        ? 'Encuentra clínicas cercanas'
        : 'Find nearby clinics',
      icon: MapPin,
      href: '/clinics',
      gradient: 'from-green-500 via-emerald-600 to-teal-600',
      iconBg: 'from-green-400 to-emerald-500'
    },
    {
      title: t('chat'),
      description: language === 'es'
        ? 'Haz preguntas de salud'
        : 'Ask health questions',
      icon: MessageCircle,
      href: '/chat',
      gradient: 'from-indigo-500 via-purple-600 to-pink-600',
      iconBg: 'from-indigo-400 to-purple-500'
    },
  ];

  const stats = [
    {
      title: language === 'es' ? 'Medicinas Activas' : 'Active Medications',
      value: medications.length,
      icon: Pill,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      title: language === 'es' ? 'Próximas Visitas' : 'Upcoming Visits',
      value: upcomingVisits.length,
      icon: Calendar,
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
  ];

  return (
    <Layout>
      <div className="animate-fadeIn space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute inset-0 gradient-bg opacity-90"></div>
          <div className="absolute inset-0 hero-pattern"></div>
          <div className="relative p-8 lg:p-12 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-10 w-10 text-yellow-300 animate-pulse" />
                  <h1 className="text-4xl lg:text-5xl font-black">
                    {language === 'es' ? `¡Hola, ${displayName}!` : `Hello, ${displayName}!`}
                  </h1>
                </div>
                <p className="text-2xl font-semibold opacity-90 mb-2">
                  {t('tagline')}
                </p>
                <p className="text-xl opacity-80">
                  {language === 'es'
                    ? 'Tu salud es lo más importante. ¿Qué necesitas hoy?'
                    : 'Your health is important. What do you need today?'}
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float shadow-2xl">
                  <Heart className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`card card-glow bg-gradient-to-br ${stat.bgGradient} border-2 border-white hover:scale-105 transition-transform`}>
                <div className="flex items-center gap-6">
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-2xl`}>
                    <Icon className="h-14 w-14 text-white" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-600 font-bold mb-1">{stat.title}</p>
                    <p className="text-6xl font-black text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Grid */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-black text-gray-900">
              {language === 'es' ? 'Acciones Rápidas' : 'Quick Actions'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.href}
                  className="card card-interactive card-glow group hover:scale-105 transition-all duration-300"
                >
                  <div className="relative">
                    <div className={`inline-block p-5 rounded-2xl bg-gradient-to-br ${action.iconBg} shadow-xl mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-5 leading-relaxed">
                    {action.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-lg group-hover:gap-4 transition-all">
                    <span>{language === 'es' ? 'Comenzar' : 'Get Started'}</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Heart,
              title: language === 'es' ? 'Siempre Gratis' : 'Always Free',
              description: language === 'es'
                ? 'Todos nuestros servicios son 100% gratuitos para siempre'
                : 'All our services are 100% free forever',
              gradient: 'from-red-500 to-pink-500'
            },
            {
              icon: Shield,
              title: language === 'es' ? 'Privado y Seguro' : 'Private & Secure',
              description: language === 'es'
                ? 'Tu información está protegida con encriptación de nivel empresarial'
                : 'Your information is protected with enterprise-level encryption',
              gradient: 'from-blue-500 to-indigo-500'
            },
            {
              icon: Users,
              title: language === 'es' ? 'Para Todos' : 'For Everyone',
              description: language === 'es'
                ? 'Diseñado específicamente para comunidades con bajos recursos'
                : 'Designed specifically for underserved communities',
              gradient: 'from-green-500 to-emerald-500'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="card card-glow text-center hover:scale-105 transition-transform">
                <div className={`inline-block p-5 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-xl mb-4`}>
                  <Icon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </Layout>
  );
}
