import { useState } from "react";
import useFetchCities from '../../hooks/useFetchCities';
import useFetchCategories from '../../hooks/useFetchCategories';
import PropTypes from 'prop-types';

export default function AddSeekerModal({ show, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    city: '',
    description: '',
    gender: '',
    isDemanded: false,
    facebook: '',
    languages: [],
    nativeLanguage: '',
    category: '',
    employment: '',
    documents: '',
    note: '',
    announcement: '',
    documentType: '',
  });
  const [error, setError] = useState(null);

  const languageOptions = [
    { value: 'русский', label: 'Русский' },
    { value: 'украинский', label: 'Украинский' },
    { value: 'английский', label: 'Английский' },
    { value: 'иврит', label: 'Иврит' },
  ];

  const { cities, loading: loadingCities } = useFetchCities();
  const { categories, loading: loadingCategories } = useFetchCategories();

  const employmentOptions = [
    { value: 'полная', label: 'Полная' },
    { value: 'частичная', label: 'Частичная' },
  ];

  const documentTypeOptions = [
    { value: 'Виза Б1', label: 'Виза Б1' },
    { value: 'Виза Б2', label: 'Виза Б2' },
    { value: 'Теудат Зеут', label: 'Теудат Зеут' },
    { value: 'Рабочая виза', label: 'Рабочая виза' },
    { value: 'Другое', label: 'Другое' },
  ];

  if (!show) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.city || !form.description || !form.gender) {
      setError('Заполните все поля');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'languages') {
      setForm(f => {
        let langs = f.languages || [];
        if (checked) {
          langs = [...langs, value];
        } else {
          langs = langs.filter(l => l !== value);
        }
        // если убрали родной язык из списка языков — сбросить nativeLanguage
        const nativeLanguage = langs.includes(f.nativeLanguage) ? f.nativeLanguage : '';
        return { ...f, languages: langs, nativeLanguage };
      });
    } else if (name === 'nativeLanguage') {
      setForm(f => ({ ...f, nativeLanguage: value }));
    } else if (type === 'radio') {
      setForm(f => ({ ...f, [name]: value }));
    } else if (type === 'checkbox' && name !== 'languages') {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nativeLanguage || form.languages.length === 0) {
      setError('Выберите хотя бы один язык и отметьте родной');
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="modal show fade" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content p-4" style={{ borderRadius: 16, minWidth: 500, maxWidth: 700 }}>
          <div className="modal-header border-0">
            <h4 className="modal-title">Добавить соискателя</h4>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {step === 1 && (
              <form onSubmit={handleNext}>
                <div className="mb-3">
                  <input name="name" className="form-control" placeholder="Имя" value={form.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <input name="contact" className="form-control" placeholder="Телефон" value={form.contact} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <input name="facebook" className="form-control" placeholder="Ссылка на Facebook (опционально)" value={form.facebook} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <select
                    name="city"
                    className="form-control"
                    value={form.city}
                    onChange={handleChange}
                    required
                    disabled={loadingCities}
                  >
                    <option value="">Выберите город</option>
                    {cities.map(city => (
                      <option key={city.value} value={city.label}>{city.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <textarea name="description" className="form-control" placeholder="Краткое описание" value={form.description} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Пол:</label><br />
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="gender" id="gender-male" value="мужчина" checked={form.gender === 'мужчина'} onChange={handleChange} required />
                    <label className="form-check-label" htmlFor="gender-male">Мужчина</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="gender" id="gender-female" value="женщина" checked={form.gender === 'женщина'} onChange={handleChange} required />
                    <label className="form-check-label" htmlFor="gender-female">Женщина</label>
                  </div>
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" name="isDemanded" id="isDemanded" checked={form.isDemanded} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="isDemanded">
                    Востребованный кандидат
                  </label>
                </div>
                {error && <div className="text-danger mb-2">{error}</div>}
                <button className="btn btn-primary" type="submit">Далее</button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Языки:</label><br />
                  {languageOptions.map(opt => (
                    <div className="form-check form-check-inline" key={opt.value}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="languages"
                        value={opt.value}
                        checked={form.languages.includes(opt.value)}
                        onChange={handleChange}
                        id={`lang-${opt.value}`}
                      />
                      <label className="form-check-label" htmlFor={`lang-${opt.value}`}>{opt.label}</label>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <label className="form-label">Родной язык:</label><br />
                  {form.languages.map(lang => (
                    <div className="form-check form-check-inline" key={lang}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="nativeLanguage"
                        value={lang}
                        checked={form.nativeLanguage === lang}
                        onChange={handleChange}
                        id={`native-${lang}`}
                      />
                      <label className="form-check-label" htmlFor={`native-${lang}`}>{lang}</label>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <select
                    name="category"
                    className="form-control"
                    value={form.category}
                    onChange={handleChange}
                    required
                    disabled={loadingCategories}
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.label}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <select
                    name="employment"
                    className="form-control"
                    value={form.employment}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите тип занятости</option>
                    {employmentOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <select
                    name="documentType"
                    className="form-control"
                    value={form.documentType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите тип документа</option>
                    {documentTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <textarea name="announcement" className="form-control" placeholder="Объявление (детально)" value={form.announcement} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <textarea name="note" className="form-control" placeholder="Примечание" value={form.note} onChange={handleChange} />
                </div>
                {error && <div className="text-danger mb-2">{error}</div>}
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={handleBack}>Назад</button>
                  <button className="btn btn-success" type="submit">Сохранить</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );

} 
AddSeekerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};