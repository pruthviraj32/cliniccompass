import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getMedications, addMedication, deleteMedication } from '../services/medication.service';
import Layout from '../components/Layout';
import { Pill, Plus, Trash2, Clock } from 'lucide-react';

export default function Medications() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '08:00',
    instructions: ''
  });

  useEffect(() => {
    loadMedications();
  }, [user]);

  async function loadMedications() {
    try {
      const meds = await getMedications(user.uid);
      setMedications(meds);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addMedication(user.uid, formData);
      setFormData({ name: '', dosage: '', frequency: 'daily', time: '08:00', instructions: '' });
      setShowAddForm(false);
      loadMedications();
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  }

  async function handleDelete(id) {
    if (confirm(language === 'es' ? '¿Eliminar esta medicina?' : 'Delete this medication?')) {
      try {
        await deleteMedication(id);
        loadMedications();
      } catch (error) {
        console.error('Error deleting medication:', error);
      }
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('myMedications')}</h1>
            <p className="text-xl text-gray-600">
              {language === 'es' ? 'Rastrea todas tus medicinas' : 'Track all your medications'}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-6 w-6" />
            {t('addMedication')}
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="card mb-8 bg-blue-50 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-6">{t('addMedication')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t('medicineName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder={language === 'es' ? 'Aspirina' : 'Aspirin'}
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t('dosage')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.dosage}
                  onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                  className="input-field"
                  placeholder="100mg"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t('frequency')} *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  className="input-field"
                >
                  <option value="daily">{language === 'es' ? 'Una vez al día' : 'Once daily'}</option>
                  <option value="twice_daily">{language === 'es' ? 'Dos veces al día' : 'Twice daily'}</option>
                  <option value="three_times_daily">{language === 'es' ? 'Tres veces al día' : 'Three times daily'}</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t('time')} *
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t('instructions')}
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  className="input-field min-h-[100px]"
                  placeholder={language === 'es' ? 'Tomar con comida' : 'Take with food'}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button type="submit" className="btn-primary flex-1">{t('save')}</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline flex-1">{t('cancel')}</button>
            </div>
          </form>
        )}

        {/* Medications List */}
        {loading ? (
          <div className="text-center py-12">{t('loading')}</div>
        ) : medications.length === 0 ? (
          <div className="card text-center py-12">
            <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-2xl text-gray-600">
              {language === 'es' ? 'No hay medicinas registradas' : 'No medications yet'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {medications.map(med => (
              <div key={med.id} className="card-interactive">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{med.name}</h3>
                    <p className="text-xl text-gray-700 mb-3">{med.dosage}</p>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="h-5 w-5" />
                      <span className="text-lg">{med.time} - {med.frequency}</span>
                    </div>
                    {med.instructions && (
                      <p className="text-lg text-gray-600 bg-gray-50 p-3 rounded-lg mt-3">
                        {med.instructions}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(med.id)}
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
    </Layout>
  );
}

