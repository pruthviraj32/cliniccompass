import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getHospitalVisits, addHospitalVisit, deleteHospitalVisit } from '../services/hospitalVisit.service';
import Layout from '../components/Layout';
import { Calendar, Plus, Trash2, MapPin, User } from 'lucide-react';

export default function HospitalVisits() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [visits, setVisits] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    hospital: '',
    date: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    loadVisits();
  }, [user]);

  async function loadVisits() {
    try {
      const data = await getHospitalVisits(user.uid);
      setVisits(data);
    } catch (error) {
      console.error('Error loading visits:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addHospitalVisit(user.uid, formData);
      setFormData({ doctorName: '', hospital: '', date: '', reason: '', notes: '' });
      setShowAddForm(false);
      loadVisits();
    } catch (error) {
      console.error('Error adding visit:', error);
    }
  }

  async function handleDelete(id) {
    if (confirm(language === 'es' ? '¿Eliminar esta visita?' : 'Delete this visit?')) {
      try {
        await deleteHospitalVisit(id);
        loadVisits();
      } catch (error) {
        console.error('Error deleting visit:', error);
      }
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('myVisits')}</h1>
            <p className="text-xl text-gray-600">
              {language === 'es' ? 'Gestiona tus citas médicas' : 'Manage your medical appointments'}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-6 w-6" />
            {t('addVisit')}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="card mb-8 bg-pink-50 border-2 border-pink-200">
            <h2 className="text-2xl font-bold mb-6">{t('addVisit')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t('doctorName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.doctorName}
                  onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t('hospital')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hospital}
                  onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t('date')} *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t('reason')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t('notes')}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-field min-h-[100px]"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button type="submit" className="btn-primary flex-1">{t('save')}</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline flex-1">{t('cancel')}</button>
            </div>
          </form>
        )}

        {/* Upcoming Visits */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('upcoming')}</h2>
          {visits.upcoming.length === 0 ? (
            <div className="card text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-xl text-gray-600">
                {language === 'es' ? 'No hay visitas próximas' : 'No upcoming visits'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {visits.upcoming.map(visit => (
                <div key={visit.id} className="card-interactive bg-green-50 border-2 border-green-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{visit.reason}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="h-5 w-5" />
                          <span className="text-lg">{visit.doctorName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-5 w-5" />
                          <span className="text-lg">{visit.hospital}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-5 w-5" />
                          <span className="text-lg font-semibold">{formatDate(visit.date)}</span>
                        </div>
                      </div>
                      {visit.notes && (
                        <p className="mt-3 text-lg text-gray-600 bg-white p-3 rounded-lg">{visit.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(visit.id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Visits */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('past')}</h2>
          {visits.past.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-xl text-gray-600">
                {language === 'es' ? 'No hay visitas pasadas' : 'No past visits'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {visits.past.map(visit => (
                <div key={visit.id} className="card bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-700 mb-2">{visit.reason}</h3>
                      <p className="text-lg text-gray-600">{visit.doctorName} - {visit.hospital}</p>
                      <p className="text-base text-gray-500 mt-1">{formatDate(visit.date)}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(visit.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

