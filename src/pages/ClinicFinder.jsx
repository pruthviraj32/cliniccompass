import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { findNearbyClinics, getDirectionsUrl, getCallUrl } from '../services/clinicFinder.service';
import Layout from '../components/Layout';
import { MapPin, Phone, Navigation, DollarSign, Clock, Search } from 'lucide-react';

export default function ClinicFinder() {
  const { t, language } = useLanguage();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [locationError, setLocationError] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    handleSearch();
  }, []);

  async function handleSearch() {
    setLoading(true);
    setLocationError(false);
    try {
      const results = await findNearbyClinics(null, filter);
      setClinics(results);
    } catch (error) {
      console.error('Error finding clinics:', error);
      setLocationError(true);
    } finally {
      setLoading(false);
    }
  }

  function getCostBadge(cost) {
    const badges = {
      free: { label: t('free'), color: 'bg-green-100 text-green-800' },
      low: { label: t('lowCost'), color: 'bg-yellow-100 text-yellow-800' },
      sliding: { label: language === 'es' ? 'Escala' : 'Sliding Scale', color: 'bg-blue-100 text-blue-800' }
    };
    return badges[cost] || badges.free;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-block bg-secondary rounded-full p-4 mb-4">
            <MapPin className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('findClinics')}</h1>
          <p className="text-2xl text-gray-600">
            {language === 'es' 
              ? 'Encuentra clínicas gratis o de bajo costo cerca de ti'
              : 'Find free or low-cost clinics near you'}
          </p>
        </div>

        {/* Location info banner */}
        <div className="card bg-blue-50 border border-blue-200 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {language === 'es' ? '📍 Usando tu ubicación' : '📍 Using Your Location'}
              </h3>
              <p className="text-base text-gray-700">
                {language === 'es' 
                  ? 'Necesitamos tu permiso para encontrar clínicas cerca de ti. Haz clic en "Permitir" cuando tu navegador lo solicite.'
                  : 'We need your permission to find clinics near you. Click "Allow" when your browser asks for location access.'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => { setFilter('all'); handleSearch(); }}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                filter === 'all'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'es' ? 'Todas' : 'All'}
            </button>
            <button
              onClick={() => { setFilter('free'); handleSearch(); }}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                filter === 'free'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'es' ? 'Solo Gratis' : 'Free Only'}
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">{t('searching')}</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {clinics.map(clinic => {
              const costBadge = getCostBadge(clinic.cost);
              return (
                <div key={clinic.id} className="card-interactive">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{clinic.name}</h3>
                      <span className={`badge ${costBadge.color} text-lg px-4 py-2`}>
                        {costBadge.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary">
                        {clinic.distance} {t('distance')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                      <span className="text-lg">{clinic.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="h-5 w-5 flex-shrink-0" />
                      <a href={getCallUrl(clinic.phone)} className="text-lg hover:text-primary underline">
                        {clinic.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="h-5 w-5 flex-shrink-0" />
                      <span className="text-lg">{clinic.hours}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-base font-semibold text-gray-700 mb-2">
                      {language === 'es' ? 'Servicios:' : 'Services:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {clinic.services.map((service, idx) => (
                        <span key={idx} className="badge badge-blue text-base px-3 py-1">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={getDirectionsUrl(clinic)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
                    >
                      <Navigation className="h-5 w-5" />
                      {t('getDirections')}
                    </a>
                    <a
                      href={getCallUrl(clinic.phone)}
                      className="btn-secondary flex-1 text-center flex items-center justify-center gap-2"
                    >
                      <Phone className="h-5 w-5" />
                      {t('call')}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

